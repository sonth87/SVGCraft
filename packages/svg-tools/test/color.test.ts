import { describe, expect, it } from 'vitest';
import { expandShortHex, extractEditableColorsFromSvg, hexToNormalizedRgbArray, rgbArrayToHex } from '../src';

describe('expandShortHex', () => {
  it('expands and lowercases', () => {
    expect(expandShortHex('#ABC')).toBe('#aabbcc');
    expect(expandShortHex(' #12AB34 ')).toBe('#12ab34');
  });
  it('rejects non-hex input', () => {
    expect(expandShortHex('red')).toBeNull();
    expect(expandShortHex('#12345')).toBeNull();
    expect(expandShortHex(undefined)).toBeNull();
  });
});

describe('hex <-> normalized rgb', () => {
  it('round-trips every byte value', () => {
    for (let v = 0; v <= 255; v += 1) {
      const hex = `#${v.toString(16).padStart(2, '0').repeat(3)}`;
      expect(rgbArrayToHex(hexToNormalizedRgbArray(hex))).toBe(hex);
    }
  });
  it('ignores alpha and clamps out-of-range channels', () => {
    expect(rgbArrayToHex([1, 0.5, 0, 0.3])).toBe('#ff8000');
    expect(rgbArrayToHex([2, -1, 0])).toBe('#ff0000');
    expect(rgbArrayToHex([1, 2])).toBeNull();
  });
});

describe('extractEditableColorsFromSvg', () => {
  it('puts Lordicon semantic classes first', () => {
    const svg =
      '<svg><path fill="#000000"/><path class="secondary" fill="#CB5EEE"/><path class="primary" stroke="#121331"/></svg>';
    expect(extractEditableColorsFromSvg(svg)).toEqual([
      { hex: '#121331', label: 'primary' },
      { hex: '#cb5eee', label: 'secondary' },
      { hex: '#000000', label: 'Color 3' },
    ]);
  });

  it('ignores mask silhouettes and non-gradient defs, keeps gradient stops', () => {
    const svg =
      '<svg><defs><clipPath id="a"><path fill="#ff0000"/></clipPath><linearGradient id="g"><stop stop-color="#00ff00"/></linearGradient></defs>' +
      '<mask id="m"><path fill="#FFF"/></mask><path fill="url(#g)"/><path fill="#0000ff"/></svg>';
    expect(extractEditableColorsFromSvg(svg).map((s) => s.hex)).toEqual(['#00ff00', '#0000ff']);
  });

  it('caps at 6 colors and falls back to the default slot', () => {
    const many = `<svg>${Array.from({ length: 9 }, (_, i) => `<path fill="#00000${i}"/>`).join('')}</svg>`;
    expect(extractEditableColorsFromSvg(many)).toHaveLength(6);
    expect(extractEditableColorsFromSvg('<svg><path fill="currentColor"/></svg>')).toEqual([
      { hex: '#121331', label: 'primary' },
    ]);
  });
});
