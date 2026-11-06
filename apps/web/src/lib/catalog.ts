/**
 * Server-side access to the catalog search index (`data/index.bin` + `data/details.bin`, generated from
 * the committed `data/catalog/` by scripts/build-catalog-index.ts before `next dev` / `next build`).
 *
 * One read of index.bin per server instance (~40 ms); details.bin is read with positional reads, one
 * small record per detail request, so it never sits in memory.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CatalogIndex } from '@svg-hub/catalog';

const DATA_DIR = path.join(process.cwd(), 'data');
const INDEX_FILE = path.join(DATA_DIR, 'index.bin');
const DETAILS_FILE = path.join(DATA_DIR, 'details.bin');

interface Loaded {
  index: CatalogIndex;
  mtimeMs: number;
  fd: number;
}

// Survives Next dev hot reloads and warm serverless invocations
const globalStore = globalThis as typeof globalThis & { __svgcraftCatalog?: Loaded };

function load(): Loaded {
  if (!fs.existsSync(INDEX_FILE)) {
    throw new Error('Catalog index not found. Run `npm run build:index` (needs data/catalog/, see `npm run publish`).');
  }
  const mtimeMs = fs.statSync(INDEX_FILE).mtimeMs;
  const fd = fs.openSync(DETAILS_FILE, 'r');
  const index = CatalogIndex.fromBytes(fs.readFileSync(INDEX_FILE), {
    readDetails: (start, end) => {
      const buf = Buffer.alloc(end - start);
      fs.readSync(fd, buf, 0, buf.length, start);
      return buf;
    },
    // Dev: grid SVGs via /svg/* (serves local output/ first); otherwise the CDN domain or /cdn/* mirror
    assets: { publicUrl: process.env.R2_PUBLIC_URL, localFirst: process.env.NODE_ENV === 'development' },
  });
  return { index, mtimeMs, fd };
}

export function getCatalog(): CatalogIndex {
  const cached = globalStore.__svgcraftCatalog;
  if (cached) {
    // In dev, pick up a rebuilt index without restarting the server
    if (process.env.NODE_ENV !== 'development') return cached.index;
    if (fs.statSync(INDEX_FILE).mtimeMs === cached.mtimeMs) return cached.index;
    fs.closeSync(cached.fd);
  }
  globalStore.__svgcraftCatalog = load();
  return globalStore.__svgcraftCatalog.index;
}

// ---------------------------------------------------------------------------
// Request helpers shared by the API routes
// ---------------------------------------------------------------------------

export function readPaging(
  params: URLSearchParams,
  { defaultLimit, maxLimit }: { defaultLimit: number; maxLimit: number }
) {
  const limit = Math.min(Math.max(1, Number(params.get('limit')) || defaultLimit), maxLimit);
  const offset = Math.max(0, Number(params.get('offset')) || 0);
  return { limit, offset, cursor: params.get('cursor') || null };
}

export const readText = (params: URLSearchParams, key: string, max = 80) => String(params.get(key) || '').slice(0, max);

export function cacheHeaders(index: CatalogIndex, sMaxAge: number, swr: number): HeadersInit {
  return {
    'Cache-Control': `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`,
    'X-Catalog-Build': index.buildId,
  };
}
