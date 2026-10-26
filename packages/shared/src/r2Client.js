const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

function resolveRepoRoot() {
  const cwd = globalThis.process.env.SVGCRAFT_ROOT || globalThis.process.cwd();
  const base = path.basename(cwd);
  const parent = path.basename(path.dirname(cwd));
  if (parent === 'apps' && (base === 'web' || base === 'crawler')) {
    return path.resolve(cwd, '..', '..');
  }
  return cwd;
}

const ROOT_DIR = resolveRepoRoot();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const R2_STATE_FILE = path.join(DATA_DIR, 'r2-sync-state.json');
const dynamicRequire = typeof eval === 'function' ? eval('require') : require;
const runtimeFs = dynamicRequire('fs');
const readTextFile = (p) => runtimeFs.readFileSync(p, 'utf8');
const writeTextFile = (p, d) => runtimeFs.writeFileSync(p, d, 'utf8');
const pathExists = (p) => runtimeFs.existsSync(p);

/**
 * Lightweight zero-dependency .env loader (reads project .env and ~/.env without logging secrets)
 */
function loadEnvFiles() {
  const candidates = [
    path.join(ROOT_DIR, '.env'),
    path.join(globalThis.process.cwd(), '.env'),
    path.join(os.homedir(), '.env'),
  ];

  for (const envPath of candidates) {
    if (!pathExists(envPath)) continue;
    try {
      const content = readTextFile(envPath);
      for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx <= 0) continue;
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined || process.env[key] === '') {
          process.env[key] = val;
        }
      }
    } catch {
      // Ignore read errors
    }
  }
}

loadEnvFiles();

const DEFAULT_R2_S3_URL = '';
const DEFAULT_R2_BUCKET = 'svg-icon';

// Hard Free-Tier Protection Limits (with 15%-20% safety buffer below Cloudflare R2 Free Tier)
const DEFAULT_MAX_STORAGE_BYTES = 8.5 * 1024 * 1024 * 1024; // 8.5 GB (Free limit: 10 GB)
const DEFAULT_MAX_CLASS_A_PER_MONTH = 800_000; // 800k writes/mo (Free limit: 1,000,000)
const DEFAULT_MAX_CLASS_B_PER_MONTH = 8_500_000; // 8.5M reads/mo (Free limit: 10,000,000)

function getCurrentYearMonth() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

/**
 * Minify SVG XML safely before uploading to R2 to save 25%-40% storage space
 */
