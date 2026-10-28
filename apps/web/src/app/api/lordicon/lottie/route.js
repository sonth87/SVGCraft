import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ALLOWED_FAMILIES = new Set(['system', 'doodle', 'wired']);
const ALLOWED_STYLES = new Set([
  'outline',
  'solid',
  'color',
  'motif',
  'black',
  'flat',
  'lineal',
  'gradient',
]);

function decodeLordiconLiBuffer(b64Text = '') {
  const buf = Buffer.from(String(b64Text || '').trim(), 'base64');
  const out = Buffer.allocUnsafe(buf.length);
  for (let i = 0; i < buf.length; i++) {
    out[i] = buf[i] ^ 42;
  }
  return JSON.parse(out.toString('utf8'));
}

function cleanLordiconSvg(svgContent = '') {
  if (!svgContent || !svgContent.includes('<svg')) return svgContent;
  return svgContent
    .replace(/<path\b(?![^>]*\bid=)[^>]*\bstyle=["']display:\s*none;?["'][^>]*\/>/gi, '')
    .replace(/<g\b(?![^>]*\bid=)[^>]*\bstyle=["']display:\s*none;?["'][^>]*>\s*<\/g>/gi, '');
}

function extractMotionStates(lottie = {}) {
  const markers = Array.isArray(lottie.markers) ? lottie.markers : [];
  const totalFrames = Number(lottie.op) || 60;
  const startFrameDefault = Number(lottie.ip) || 0;

  if (markers.length === 0) {
    return [
      {
        id: 'default',
        label: 'Default Motion',
        rawName: 'default',
        isDefault: true,
        startFrame: startFrameDefault,
        endFrame: totalFrames,
        durationFrames: Math.max(1, totalFrames - startFrameDefault),
      },
    ];
  }

  return markers.map((m, idx) => {
    const rawName = String(m.cm || `state-${idx + 1}`).trim();
    const isDefault = rawName.startsWith('default:');
    const cleaned = rawName.replace(/^default:/i, '').replace(/:[\d.]+$/, '');
    const startFrame = Math.max(0, Math.round(Number(m.tm) || 0));
    const durationFrames = Math.max(1, Math.round(Number(m.dr) || 30));
    const endFrame = startFrame + durationFrames;

    return {
      id: cleaned || `state-${idx + 1}`,
      label: cleaned
        .split(/[-_]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      rawName,
      isDefault,
      startFrame,
      endFrame,
      durationFrames,
    };
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let family = (searchParams.get('family') || '').toLowerCase().trim();
    let style = (searchParams.get('style') || '').toLowerCase().trim();
    const collection = (searchParams.get('collection') || '').toLowerCase().trim();
    const rawSlug = (searchParams.get('slug') || '').trim();
    const includeSvg = searchParams.get('includeSvg') === '1';

    if ((!family || !style) && collection.startsWith('lordicon-')) {
      const parts = collection.replace(/^lordicon-/, '').split('-');
      if (parts.length >= 2) {
        family = family || parts[0];
        style = style || parts.slice(1).join('-');
      }
    }

    const slug = rawSlug.replace(/\.svg$/i, '').replace(/\.li$/i, '');

    if (!ALLOWED_FAMILIES.has(family) || !ALLOWED_STYLES.has(style) || !slug) {
      return NextResponse.json(
        { error: 'Tham số family, style hoặc slug không hợp lệ.' },
        { status: 400 }
      );
    }

    const liUrl = `https://media.lordicon.com/icons/${family}/${style}/${encodeURIComponent(slug)}.li`;
    const svgUrl = `https://media.lordicon.com/icons/${family}/${style}/${encodeURIComponent(slug)}.svg`;

    const fetchPromises = [
      fetch(liUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
      }),
    ];

    if (includeSvg) {
      fetchPromises.push(
        fetch(svgUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            Accept: 'image/svg+xml,*/*;q=0.8',
          },
        })
      );
    }

    const [liRes, svgRes] = await Promise.all(fetchPromises);
    if (!liRes.ok) {
      return NextResponse.json(
        { error: `Không tìm thấy dữ liệu animation Lordicon (${liRes.status}).` },
        { status: liRes.status }
      );
    }

    const b64Text = await liRes.text();
    const lottie = decodeLordiconLiBuffer(b64Text);
    const states = extractMotionStates(lottie);

    let rawSvg = null;
    if (svgRes && svgRes.ok) {
      const svgText = await svgRes.text();
      if (svgText && svgText.includes('<svg')) {
        rawSvg = cleanLordiconSvg(svgText);
      }
    }

    return NextResponse.json(
      {
        family,
        style,
        slug,
        states,
        lottie,
        ...(rawSvg ? { rawSvg } : {}),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
