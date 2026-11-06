import { describe, expect, it } from 'vitest';
import {
  applyCustomizationsToLottieJson,
  applyCustomizationsToSvgXml,
  defaultMotionState,
  extractLordiconMotionStates,
  highlightCodeBlock,
  normalizeColorValue,
  parseColor,
  sanitizeSvg,
  toSvgColor,
} from '../src';

describe('alpha colors', () => {
  it('parses and normalizes', () => {
    expect(parseColor('#FF000080')).toEqual({ hex: '#ff0000', alpha: 0.5 });
    expect(parseColor('#abc')).toEqual({ hex: '#aabbcc', alpha: 1 });
    expect(parseColor('red')).toBeNull();
    expect(normalizeColorValue('#ff0000ff')).toBe('#ff0000');
    expect(normalizeColorValue('#FF000080')).toBe('#ff000080');
    expect(toSvgColor('#ff000080')).toBe('rgba(255,0,0,0.5)');
    expect(toSvgColor('#ff0000')).toBe('#ff0000');
  });

  it('writes translucent colors as rgba() in SVG, including the background', () => {
    const out = applyCustomizationsToSvgXml('<svg viewBox="0 0 24 24"><path fill="#121331"/></svg>', {
      colorMap: { '#121331': '#ff000080' },
      bgTransparent: false,
      bgColor: '#00000040',
    });
    expect(out).toContain('fill="rgba(255,0,0,0.5)"');
    expect(out).toContain('class="svgcraft-bg"');
    expect(out).toContain('fill="rgba(0,0,0,0.25)"');
  });

  it('treats a fully opaque 8-digit value as no change', () => {
    const svg = '<svg><path fill="#121331"/></svg>';
    expect(applyCustomizationsToSvgXml(svg, { colorMap: { '#121331': '#121331ff' } })).toBe(svg);
  });

  it('scales shape opacity in Lottie: static, keyframed, and drops opacity expressions', () => {
    const lottie = {
      layers: [
        {
          shapes: [
            { ty: 'fl', c: { k: [1, 0, 0, 1] }, o: { a: 0, k: 80, x: 'expr' } },
            {
              ty: 'st',
              c: { k: [{ s: [1, 0, 0, 1] }] },
              o: { a: 1, k: [{ s: [100], e: [50] }] },
              w: { k: 2 },
            },
            { ty: 'fl', c: { k: [0, 1, 0, 1] }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    };
    const out = applyCustomizationsToLottieJson(lottie, { colorMap: { '#ff0000': '#0000ff80' } });
    const [fill, stroke, other] = out.layers[0]!.shapes as any[];
    expect(fill.c.k.slice(0, 3)).toEqual([0, 0, 1]);
    expect(fill.o).toEqual({ a: 0, k: 40 });
    expect(stroke.o.k[0]).toEqual({ s: [50], e: [25] });
    expect(other.o.k).toBe(100);
    // Source is not mutated
    expect(lottie.layers[0]!.shapes[0]!.o!.k).toBe(80);
  });
});

describe('sanitizeSvg', () => {
  it('removes scripts, foreignObject, handlers and javascript: links', () => {
    const out = sanitizeSvg(
      `<svg onload="a()"><script>alert(1)</script><script href="x"/><foreignObject><img src=x onerror=b()></foreignObject><a xlink:href="javascript:c()"><path onclick='d()' fill="#000"/></a></svg>`
    );
    expect(out).not.toMatch(/script|onload|onerror|onclick|foreignObject|javascript:/i);
    expect(out).toContain('fill="#000"');
  });

  it('keeps ordinary SVG untouched', () => {
    const svg = '<svg viewBox="0 0 1 1"><style>.a{fill:red}</style><use href="#b" class="a"/></svg>';
    expect(sanitizeSvg(svg)).toBe(svg);
  });
});

describe('motion states', () => {
  it('reads markers and picks the default', () => {
    const states = extractLordiconMotionStates({
      markers: [
        { cm: 'loop-spin', tm: 60, dr: 30 },
        { cm: 'default:hover-pinch', tm: 0, dr: 60 },
      ],
    });
    expect(states.map((s) => s.id)).toEqual(['loop-spin', 'hover-pinch']);
    expect(states[1]).toMatchObject({ label: 'Hover Pinch', isDefault: true, startFrame: 0, endFrame: 60 });
    expect(defaultMotionState(states)?.id).toBe('hover-pinch');
  });

  it('falls back to the whole timeline', () => {
    expect(extractLordiconMotionStates({ ip: 0, op: 90 })[0]).toMatchObject({ id: 'default', endFrame: 90 });
  });
});

describe('highlightCodeBlock', () => {
  it('escapes everything and numbers lines', () => {
    const html = highlightCodeBlock('<svg a="<b>">\n</svg>');
    expect(html).toContain('<span class="code-ln">2</span>');
    expect(html).toContain('&lt;b&gt;');
    expect(html).not.toContain('<b>');
  });
});
