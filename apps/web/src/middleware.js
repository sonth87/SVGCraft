import { NextResponse } from 'next/server';

// Known automated HTTP clients, scrapers, headless browsers, and bulk downloaders
const SCRAPER_UA_REGEX =
  /(?:curl|wget|python-requests|python-urllib|aiohttp|httpx|scrapy|go-http-client|axios|node-fetch|undici|postmanruntime|insomnia|libwww-perl|okhttp|apache-httpclient|java\/|php\/|ruby|headlesschrome|phantomjs|playwright|puppeteer|selenium|cypress|httrack|teleport|webcopier|bytespider|gptbot|claudebot|ccbot|ahrefsbot|semrushbot|mj12bot|dotbot|petalbot|dataforseobot|barkrowler|censys|zgrab|masscan|nmap|nikto|sqlmap)/i;

// Search engine & social preview bots (allowed on HTML pages, blocked from bulk-crawling /api/* and /output/*)
const BOT_UA_REGEX =
  /(?:bot|crawler|spider|slurp|archiver|facebookexternalhit|whatsapp|telegrambot|discordbot|twitterbot|linkedinbot)/i;

// Per-instance sliding-window rate limiter & spike detector
const ipStore = new Map();
let lastCleanupTs = Date.now();

const globalWindow = {
  burstStart: Date.now(),
  burstCount: 0,
  minuteStart: Date.now(),
  minuteCount: 0,
};

// Thresholds
const GLOBAL_BURST_SPIKE_THRESHOLD = 280; // >280 API reqs / 10s globally triggers Spike Protection Mode
const GLOBAL_MINUTE_SPIKE_THRESHOLD = 1200; // >1200 API reqs / 60s globally
const PENALTY_BAN_MS = 15 * 60 * 1000; // 15-minute temporary ban after 3 rate-limit violations

function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}

function cleanupStaleIps(now) {
  if (now - lastCleanupTs < 60_000) return;
  lastCleanupTs = now;
  for (const [ip, rec] of ipStore.entries()) {
    if (rec.bannedUntil < now && now - rec.lastSeen > 120_000) {
      ipStore.delete(ip);
    }
  }
}

function checkRateLimit(ip, bucket, now) {
  cleanupStaleIps(now);

  // Update global API traffic counter for spike detection
  if (bucket !== 'asset') {
    if (now - globalWindow.burstStart > 10_000) {
      globalWindow.burstStart = now;
      globalWindow.burstCount = 0;
    }
    if (now - globalWindow.minuteStart > 60_000) {
      globalWindow.minuteStart = now;
      globalWindow.minuteCount = 0;
    }
    globalWindow.burstCount += 1;
    globalWindow.minuteCount += 1;
  }

  const isGlobalSpike =
    globalWindow.burstCount > GLOBAL_BURST_SPIKE_THRESHOLD ||
    globalWindow.minuteCount > GLOBAL_MINUTE_SPIKE_THRESHOLD;

  // Base limits per IP (automatically halved during a global traffic spike)
  const scale = isGlobalSpike ? 0.5 : 1;
  const limits = {
    detail: { burst: Math.max(8, Math.floor(16 * scale)), minute: Math.max(20, Math.floor(45 * scale)) },
    api: { burst: Math.max(12, Math.floor(28 * scale)), minute: Math.max(40, Math.floor(90 * scale)) },
    asset: { burst: Math.max(80, Math.floor(160 * scale)), minute: Math.max(180, Math.floor(420 * scale)) },
  }[bucket] || { burst: 25, minute: 80 };

  let rec = ipStore.get(ip);
  if (!rec) {
    rec = {
      lastSeen: now,
      bannedUntil: 0,
      strikes: 0,
      buckets: {},
    };
    ipStore.set(ip, rec);
  }
  rec.lastSeen = now;

  if (rec.bannedUntil > now) {
    const retryAfterSec = Math.ceil((rec.bannedUntil - now) / 1000);
    return { allowed: false, retryAfterSec, reason: 'ip-temp-banned', isGlobalSpike };
  }

  let b = rec.buckets[bucket];
  if (!b) {
    b = { burstStart: now, burstCount: 0, minuteStart: now, minuteCount: 0 };
    rec.buckets[bucket] = b;
  }

  if (now - b.burstStart > 10_000) {
    b.burstStart = now;
    b.burstCount = 0;
  }
  if (now - b.minuteStart > 60_000) {
    b.minuteStart = now;
    b.minuteCount = 0;
  }

  b.burstCount += 1;
  b.minuteCount += 1;

  if (b.burstCount > limits.burst || b.minuteCount > limits.minute) {
    rec.strikes += 1;
    if (rec.strikes >= 3) {
      rec.bannedUntil = now + PENALTY_BAN_MS;
      return {
        allowed: false,
        retryAfterSec: Math.ceil(PENALTY_BAN_MS / 1000),
        reason: 'penalty-ban',
        isGlobalSpike,
      };
    }
    return {
      allowed: false,
      retryAfterSec: b.burstCount > limits.burst ? 10 : 60,
      reason: 'rate-limit',
      isGlobalSpike,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limits.minute - b.minuteCount),
    isGlobalSpike,
  };
}

