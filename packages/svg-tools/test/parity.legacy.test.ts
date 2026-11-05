/**
 * Transitional parity check: until `apps/web/public/app.js` is deleted (refactor phase 4), the legacy page script
 * keeps its own copy of the customization logic. This test runs both copies on the same inputs so a fix applied to
 * one side but not the other fails CI. Delete this file together with app.js.
 *
 * Code generators (JSX/Vue/HTML/pretty-print) are intentionally NOT compared: the package fixes known legacy bugs there.
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as pkg from '../src';
import type { ColorMap } from '../src';

const APP_JS = fileURLToPath(new URL('../../../apps/web/public/app.js', import.meta.url));
const LEGACY_FUNCTIONS = [
  'expandShortHex',
  'hexToNormalizedRgbArray',
  'rgbArrayToHex',
  'extractEditableColorsFromSvg',
  'getStrokeMultiplier',
  'normalizeSvgForInlineAndExport',
  'applyCustomizationsToSvgXml',
  'applyCustomizationsToLottieJson',
] as const;

type LegacyApi = Record<(typeof LEGACY_FUNCTIONS)[number], (...args: unknown[]) => unknown>;

/** Pull top-level `function name(...) {...}` declarations out of app.js by brace matching. */
function loadLegacy(): LegacyApi {
  const src = readFileSync(APP_JS, 'utf8');
  const bodies = LEGACY_FUNCTIONS.map((name) => {
    const start = src.indexOf(`function ${name}(`);
    if (start < 0) throw new Error(`app.js no longer defines ${name}()`);
    let depth = 0;
    for (let i = src.indexOf('{', src.indexOf(')', start)); i < src.length; i += 1) {
      if (src[i] === '{') depth += 1;
      if (src[i] === '}' && --depth === 0) return src.slice(start, i + 1);
    }
    throw new Error(`Unbalanced braces in ${name}()`);
  });
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function(`${bodies.join('\n')}\nreturn { ${LEGACY_FUNCTIONS.join(', ')} };`)() as LegacyApi;
}

const SVG_SAMPLES = [
  '<svg viewBox="0 0 24 24"><path fill="#FFF" stroke="#121331" stroke-width="2"/><path style="stroke-width:1.5px" fill="#abc"/></svg>',
  '<svg width="48" height="48"><g class="primary" stroke="#08A88A"/><g class="secondary" fill="#cb5eee"/><mask id="m" mask-type="alpha"><use xmlns:ns1="http://www.w3.org/1999/xlink" ns1:href="#a"/></mask></svg>',
  '<svg><path stroke="currentColor" stroke-width="1.75"/></svg>',
];
const COLOR_MAPS: ColorMap[] = [
  {},
  { '#ffffff': '#000000', '#121331': '#ff0000' },
  { '#08a88a': '#cb5eee', '#cb5eee': '#08a88a' },
];
const STROKES = ['light', 'regular', 'bold'] as const;

describe.skipIf(!existsSync(APP_JS))('parity with legacy app.js', () => {
  const legacy = existsSync(APP_JS) ? loadLegacy() : ({} as LegacyApi);

  it('color helpers', () => {
    for (const hex of ['#abc', '#ABCDEF', 'red', '#12345', '']) {
      expect(pkg.expandShortHex(hex)).toEqual(legacy.expandShortHex(hex));
      expect(pkg.hexToNormalizedRgbArray(hex)).toEqual(legacy.hexToNormalizedRgbArray(hex));
    }
    for (const arr of [
      [1, 0.5, 0],
      [0.2, 0.4, 0.6, 1],
      [2, -1, 0],
    ]) {
      expect(pkg.rgbArrayToHex(arr)).toEqual(legacy.rgbArrayToHex(arr));
    }
    for (const svg of SVG_SAMPLES) {
      expect(pkg.extractEditableColorsFromSvg(svg)).toEqual(legacy.extractEditableColorsFromSvg(svg));
    }
  });

  it('applyCustomizationsToSvgXml', () => {
    for (const svg of SVG_SAMPLES) {
      expect(pkg.normalizeSvgForInlineAndExport(svg)).toBe(legacy.normalizeSvgForInlineAndExport(svg));
      for (const colorMap of COLOR_MAPS) {
        for (const strokeMode of STROKES) {
          for (const bgTransparent of [true, false]) {
            const opts = { colorMap, strokeMode, bgTransparent, bgColor: '#fafafa' };
            expect(pkg.applyCustomizationsToSvgXml(svg, opts)).toBe(legacy.applyCustomizationsToSvgXml(svg, opts));
          }
        }
      }
    }
  });

  it('applyCustomizationsToLottieJson', () => {
    const lottie = {
      layers: [
        { nm: 'control', ef: [{ ty: 5, ef: [{ ty: 2, v: { k: [0.796, 0.369, 0.933, 1] } }] }] },
        {
          ty: 4,
          ks: {},
          shapes: [
            { ty: 'fl', c: { k: [0.0706, 0.0745, 0.1922, 1] } },
            { ty: 'st', c: { k: [{ s: [0.796, 0.369, 0.933, 1], e: [1, 1, 1, 1] }] }, w: { k: [{ s: [2] }] } },
            { ty: 'st', c: { k: [0, 0, 0, 1] }, w: { k: 3 } },
          ],
        },
        { ty: 2, ks: {}, v: { k: [0.796, 0.369, 0.933, 1] } },
      ],
    };
    const lottieMaps: ColorMap[] = [{}, { '#cb5eee': '#ff8000', '#121331': '#00ff00' }];
    for (const colorMap of lottieMaps) {
      for (const strokeMode of STROKES) {
        const opts = { colorMap, strokeMode };
        expect(pkg.applyCustomizationsToLottieJson(lottie, opts)).toEqual(
          legacy.applyCustomizationsToLottieJson(lottie, opts)
        );
      }
    }
  });
});
