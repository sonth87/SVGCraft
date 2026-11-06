/**
 * Lordicon animation data (Lottie). Lordicon serves each icon's animation as a `.li` file: base64 of
 * the Lottie JSON with every byte XOR 42. The crawler stores the decoded JSON next to the SVGs:
 *
 *   output/lordicon/{collection}/lottie/{iconSlug}.json
 *
 * `npm run publish` uploads it to R2 as `lottie/{sha256[:16]}.json`, so the web app never calls
 * lordicon.com at runtime.
 */
const path = require('path');

const LORDICON_MEDIA_BASE = 'https://media.lordicon.com/icons';
const LOTTIE_DIR = 'lottie';

/** Source URL of an icon's `.li` animation file. */
function lordiconLiUrl(family, style, iconSlug) {
  return `${LORDICON_MEDIA_BASE}/${family}/${style}/${encodeURIComponent(iconSlug)}.li`;
}

/** `lordicon-wired-flat` → { family: 'wired', style: 'flat' } */
function parseLordiconCollectionSlug(collectionSlug) {
  const parts = String(collectionSlug || '')
    .replace(/^lordicon-/, '')
    .split('-');
  if (parts.length < 2) return null;
  return { family: parts[0], style: parts.slice(1).join('-') };
}

/** Relative path of the stored Lottie JSON inside the collection folder. */
function lottieFileName(iconSlug) {
  return `${LOTTIE_DIR}/${String(iconSlug).replace(/[^a-zA-Z0-9-_]/g, '-')}.json`;
}

function lottieFilePath(outputDir, collectionSlug, iconSlug) {
  return path.join(outputDir, 'lordicon', collectionSlug, lottieFileName(iconSlug));
}

/** Decode a `.li` payload into the Lottie object. Throws on anything that is not valid Lottie. */
function decodeLordiconLi(text) {
  const buf = Buffer.from(String(text || '').trim(), 'base64');
  for (let i = 0; i < buf.length; i++) buf[i] ^= 42;
  const lottie = JSON.parse(buf.toString('utf8'));
  if (!lottie || typeof lottie !== 'object' || !Array.isArray(lottie.layers)) {
    throw new Error('Dữ liệu .li không phải Lottie hợp lệ');
  }
  return lottie;
}

/** Motion states from the Lottie markers (`default:hover-pinch`, `loop-spin`, …). */
function extractLordiconMotionStates(lottie = {}) {
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
      endFrame: startFrame + durationFrames,
      durationFrames,
    };
  });
}

module.exports = {
  LORDICON_MEDIA_BASE,
  lordiconLiUrl,
  parseLordiconCollectionSlug,
  lottieFileName,
  lottieFilePath,
  decodeLordiconLi,
  extractLordiconMotionStates,
};