function isSameOriginRequest(request) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const secFetchSite = (request.headers.get('sec-fetch-site') || '').toLowerCase();

  if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'same-site' && secFetchSite !== 'none') {
    return false;
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const originHost = new URL(origin).host.toLowerCase();
      if (host && originHost !== host) return false;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refHost = new URL(referer).host.toLowerCase();
      if (host && refHost !== host) return false;
    } catch {
      return false;
    }
  }

  return true;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const now = Date.now();
  const ip = getClientIp(request);

  // 1. Block empty User-Agents and known scraper/crawler tools everywhere
  if (!ua || ua.length < 8 || SCRAPER_UA_REGEX.test(ua)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const isApiRoute = pathname.startsWith('/api/');
  const isAssetRoute = pathname.startsWith('/output/');

  // 2. Protect /api/* and /output/* from bots, cross-origin hotlinking, and direct URL scraping
  if (isApiRoute || isAssetRoute) {
    if (BOT_UA_REGEX.test(ua)) {
      return new NextResponse('Forbidden for automated crawlers', { status: 403 });
    }

    if (!isSameOriginRequest(request)) {
      return new NextResponse('Forbidden: Cross-origin access denied', { status: 403 });
    }

    const secFetchMode = (request.headers.get('sec-fetch-mode') || '').toLowerCase();
    const secFetchDest = (request.headers.get('sec-fetch-dest') || '').toLowerCase();
    const hasSessionCookie = request.cookies.get('__svgc_v')?.value === '1';

    if (isApiRoute) {
      // Block direct browser navigation to /api/* (e.g. typing /api/catalog/icons in address bar or scraper tab)
      if (secFetchMode === 'navigate' || secFetchDest === 'document') {
        return NextResponse.json({ error: 'Direct API navigation is disabled.' }, { status: 403 });
      }

      // Require client handshake header sent by SVGCraft frontend
      const clientHeader = request.headers.get('x-svgcraft-client');
      if (clientHeader !== 'web-v2') {
        return NextResponse.json({ error: 'Unauthorized client request.' }, { status: 403 });
      }
    }

    if (isAssetRoute) {
      // Prevent bulk downloading /output/*.svg without an active page session or same-origin referer
      const referer = request.headers.get('referer') || '';
      if (!hasSessionCookie && !referer && secFetchDest === 'document') {
        return new NextResponse('Forbidden: Direct asset scraping is disabled', { status: 403 });
      }
    }

    // 3. Apply Sliding-Window Rate Limiter & Spike Circuit Breaker
    const bucket = pathname.startsWith('/api/catalog/icon/')
      ? 'detail'
      : isApiRoute
        ? 'api'
        : 'asset';

    const rl = checkRateLimit(ip, bucket, now);

    // During a global traffic spike, strictly require the session cookie
    if (rl.isGlobalSpike && !hasSessionCookie) {
      return new NextResponse('Service busy, please reload the page.', {
        status: 429,
        headers: { 'Retry-After': '15' },
      });
    }

    if (!rl.allowed) {
      const headers = {
        'Retry-After': String(rl.retryAfterSec || 30),
        'X-RateLimit-Reason': rl.reason,
      };
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Too many requests. Please slow down and try again shortly.' },
          { status: 429, headers }
        );
      }
      return new NextResponse('Too Many Requests', { status: 429, headers });
    }

    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // 4. For HTML page navigations (/, /icon/*, /collection/*), set the verification cookie
  const response = NextResponse.next();
  if (!request.cookies.get('__svgc_v')) {
    response.cookies.set('__svgc_v', '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
  }
  return response;
}

export const config = {
  matcher: ['/', '/icon/:path*', '/collection/:path*', '/api/:path*', '/output/:path*'],
};
