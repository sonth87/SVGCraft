/** Small text formatting helpers. Pure, no DOM. */

export function escapeHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** `512` → `512 B`, `2048` → `2.0 KB`. */
export function formatBytes(bytes: unknown): string {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

/** Pretty-print compact SVG/XML into indented lines. Drops the XML prolog and comments. */
export function prettyFormatSvgXml(rawXml = ''): string {
  const cleaned = String(rawXml)
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  if (!cleaned) return '';

  // `>\s*<` (not `\s+`): crawled SVGs are usually minified with no whitespace between tags
  const lines = cleaned
    .replace(/>\s*</g, '>\n<')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  let indent = 0;
  const out: string[] = [];
  for (const line of lines) {
    const isClosing = /^<\//.test(line);
    const isSelfClosing = /\/>$/.test(line) || /^<(\?xml|!DOCTYPE|!--)/i.test(line);
    const hasInlineClose = /^<([a-zA-Z0-9:_-]+)\b[^>]*>.*<\/\1>$/.test(line);

    if (isClosing && indent > 0) indent -= 1;
    out.push(`${'  '.repeat(indent)}${line}`);
    if (!isClosing && !isSelfClosing && !hasInlineClose && /^<[a-zA-Z0-9:_-]+/.test(line)) indent += 1;
  }
  return out.join('\n');
}
