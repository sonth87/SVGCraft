/**
 * SVG storage access for server code: local `output/` in development, Cloudflare R2 otherwise.
 * Browsers load SVGs from `assetUrl` (the CDN domain, or the same-origin `/cdn/*` mirror); this is for
 * the detail and Lottie APIs and the proxies themselves.
 */
import path from 'node:path';
import { OUTPUT_DIR, R2Client } from '@svg-hub/shared';
import type { CatalogIndex } from '@svg-hub/catalog';

export { OUTPUT_DIR };

const globalStore = globalThis as typeof globalThis & { __svgcraftR2?: R2Client };

export function getR2Client(): R2Client {
  globalStore.__svgcraftR2 ??= new R2Client();
  return globalStore.__svgcraftR2;
}

// Hidden from the Next file tracer so the 1.4 GB output/ folder is never bundled into functions
// eslint-disable-next-line no-eval
const runtimeFs: typeof import('fs') = eval('require')('fs');

/** Read a local file if it exists (development: crawled `output/`; absent on Vercel). */
export function readLocalFile(full: string): string | null {
  return runtimeFs.existsSync(full) ? runtimeFs.readFileSync(full, 'utf8') : null;
}

/** Read a crawled file from local `output/` (development only). */
export function readLocalOutput(site: string, collection: string, file: string): string | null {
  return readLocalFile(path.join(OUTPUT_DIR, site, collection, 'icons', path.basename(file)));
}

/** SVG text of one icon variant: local output first, then R2 (content-hash key, then legacy key). */
export async function loadIconSvg(index: CatalogIndex, ord: number, variant = 'default'): Promise<string | null> {
  const icon = index.iconDetail(ord);
  const file = icon.variants[variant]?.replace(/^icons\//, '');
  if (file) {
    const local = readLocalOutput(icon.site, icon.collectionSlug, file);
    if (local) return local;
  }
  const r2 = getR2Client();
  for (const key of index.objectKeys(ord, variant)) {
    const svg = await r2.getObjectText(key).catch(() => null);
    if (svg && svg.includes('<svg')) return svg;
  }
  return null;
}
