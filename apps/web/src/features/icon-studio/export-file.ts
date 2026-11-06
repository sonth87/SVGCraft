/** Browser-side file output: download a text file, rasterize an SVG to PNG. */

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Set width/height on the root `<svg>` only (a plain replace would also hit `stroke-width`). */
function withRootSize(svg: string, size: number): string {
  return svg.replace(/<svg\b[^>]*>/i, (tag) => {
    let out = tag
      .replace(/(\s)width=["'][^"']*["']/i, `$1width="${size}"`)
      .replace(/(\s)height=["'][^"']*["']/i, `$1height="${size}"`);
    if (!/\swidth=/i.test(out)) out = out.replace('<svg', `<svg width="${size}"`);
    if (!/\sheight=/i.test(out)) out = out.replace('<svg', `<svg height="${size}"`);
    if (!/\bxmlns=/i.test(out)) out = out.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    return out;
  });
}

export function svgToPngBlob(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(
      new Blob([withRootSize(svg.trim(), size)], { type: 'image/svg+xml;charset=utf-8' })
    );
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvas.getContext('2d')?.drawImage(img, 0, 0, size, size);
      canvas.toBlob((png) => (png ? resolve(png) : reject(new Error('Failed to create PNG'))), 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };
    img.src = url;
  });
}

/** Copy a PNG to the clipboard; false when the browser refuses, so the caller can download instead. */
export async function copyPng(png: Blob): Promise<boolean> {
  if (!navigator.clipboard || !window.ClipboardItem) return false;
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    return true;
  } catch {
    return false;
  }
}
