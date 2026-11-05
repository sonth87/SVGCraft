/** Code generators for the Export panel (React JSX, Vue SFC, HTML <img>, Data URI). Pure, no DOM. */
import { prettyFormatSvgXml } from './format';

/** `3609-phone-bluetooth` → `Svg3609PhoneBluetoothIcon`; `arrow-left` → `ArrowLeftIcon`. */
export function toPascalCaseComponentName(slug = 'Icon'): string {
  const base = String(slug)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  const safe = /^[0-9]/.test(base) ? `Svg${base}` : base || 'Custom';
  return safe.endsWith('Icon') ? safe : `${safe}Icon`;
}

// ---------------------------------------------------------------------------
// JSX
// ---------------------------------------------------------------------------

/** Attribute names React expects in a non-mechanical form. */
const JSX_ATTR_OVERRIDES: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
};

/** `stroke-width` → `strokeWidth`, `xlink:href` → `xlinkHref`; `data-*` / `aria-*` stay as-is. */
export function toJsxAttributeName(name: string): string {
  const override = JSX_ATTR_OVERRIDES[name];
  if (override) return override;
  if (/^(data|aria)-/.test(name)) return name;
  return name.replace(/[-:]([a-zA-Z])/g, (_, c: string) => c.toUpperCase());
}

/** `font-size:12px; -webkit-mask: x` → `{ fontSize: '12px', WebkitMask: 'x' }` source text. */
export function cssDeclarationsToJsxObject(css: string): string {
  const props = css
    .split(';')
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => {
      const colon = decl.indexOf(':');
      if (colon <= 0) return null;
      const rawName = decl.slice(0, colon).trim();
      const value = decl.slice(colon + 1).trim();
      const key = rawName.startsWith('--')
        ? `'${rawName}'`
        : rawName
            .replace(/^-ms-/, 'ms-')
            .replace(/^-([a-z])/, (_, c: string) => c.toUpperCase())
            .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      return `${key}: '${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
    })
    .filter((p): p is string => p !== null);
  return `{{ ${props.join(', ')} }}`;
}

const STYLE_BLOCK = /<style\b([^>]*)>([\s\S]*?)<\/style>/gi;
const TAG = /<([a-zA-Z][\w:.-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>/g;
const ATTR = /([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'))?/g;

function convertTagToJsx(_full: string, tagName: string, attrs: string, selfClose: string): string {
  const converted = attrs.replace(ATTR, (attrFull, name: string, quoted?: string) => {
    if (quoted === undefined) return attrFull;
    const jsxName = toJsxAttributeName(name);
    if (jsxName === 'style') return `style=${cssDeclarationsToJsxObject(quoted.slice(1, -1))}`;
    return `${jsxName}=${quoted}`;
  });
  return `<${tagName}${converted}${selfClose ? ' /' : ''}>`;
}

/**
 * Convert an SVG string into a React function component.
 * - every hyphenated / namespaced attribute is camel-cased, `class` → `className`
 * - inline `style="…"` strings become style objects
 * - `<style>` contents are wrapped in a template literal so CSS braces don't break JSX
 * - `{...props}` is spread on the root `<svg>`
 */
export function svgToJsx(svgText: string, componentName = 'SvgIcon'): string {
  const styleBlocks: string[] = [];
  const withoutStyles = String(svgText).replace(STYLE_BLOCK, (_, attrs: string, css: string) => {
    styleBlocks.push(
      `<style${attrs}>{\`${css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`}</style>`
    );
    // Self-closing placeholder tag so the formatter puts it on its own line
    return `<svgcraft-style-${styleBlocks.length - 1}/>`;
  });

  const jsxMarkup = prettyFormatSvgXml(withoutStyles)
    .replace(TAG, convertTagToJsx)
    .replace(/<svg\b/, '<svg {...props}')
    .replace(/<svgcraft-style-(\d+) \/>/g, (_, i: string) => styleBlocks[Number(i)] ?? '');

  const body = jsxMarkup
    .split('\n')
    .map((l) => `    ${l}`)
    .join('\n');
  return `export function ${componentName}(props) {\n  return (\n${body}\n  );\n}`;
}

// ---------------------------------------------------------------------------
// Vue / HTML / Data URI
// ---------------------------------------------------------------------------

export function svgToVue(svgText: string): string {
  const body = prettyFormatSvgXml(svgText)
    .replace(/<svg\b/, '<svg v-bind="$attrs"')
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n');
  return `<template>\n${body}\n</template>`;
}

export interface HtmlImgOptions {
  title?: string;
  width?: number | string;
  height?: number | string;
  /** Prepended to relative asset URLs (e.g. `https://svgcraft.app`). Absolute URLs are kept as-is. */
  origin?: string;
}

/** `<img>` snippet. Absolute URLs (CDN) are used as-is; relative ones are resolved against `origin`. */
export function svgToHtmlImg(
  assetUrl: string,
  { title = 'Icon', width = 24, height = 24, origin = '' }: HtmlImgOptions = {}
): string {
  const isAbsolute = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(assetUrl) || assetUrl.startsWith('data:');
  const src = isAbsolute ? assetUrl : `${origin.replace(/\/+$/, '')}${assetUrl}`;
  const attr = (v: unknown) => String(v).replace(/"/g, '&quot;');
  return `<img\n  src="${attr(src)}"\n  alt="${attr(title)}"\n  width="${attr(width)}"\n  height="${attr(height)}"\n  loading="lazy"\n/>`;
}

export function svgToDataUri(svgText: string): string {
  const cleaned = String(svgText)
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
}
