import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import {
  cssDeclarationsToJsxObject,
  prettyFormatSvgXml,
  svgToDataUri,
  svgToHtmlImg,
  svgToJsx,
  svgToVue,
  toJsxAttributeName,
  toPascalCaseComponentName,
} from '../src';

// Loaded through Node's require so Vite doesn't try to transform (and sourcemap) the huge typescript bundle
const ts = createRequire(import.meta.url)('typescript') as typeof import('typescript');

/** Compile JSX with the real TypeScript parser; returns syntax error messages (empty = valid JSX). */
function jsxSyntaxErrors(code: string): string[] {
  const out = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
    fileName: 'Icon.jsx',
  });
  return (out.diagnostics ?? []).map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

// Shapes taken from real exports: a Lordicon static SVG (inline style on root, mask-type, xlink)
// and the compiled animated SVG (CSS keyframes inside <style>).
const LORDICON_STATIC =
  '<svg xmlns="http://www.w3.org/2000/svg" width="430" height="430" style="width:100%;height:100%;transform:translate3d(0,0,0);content-visibility:visible" viewBox="0 0 430 430"><defs><mask id="f" mask-type="alpha"><use xlink:href="#a"/></mask></defs><g class="primary" clip-path="url(#d)"><path fill="none" stroke="#121331" stroke-width="12" stroke-linecap="round" d="M1 1"/></g></svg>';
const ANIMATED =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 430"><style>.li-f{opacity:0}@keyframes li-k-0{0%,50%{opacity:1}51%,100%{opacity:0}}svg:hover .li-f-0{animation:li-k-0 1.5s steps(1,end) 1 forwards}</style><g class="li-f li-f-0"><path d="M0 0"/></g></svg>';

describe('toPascalCaseComponentName', () => {
  it.each([
    ['arrow-left', 'ArrowLeftIcon'],
    ['3609-phone-bluetooth', 'Svg3609PhoneBluetoothIcon'],
    ['home-icon', 'HomeIcon'],
    ['', 'CustomIcon'],
  ])('%s → %s', (slug, name) => expect(toPascalCaseComponentName(slug)).toBe(name));
});

describe('svgToJsx', () => {
  it('produces valid JSX for a Lordicon static SVG (inline style, mask-type, xlink)', () => {
    const code = svgToJsx(LORDICON_STATIC, 'PhoneIcon');
    expect(jsxSyntaxErrors(code)).toEqual([]);
    expect(code).toContain(
      "style={{ width: '100%', height: '100%', transform: 'translate3d(0,0,0)', contentVisibility: 'visible' }}"
    );
    expect(code).toContain('maskType="alpha"');
    expect(code).toContain('xlinkHref="#a"');
    expect(code).toContain('className="primary"');
    expect(code).toContain('strokeWidth="12"');
    expect(code).toContain('<svg {...props} xmlns=');
  });

  it('produces valid JSX for the compiled animated SVG (<style> with CSS braces)', () => {
    const code = svgToJsx(ANIMATED, 'AnimIcon');
    expect(jsxSyntaxErrors(code)).toEqual([]);
    expect(code).toContain('<style>{`.li-f{opacity:0}@keyframes');
  });

  it('escapes backticks and ${ inside style blocks', () => {
    const code = svgToJsx('<svg><style>a{content:"`${x}`"}</style></svg>');
    expect(jsxSyntaxErrors(code)).toEqual([]);
    expect(code).toContain('\\`\\${x}\\`');
  });

  it('keeps data-* and aria-* attributes', () => {
    expect(toJsxAttributeName('data-name')).toBe('data-name');
    expect(toJsxAttributeName('aria-hidden')).toBe('aria-hidden');
    expect(toJsxAttributeName('xml:space')).toBe('xmlSpace');
    expect(toJsxAttributeName('for')).toBe('htmlFor');
  });

  it('converts CSS declarations including vendor prefixes and custom properties', () => {
    expect(cssDeclarationsToJsxObject("-webkit-mask: url('a'); --tint: red; ;")).toBe(
      "{{ WebkitMask: 'url(\\'a\\')', '--tint': 'red' }}"
    );
  });
});

describe('prettyFormatSvgXml', () => {
  it('splits minified SVG into indented lines', () => {
    expect(prettyFormatSvgXml('<svg><g><path d="M0 0"/></g><title>Hi</title></svg>')).toBe(
      ['<svg>', '  <g>', '    <path d="M0 0"/>', '  </g>', '  <title>Hi</title>', '</svg>'].join('\n')
    );
  });
  it('drops the XML prolog and comments', () => {
    expect(prettyFormatSvgXml('<?xml version="1.0"?><!-- x --><svg/>')).toBe('<svg/>');
  });
});

describe('svgToVue / svgToDataUri / svgToHtmlImg', () => {
  it('binds $attrs on the root svg', () => {
    expect(svgToVue('<svg><path/></svg>')).toBe(
      '<template>\n  <svg v-bind="$attrs">\n    <path/>\n  </svg>\n</template>'
    );
  });

  it('encodes a data URI without prolog/comments', () => {
    expect(svgToDataUri('<?xml version="1.0"?><svg><!-- c --><path/></svg>')).toBe(
      `data:image/svg+xml;utf8,${encodeURIComponent('<svg><path/></svg>')}`
    );
  });

  it('keeps absolute CDN URLs and resolves relative ones against origin', () => {
    expect(svgToHtmlImg('https://cdn.example.com/a.svg', { origin: 'http://localhost:3000' })).toContain(
      'src="https://cdn.example.com/a.svg"'
    );
    expect(svgToHtmlImg('/svg/a.svg', { origin: 'https://svgcraft.app/' })).toContain(
      'src="https://svgcraft.app/svg/a.svg"'
    );
    expect(svgToHtmlImg('/a.svg', { title: 'Say "hi"' })).toContain('alt="Say &quot;hi&quot;"');
  });
});