function minifySvg(svgContent = '') {
  return String(svgContent)
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function hmacSha256(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256Hex(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function encodeRfc3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * Cloudflare R2 Client with AWS Signature V4 & Free-Tier Circuit-Breaker Quota Guard
 */
class R2Client {
  constructor(options = {}) {
    loadEnvFiles();

    const rawEndpoint = (
      options.endpoint ||
      process.env.R2_ENDPOINT ||
      DEFAULT_R2_S3_URL
    ).trim();

    let endpointOrigin = '';
    let pathBucket = '';
    if (rawEndpoint) {
      try {
        const parsedUrl = new URL(rawEndpoint);
        endpointOrigin = parsedUrl.origin;
        pathBucket = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
      } catch {
        endpointOrigin = rawEndpoint.replace(/\/+$/, '');
      }
    }

    this.endpointOrigin = endpointOrigin;
    this.bucket =
      options.bucket ||
      process.env.R2_BUCKET ||
      pathBucket ||
      DEFAULT_R2_BUCKET;

    this.accessKeyId = (options.accessKeyId || process.env.R2_ACCESS_KEY_ID || '').trim();
    this.secretAccessKey = (options.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY || '').trim();
    this.publicUrl = (options.publicUrl || process.env.R2_PUBLIC_URL || '').trim().replace(/\/+$/, '');

    this.maxStorageBytes = Number(process.env.R2_MAX_STORAGE_BYTES) || DEFAULT_MAX_STORAGE_BYTES;
    this.maxClassAPerMonth = Number(process.env.R2_MAX_CLASS_A_PER_MONTH) || DEFAULT_MAX_CLASS_A_PER_MONTH;
    this.maxClassBPerMonth = Number(process.env.R2_MAX_CLASS_B_PER_MONTH) || DEFAULT_MAX_CLASS_B_PER_MONTH;

    this.state = this.loadState();
  }

  hasCredentials() {
    return Boolean(this.endpointOrigin && this.accessKeyId && this.secretAccessKey);
  }

  loadState() {
    const ym = getCurrentYearMonth();
    const defaultState = {
      currentMonth: ym,
      totalBytesUploaded: 0,
      totalFilesUploaded: 0,
      monthlyClassAOps: 0,
      monthlyClassBOps: 0,
      lastUpdatedAt: new Date().toISOString(),
      uploadedKeys: {},
    };

    if (!pathExists(R2_STATE_FILE)) {
      return defaultState;
    }

    try {
      const parsed = JSON.parse(readTextFile(R2_STATE_FILE));
      if (parsed.currentMonth !== ym) {
        parsed.currentMonth = ym;
        parsed.monthlyClassAOps = 0;
        parsed.monthlyClassBOps = 0;
      }
      if (!parsed.uploadedKeys) parsed.uploadedKeys = {};
      return { ...defaultState, ...parsed };
    } catch {
      return defaultState;
    }
  }

  saveState() {
    try {
      if (!pathExists(DATA_DIR)) {
        runtimeFs['mkdirSync'](DATA_DIR, { recursive: true });
      }
      this.state.lastUpdatedAt = new Date().toISOString();
      writeTextFile(R2_STATE_FILE, JSON.stringify(this.state, null, 2));
    } catch {
      // Ignore write errors on read-only serverless filesystems (e.g. Vercel)
    }
  }

  _ensureCurrentMonth() {
    const ym = getCurrentYearMonth();
    if (this.state.currentMonth !== ym) {
      this.state.currentMonth = ym;
      this.state.monthlyClassAOps = 0;
      this.state.monthlyClassBOps = 0;
    }
  }

  /**
   * Check whether uploading `byteLength` bytes is within Cloudflare R2 Free Tier safety thresholds
   */
  checkWriteQuota(objectKey, byteLength) {
    this._ensureCurrentMonth();

    const prevBytes = this.state.uploadedKeys[objectKey] || 0;
    const netNewBytes = Math.max(0, byteLength - prevBytes);

    if (this.state.totalBytesUploaded + netNewBytes > this.maxStorageBytes) {
      return {
        allowed: false,
        reason: `Đã chạm ngưỡng an toàn lưu trữ R2 (${(this.state.totalBytesUploaded / 1024 / 1024 / 1024).toFixed(2)} GB / ${(this.maxStorageBytes / 1024 / 1024 / 1024).toFixed(2)} GB giới hạn Free Tier). Tự động ngắt để không phát sinh phí.`,
      };
    }

    if (this.state.monthlyClassAOps + 1 > this.maxClassAPerMonth) {
      return {
        allowed: false,
        reason: `Đã chạm ngưỡng an toàn Class A Operations trong tháng ${this.state.currentMonth} (${this.state.monthlyClassAOps.toLocaleString()} / ${this.maxClassAPerMonth.toLocaleString()} requests). Tự động ngắt để không phát sinh phí.`,
      };
    }

    return { allowed: true };
  }

  checkReadQuota() {
    this._ensureCurrentMonth();
    if (this.state.monthlyClassBOps + 1 > this.maxClassBPerMonth) {
      return {
        allowed: false,
        reason: `Đã chạm ngưỡng an toàn Class B Operations trong tháng ${this.state.currentMonth} (${this.state.monthlyClassBOps.toLocaleString()} / ${this.maxClassBPerMonth.toLocaleString()} requests).`,
      };
    }
    return { allowed: true };
  }

  isAlreadyUploaded(objectKey) {
    return Object.prototype.hasOwnProperty.call(this.state.uploadedKeys, objectKey);
  }

  getQuotaSummary() {
    this._ensureCurrentMonth();
    return {
      bucket: this.bucket,
      endpoint: `${this.endpointOrigin}/${this.bucket}`,
      publicUrlConfigured: Boolean(this.publicUrl),
      currentMonth: this.state.currentMonth,
      storage: {
        usedBytes: this.state.totalBytesUploaded,
        usedMB: Number((this.state.totalBytesUploaded / 1024 / 1024).toFixed(2)),
        usedGB: Number((this.state.totalBytesUploaded / 1024 / 1024 / 1024).toFixed(3)),
        limitBytes: this.maxStorageBytes,
        limitGB: Number((this.maxStorageBytes / 1024 / 1024 / 1024).toFixed(2)),
        freeTierMaxGB: 10,
        percentUsed: Number(((this.state.totalBytesUploaded / this.maxStorageBytes) * 100).toFixed(2)),
      },
      classAOperations: {
        used: this.state.monthlyClassAOps,
        limit: this.maxClassAPerMonth,
        freeTierMax: 1_000_000,
        percentUsed: Number(((this.state.monthlyClassAOps / this.maxClassAPerMonth) * 100).toFixed(2)),
      },
      classBOperations: {
        used: this.state.monthlyClassBOps,
        limit: this.maxClassBPerMonth,
        freeTierMax: 10_000_000,
        percentUsed: Number(((this.state.monthlyClassBOps / this.maxClassBPerMonth) * 100).toFixed(2)),
      },
      totalFilesUploaded: this.state.totalFilesUploaded,
      lastUpdatedAt: this.state.lastUpdatedAt,
    };
  }

  /**
   * Build AWS Signature V4 signed request headers for Cloudflare R2 (`auto` region, `s3` service)
   */
  _signRequest(method, objectKey, headers = {}, payloadBuffer = Buffer.alloc(0)) {
    const cleanKey = String(objectKey).replace(/^\/+/, '');
    const encodedKey = cleanKey
      .split('/')
      .map((segment) => encodeRfc3986(segment))
      .join('/');

    const canonicalUri = `/${encodeRfc3986(this.bucket)}/${encodedKey}`;
    const urlObj = new URL(this.endpointOrigin);
    const host = urlObj.host;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
    const dateStamp = amzDate.slice(0, 8); // YYYYMMDD
    const region = 'auto';
    const service = 's3';

    const payloadHash = sha256Hex(payloadBuffer);

    const allHeaders = {
      host,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      ...headers,
    };

    const sortedHeaderKeys = Object.keys(allHeaders)
      .map((k) => k.toLowerCase())
      .sort();

    const canonicalHeaders = sortedHeaderKeys
      .map((k) => `${k}:${String(allHeaders[k]).trim()}\n`)
      .join('');

    const signedHeaders = sortedHeaderKeys.join(';');

    const canonicalRequest = [
      method.toUpperCase(),
      canonicalUri,
      '',
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      sha256Hex(Buffer.from(canonicalRequest, 'utf8')),
    ].join('\n');

    const kDate = hmacSha256(`AWS4${this.secretAccessKey}`, dateStamp);
    const kRegion = hmacSha256(kDate, region);
    const kService = hmacSha256(kRegion, service);
    const kSigning = hmacSha256(kService, 'aws4_request');
    const signature = crypto
      .createHmac('sha256', kSigning)
      .update(stringToSign, 'utf8')
      .digest('hex');

    const authorization = `${algorithm} Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      url: `${this.endpointOrigin}${canonicalUri}`,
      headers: {
        ...allHeaders,
        Authorization: authorization,
      },
    };
  }

  /**
   * Upload an SVG string or Buffer to Cloudflare R2 with immutable 1-year Cache-Control
   */
  async putSvgObject(objectKey, rawSvgContent, { skipIfUploaded = true, autoSaveState = true } = {}) {
    if (!this.hasCredentials()) {
      throw new Error('Thiếu R2_ACCESS_KEY_ID hoặc R2_SECRET_ACCESS_KEY trong file .env');
    }

    const cleanKey = String(objectKey).replace(/^\/+/, '');
    if (skipIfUploaded && this.isAlreadyUploaded(cleanKey)) {
      return { skipped: true, key: cleanKey, bytes: this.state.uploadedKeys[cleanKey] };
    }

    const minified = minifySvg(rawSvgContent);
    const bodyBuf = Buffer.from(minified, 'utf8');

    const quotaCheck = this.checkWriteQuota(cleanKey, bodyBuf.length);
    if (!quotaCheck.allowed) {
      const err = new Error(quotaCheck.reason);
      err.code = 'R2_QUOTA_EXCEEDED';
      throw err;
    }

    const extraHeaders = {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
      'content-length': String(bodyBuf.length),
    };

    const signed = this._signRequest('PUT', cleanKey, extraHeaders, bodyBuf);

    const res = await fetch(signed.url, {
      method: 'PUT',
      headers: signed.headers,
      body: bodyBuf,
    });

    this.state.monthlyClassAOps += 1;

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`R2 PUT lỗi (${res.status}): ${errText.slice(0, 240)}`);
    }

    const prevBytes = this.state.uploadedKeys[cleanKey] || 0;
    if (!Object.prototype.hasOwnProperty.call(this.state.uploadedKeys, cleanKey)) {
      this.state.totalFilesUploaded += 1;
    }
    this.state.totalBytesUploaded += bodyBuf.length - prevBytes;
    this.state.uploadedKeys[cleanKey] = bodyBuf.length;

    if (autoSaveState) {
      this.saveState();
    }

    return {
      skipped: false,
      key: cleanKey,
      bytes: bodyBuf.length,
    };
  }

  /**
   * Fetch an SVG object from R2 via signed S3 GET (used when proxying through Vercel Edge Cache)
   */
  async getSvgObject(objectKey) {
    const cleanKey = String(objectKey).replace(/^\/+/, '');

    // If publicUrl is configured, fetch via public CDN first (0 Class B ops if cached at Cloudflare Edge!)
    if (this.publicUrl) {
      const pubRes = await fetch(`${this.publicUrl}/${cleanKey}`);
      if (pubRes.ok) {
        return await pubRes.text();
      }
    }

    if (!this.hasCredentials()) {
      return null;
    }

    const quotaCheck = this.checkReadQuota();
    if (!quotaCheck.allowed) {
      const err = new Error(quotaCheck.reason);
      err.code = 'R2_QUOTA_EXCEEDED';
      throw err;
    }

    const signed = this._signRequest('GET', cleanKey, {});
    const res = await fetch(signed.url, {
      method: 'GET',
      headers: signed.headers,
    });

    this.state.monthlyClassBOps += 1;

    if (!res.ok) {
      return null;
    }

    return await res.text();
  }
}

module.exports = {
  R2Client,
  minifySvg,
  loadEnvFiles,
  R2_STATE_FILE,
};
