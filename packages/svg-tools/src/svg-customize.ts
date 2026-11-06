/** Static SVG customization (colors, stroke weight, background). Pure string transforms, no DOM. */
import { expandShortHex, normalizeColorValue, toSvgColor } from './color';

export type StrokeMode = 'light' | 'regular' | 'bold';

/** Map of original hex → replacement, `#rrggbb` or `#rrggbbaa`, e.g. `{ '#121331': '#ff000080' }`. */
export type ColorMap = Record<string, string>;

export interface SvgCustomizeOptions {
  colorMap?: ColorMap;
  strokeMode?: StrokeMode;
  /** When `false`, a `<rect class="svgcraft-bg">` filled with `bgColor` is inserted behind the artwork. */
  bgTransparent?: boolean;
  bgColor?: string;
}

const STROKE_MULTIPLIERS: Record<StrokeMode, number> = { light: 0.55, regular: 1, bold: 1.45 };
const MIN_STROKE = 0.25;

export function getStrokeMultiplier(strokeMode: StrokeMode = 'regular'): number {
  return STROKE_MULTIPLIERS[strokeMode] ?? 1;
}

/**
 * Make crawled SVG safe to inline and export:
 * - drop auto-generated `xmlns:nsN` xlink aliases and rewrite `nsN:href` to `href` + `xlink:href`
 * - mirror `mask-type="alpha"` into an inline style (Safari ignores the attribute)
 * - declare `xmlns:xlink` when `xlink:href` is used
 */
export function normalizeSvgForInlineAndExport(svg = ''): string {
  if (!svg || !svg.includes('<svg')) return svg;
  let out = svg
    .replace(/\s+xmlns:ns\d+=["']http:\/\/www\.w3\.org\/1999\/xlink["']/gi, '')
    .replace(/\bns\d+:href=(["'][^"']+["'])/gi, 'href=$1 xlink:href=$1')
    .replace(/<mask\b([^>]*\bmask-type=["']alpha["'][^>]*)>/gi, (full, attrs: string) => {
      if (/\bstyle=/i.test(attrs)) return full;
      return `<mask${attrs} style="mask-type:alpha">`;
    });
  if (out.includes('xlink:href=') && !/\bxmlns:xlink=/i.test(out)) {
    out = out.replace(/<svg\b/i, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  return out;
}

/**
 * Remove active content from third-party SVGs before they are inlined into our pages:
 * `<script>`, `<foreignObject>`, `on*` handlers and `javascript:` links.
 */
export function sanitizeSvg(svg = ''): string {
  return svg
    .replace(/<(script|foreignObject)\b[^>]*\/>/gi, '')
    .replace(/<script\b[\s\S]*?(?:<\/script\s*>|$)/gi, '')
    .replace(/<foreignObject\b[\s\S]*?(?:<\/foreignObject\s*>|$)/gi, '')
    .replace(/<[a-zA-Z][^>]*>/g, (tag) =>
      tag
        .replace(/[\s/]on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/\b((?:xlink:)?href)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1=$2#$2')
    );
}

function scaleStroke(numStr: string, mult: number): number | null {
  const val = parseFloat(numStr);
  if (Number.isNaN(val) || val <= 0) return null;
  return Math.max(MIN_STROKE, Number((val * mult).toFixed(2)));
}

function readViewBox(svg: string): [number, number, number, number] {
  const vbMatch = svg.match(/\bviewBox=["']([^"']+)["']/i);
  if (vbMatch?.[1]) {
    const parts = vbMatch[1]
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    if (parts.length === 4 && !parts.some(Number.isNaN)) return parts as [number, number, number, number];
  }
  const w = parseFloat(svg.match(/\bwidth=["']([\d.]+)/i)?.[1] ?? '') || 24;
  const h = parseFloat(svg.match(/\bheight=["']([\d.]+)/i)?.[1] ?? '') || 24;
  return [0, 0, w, h];
}

/** Apply color swaps, stroke multiplier and optional background to an SVG string. */
export function applyCustomizationsToSvgXml(
  baseSvg = '',
  { colorMap = {}, strokeMode = 'regular', bgTransparent = true, bgColor = '#ffffff' }: SvgCustomizeOptions = {}
): string {
  if (!baseSvg || !baseSvg.includes('<svg')) return baseSvg;
  let out = normalizeSvgForInlineAndExport(baseSvg);

  // 1. Colors — replace through temporary tokens so swaps (A→B, B→A) don't collide
  const entries = Object.entries(colorMap).filter(
    ([orig, next]) => orig && next && normalizeColorValue(orig) !== normalizeColorValue(next)
  );
  if (entries.length > 0) {
    entries.forEach(([orig], idx) => {
      const normOrig = expandShortHex(orig);
      if (!normOrig) return;
      const canShorten = normOrig[1] === normOrig[2] && normOrig[3] === normOrig[4] && normOrig[5] === normOrig[6];
      const token = `__SVGCRAFT_CLR_${idx}__`;
      out = out.replace(new RegExp(`${normOrig}\\b`, 'gi'), token);
      if (canShorten) {
        out = out.replace(new RegExp(`#${normOrig[1]}${normOrig[3]}${normOrig[5]}\\b`, 'gi'), token);
      }
    });
    entries.forEach(([, next], idx) => {
      out = out.replace(new RegExp(`__SVGCRAFT_CLR_${idx}__`, 'g'), toSvgColor(next));
    });

    // Monochrome `currentColor` icons: the first color well recolors currentColor
    const firstEntry = entries[0];
    if (firstEntry && !/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(baseSvg)) {
      out = out.replace(/\bcurrentColor\b/g, toSvgColor(firstEntry[1]));
    }
  }

  // 2. Stroke weight
  const mult = getStrokeMultiplier(strokeMode);
  if (Math.abs(mult - 1) > 0.01) {
    out = out.replace(/\bstroke-width=["']([\d.]+)(px)?["']/gi, (full, numStr: string, unit?: string) => {
      const scaled = scaleStroke(numStr, mult);
      return scaled === null ? full : `stroke-width="${scaled}${unit ?? ''}"`;
    });
    out = out.replace(/\bstroke-width:\s*([\d.]+)(px)?/gi, (full, numStr: string, unit?: string) => {
      const scaled = scaleStroke(numStr, mult);
      return scaled === null ? full : `stroke-width:${scaled}${unit ?? ''}`;
    });
  }

  // 3. Background
  if (!bgTransparent && bgColor) {
    const [x, y, w, h] = readViewBox(out);
    const bgRect = `<rect class="svgcraft-bg" x="${x}" y="${y}" width="${w}" height="${h}" fill="${toSvgColor(bgColor)}"/>`;
    out = out.replace(/<svg\b[^>]*>/i, (openTag) => `${openTag}${bgRect}`);
  }

  return out;
}
