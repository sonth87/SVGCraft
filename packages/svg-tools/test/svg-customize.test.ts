import { describe, expect, it } from 'vitest';
import { applyCustomizationsToSvgXml, normalizeSvgForInlineAndExport } from '../src';

describe('applyCustomizationsToSvgXml — colors', () => {
  it('swaps two colors without collision', () => {
    const svg = '<svg><path fill="#111111"/><path fill="#222222"/></svg>';
    const out = applyCustomizationsToSvgXml(svg, { colorMap: { '#111111': '#222222', '#222222': '#111111' } });
    expect(out).toBe('<svg><path fill="#222222"/><path fill="#111111"/></svg>');
  });

  it('matches the short form of a color and is case-insensitive', () => {
    const svg = '<svg><path fill="#FFF"/><path stroke="#ffffff"/></svg>';
    expect(applyCustomizationsToSvgXml(svg, { colorMap: { '#ffffff': '#000000' } })).toBe(
      '<svg><path fill="#000000"/><path stroke="#000000"/></svg>'
    );
  });

  it('does not touch longer hex that merely starts with the same digits', () => {
    const svg = '<svg><path fill="#aabbcc"/><path fill="#abc"/></svg>';
    // #abc expands to #aabbcc, so both are the same color — but #abcdef must not be hit by #abc
    const out = applyCustomizationsToSvgXml('<svg><path fill="#abcdef"/></svg>', { colorMap: { '#abc': '#000000' } });
    expect(out).toBe('<svg><path fill="#abcdef"/></svg>');
    expect(applyCustomizationsToSvgXml(svg, { colorMap: { '#aabbcc': '#000000' } })).toBe(
      '<svg><path fill="#000000"/><path fill="#000000"/></svg>'
    );
  });

  it('recolors currentColor for monochrome icons via the first well', () => {
    const svg = '<svg><path stroke="currentColor"/></svg>';
    expect(applyCustomizationsToSvgXml(svg, { colorMap: { '#121331': '#ff0000' } })).toBe(
      '<svg><path stroke="#ff0000"/></svg>'
    );
  });

  it('is a no-op when nothing changes', () => {
    const svg = '<svg viewBox="0 0 24 24"><path fill="#123456" stroke-width="2"/></svg>';
    expect(applyCustomizationsToSvgXml(svg, { colorMap: { '#123456': '#123456' } })).toBe(svg);
  });
});

describe('applyCustomizationsToSvgXml — stroke', () => {
  it('scales attribute and inline-style stroke widths, keeping units and a minimum', () => {
    const svg = '<svg><path stroke-width="2"/><path style="stroke-width:10px"/><path stroke-width="0.3"/></svg>';
    expect(applyCustomizationsToSvgXml(svg, { strokeMode: 'bold' })).toBe(
      '<svg><path stroke-width="2.9"/><path style="stroke-width:14.5px"/><path stroke-width="0.43"/></svg>'
    );
    expect(applyCustomizationsToSvgXml(svg, { strokeMode: 'light' })).toContain('stroke-width="0.25"');
  });
});

describe('applyCustomizationsToSvgXml — background', () => {
  it('inserts a rect matching the viewBox right after the root tag', () => {
    const svg = '<svg viewBox="-2 -2 28 28"><path/></svg>';
    expect(applyCustomizationsToSvgXml(svg, { bgTransparent: false, bgColor: '#fafafa' })).toBe(
      '<svg viewBox="-2 -2 28 28"><rect class="svgcraft-bg" x="-2" y="-2" width="28" height="28" fill="#fafafa"/><path/></svg>'
    );
  });

  it('falls back to width/height without a viewBox', () => {
    const out = applyCustomizationsToSvgXml('<svg width="48" height="32"></svg>', { bgTransparent: false });
    expect(out).toContain('width="48" height="32" fill="#ffffff"');
  });
});

describe('normalizeSvgForInlineAndExport', () => {
  it('rewrites nsN xlink aliases and declares xmlns:xlink', () => {
    const svg =
      '<svg><mask id="f" mask-type="alpha"><use xmlns:ns1="http://www.w3.org/1999/xlink" ns1:href="#a"/></mask></svg>';
    expect(normalizeSvgForInlineAndExport(svg)).toBe(
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"><mask id="f" mask-type="alpha" style="mask-type:alpha"><use href="#a" xlink:href="#a"/></mask></svg>'
    );
  });

  it('leaves non-SVG input untouched', () => {
    expect(normalizeSvgForInlineAndExport('hello')).toBe('hello');
  });
});
