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

const CODE_TOKEN =
  /(<!--[\s\S]*?-->)|("[^"]*"|'[^']*')|(<\/?[a-zA-Z0-9:_-]+|\/>|>)|(\b(?:export|function|return|const|let|var|from|import|default|template|script|style)\b)|(\b[a-zA-Z_:][a-zA-Z0-9_:.-]*(?==))|(\{\.\.\.props\})|(\b\d+(?:\.\d+)?\b)/g;

/** One line of code → HTML with `tok-*` spans. Every piece of the input is escaped. */
export function highlightCodeLine(rawLine: string, tab = 'svg'): string {
  if (tab === 'datauri') {
    const m = rawLine.match(/^(data:image\/svg\+xml;utf8,)(.*)$/);
    if (m) return `<span class="tok-kw">${escapeHtml(m[1])}</span><span class="tok-str">${escapeHtml(m[2])}</span>`;
    return `<span class="tok-str">${escapeHtml(rawLine)}</span>`;
  }

  let result = '';
  let lastIdx = 0;
  for (const match of rawLine.matchAll(CODE_TOKEN)) {
    const full = match[0];
    const index = match.index ?? 0;
    if (index > lastIdx) result += escapeHtml(rawLine.slice(lastIdx, index));
    const [, comment, str, tagBracket, kw, attr, spreadProps, num] = match;
    if (comment) result += `<span class="tok-comm">${escapeHtml(full)}</span>`;
    else if (str) result += `<span class="tok-str">${escapeHtml(full)}</span>`;
    else if (tagBracket) {
      if (full === '>' || full === '/>') {
        result += `<span class="tok-punc">${escapeHtml(full)}</span>`;
      } else {
        const prefix = full.startsWith('</') ? '</' : '<';
        result += `<span class="tok-punc">${escapeHtml(prefix)}</span><span class="tok-tag">${escapeHtml(full.slice(prefix.length))}</span>`;
      }
    } else if (kw) result += `<span class="tok-kw">${escapeHtml(full)}</span>`;
    else if (attr) result += `<span class="tok-attr">${escapeHtml(full)}</span>`;
    else if (spreadProps) {
      result += `<span class="tok-punc">{</span><span class="tok-kw">...</span><span class="tok-fn">props</span><span class="tok-punc">}</span>`;
    } else if (num) result += `<span class="tok-num">${escapeHtml(full)}</span>`;
    else result += escapeHtml(full);
    lastIdx = index + full.length;
  }
  if (lastIdx < rawLine.length) result += escapeHtml(rawLine.slice(lastIdx));
  return result;
}

/** Whole snippet → HTML table of numbered, highlighted lines (`.code-lines-table`). */
export function highlightCodeBlock(code = '', tab = 'svg'): string {
  const rows = String(code)
    .split('\n')
    .map(
      (line, idx) =>
        `<div class="code-line"><span class="code-ln">${idx + 1}</span><span class="code-lc">${highlightCodeLine(line, tab) || ' '}</span></div>`
    )
    .join('');
  return `<div class="code-lines-table">${rows}</div>`;
}
