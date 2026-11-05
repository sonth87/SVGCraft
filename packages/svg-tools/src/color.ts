/** Color helpers shared by SVG and Lottie customization. Pure functions, no DOM. */

export type RgbTriplet = [number, number, number];

export interface EditableColorSlot {
  /** Normalized 6-digit lowercase hex, e.g. `#121331` */
  hex: string;
  /** Semantic label (`primary`, `secondary`, …) or `Color N` */
  label: string;
}

const DEFAULT_SLOT: EditableColorSlot = { hex: '#121331', label: 'primary' };
const MAX_SLOTS = 6;
const SEMANTIC_ORDER = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary'];
const HEX_IN_TEXT = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;

/** `#abc` → `#aabbcc`; `#AABBCC` → `#aabbcc`; anything else → `null`. */
export function expandShortHex(hex: string | null | undefined = ''): string | null {
  const clean = String(hex ?? '')
    .trim()
    .toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(clean)) {
    return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  if (/^#[0-9a-f]{6}$/.test(clean)) return clean;
  return null;
}

/** `#ff8000` → `[1, 0.502, 0]` (Lottie color space, 4-decimal precision). */
export function hexToNormalizedRgbArray(hex: string): RgbTriplet | null {
  const clean = expandShortHex(hex);
  if (!clean) return null;
  const channel = (from: number) => Number((parseInt(clean.slice(from, from + 2), 16) / 255).toFixed(4));
  return [channel(1), channel(3), channel(5)];
}

/** `[1, 0.5, 0]` (0..1 floats, extra channels ignored) → `#ff8000`. */
export function rgbArrayToHex(arr: unknown): string | null {
  if (!Array.isArray(arr) || arr.length < 3) return null;
  const toByte = (v: unknown) => Math.max(0, Math.min(255, Math.round(Number(v) * 255)));
  return `#${[arr[0], arr[1], arr[2]].map((v) => toByte(v).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Find the user-editable colors of an SVG (max 6).
 * Lordicon semantic classes (`.primary`, `.secondary`, …) come first, then any remaining visible hex color.
 * Mask silhouettes and non-gradient `<defs>` are ignored so invisible helper colors don't show up as wells.
 */
export function extractEditableColorsFromSvg(svgText = ''): EditableColorSlot[] {
  if (!svgText) return [{ ...DEFAULT_SLOT }];
  const found: EditableColorSlot[] = [];
  const seen = new Set<string>();

  const addHex = (rawHex: string, label = '') => {
    const hex = expandShortHex(rawHex);
    if (!hex || seen.has(hex)) return;
    seen.add(hex);
    found.push({ hex, label: label || `Color ${found.length + 1}` });
  };

  const visibleOnly = svgText
    .replace(/<mask\b[^>]*>[\s\S]*?<\/mask>/gi, '')
    .replace(/<defs\b[^>]*>([\s\S]*?)<\/defs>/gi, (_, inner: string) => {
      const grads = inner.match(/<(?:linearGradient|radialGradient)\b[\s\S]*?<\/(?:linearGradient|radialGradient)>/gi);
      return grads ? grads.join('') : '';
    });

  for (const cls of SEMANTIC_ORDER) {
    const clsRegex = new RegExp(`class=["'][^"']*\\b${cls}\\b[^"']*["'][^>]*>`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = clsRegex.exec(visibleOnly)) !== null) {
      for (const h of m[0].match(HEX_IN_TEXT) ?? []) addHex(h, cls);
    }
  }

  for (const h of visibleOnly.match(HEX_IN_TEXT) ?? []) {
    if (found.length >= MAX_SLOTS) break;
    addHex(h);
  }

  if (found.length === 0) found.push({ ...DEFAULT_SLOT });
  return found.slice(0, MAX_SLOTS);
}
