/** Lottie JSON customization (colors + stroke weight). Pure data transform, no DOM. */
import { expandShortHex, hexToNormalizedRgbArray, parseColor, rgbArrayToHex, type RgbTriplet } from './color';
import { getStrokeMultiplier, type ColorMap, type StrokeMode } from './svg-customize';

export interface LottieCustomizeOptions {
  colorMap?: ColorMap;
  strokeMode?: StrokeMode;
}

type JsonNode = Record<string, unknown>;

interface Keyframe {
  s?: unknown;
  e?: unknown;
}

function isObject(v: unknown): v is JsonNode {
  return typeof v === 'object' && v !== null;
}

function isNumberArray(v: unknown): v is number[] {
  return Array.isArray(v) && typeof v[0] === 'number';
}

/** Recolor a `[r, g, b, a?]` array in place when its hex is mapped. */
function recolorInPlace(arr: unknown, map: Map<string, RgbTriplet>): void {
  if (!isNumberArray(arr) || arr.length < 3) return;
  const next = map.get(rgbArrayToHex(arr) ?? '');
  if (!next) return;
  [arr[0], arr[1], arr[2]] = next;
}

/** Apply `fn` to a static value (`k: [..]`) or to every keyframe's `s` / `e`. */
function forEachColorValue(k: unknown, fn: (arr: unknown) => void): void {
  if (isNumberArray(k)) {
    fn(k);
  } else if (Array.isArray(k)) {
    for (const kf of k as Keyframe[]) {
      if (!isObject(kf)) continue;
      fn(kf.s);
      fn(kf.e);
    }
  }
}

/** Original hex of a fill/stroke color, static or first keyframe. */
function colorHexOf(k: unknown): string | null {
  if (isNumberArray(k)) return rgbArrayToHex(k);
  if (Array.isArray(k) && isObject(k[0])) return rgbArrayToHex((k[0] as Keyframe).s);
  return null;
}

/** Multiply a shape's opacity (0..100, static or keyframed) by `alpha`. Drops any opacity expression. */
function scaleOpacity(node: JsonNode, alpha: number): void {
  const o = isObject(node.o) ? node.o : { a: 0, k: 100 };
  const scale = (n: number) => Number((n * alpha).toFixed(2));
  if (typeof o.k === 'number') {
    o.k = scale(o.k);
  } else if (Array.isArray(o.k)) {
    for (const kf of o.k as Keyframe[]) {
      if (!isObject(kf)) continue;
      if (isNumberArray(kf.s)) kf.s = kf.s.map(scale);
      if (isNumberArray(kf.e)) kf.e = kf.e.map(scale);
    }
  }
  delete o.x;
  node.o = o;
}

function scaleNumberInPlace(arr: unknown, mult: number): void {
  if (isNumberArray(arr)) arr[0] = Number((arr[0]! * mult).toFixed(2));
}

/**
 * Return a customized deep copy of a Lottie animation.
 *
 * Colors are replaced in three places:
 * - fill (`ty: 'fl'`) and stroke (`ty: 'st'`) shape colors (`c.k`)
 * - **Color Control effects** (`ty: 2`, value in `v.k`). Lordicon drives shape colors through expressions that read
 *   these effects on a `control` layer, so changing only `c.k` has no visible effect at runtime.
 *
 * Lottie ignores a color's alpha channel, so a translucent replacement (`#rrggbbaa`) scales the shape's own opacity.
 *
 * Stroke widths (`st.w.k`) are scaled by the stroke-mode multiplier.
 */
export function applyCustomizationsToLottieJson<T>(lottieData: T, options: LottieCustomizeOptions = {}): T {
  const { colorMap = {}, strokeMode = 'regular' } = options;
  const cloned = JSON.parse(JSON.stringify(lottieData)) as T;

  const map = new Map<string, RgbTriplet>();
  const alphas = new Map<string, number>();
  for (const [orig, next] of Object.entries(colorMap)) {
    const k = expandShortHex(orig);
    const v = hexToNormalizedRgbArray(next);
    if (k && v) map.set(k, v);
    const alpha = parseColor(next)?.alpha ?? 1;
    if (k && alpha < 1) alphas.set(k, alpha);
  }
  const mult = getStrokeMultiplier(strokeMode);
  const scaleStroke = Math.abs(mult - 1) > 0.01;
  const recolor = (arr: unknown) => recolorInPlace(arr, map);

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!isObject(node)) return;

    // Shape fill / stroke color
    if ((node.ty === 'fl' || node.ty === 'st') && isObject(node.c)) {
      const alpha = alphas.get(colorHexOf(node.c.k) ?? '');
      if (alpha !== undefined) scaleOpacity(node, alpha);
      forEachColorValue(node.c.k, recolor);
    }

    // Effect "Color Control" value (excluding image layers, which also use ty 2 but carry `ks` transforms)
    if (node.ty === 2 && isObject(node.v) && node.v.k !== undefined && !('ks' in node) && !('layers' in node)) {
      forEachColorValue(node.v.k, recolor);
    }

    // Stroke width
    if (scaleStroke && node.ty === 'st' && isObject(node.w)) {
      const wk = node.w.k;
      if (typeof wk === 'number') {
        node.w.k = Number((wk * mult).toFixed(2));
      } else if (Array.isArray(wk)) {
        for (const kf of wk as Keyframe[]) {
          if (!isObject(kf)) continue;
          scaleNumberInPlace(kf.s, mult);
          scaleNumberInPlace(kf.e, mult);
        }
      }
    }

    for (const val of Object.values(node)) {
      if (isObject(val)) walk(val);
    }
  };

  walk(cloned);
  return cloned;
}
