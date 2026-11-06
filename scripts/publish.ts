#!/usr/bin/env -S npx tsx
/**
 * Publish crawled icons: `output/` → R2 (content-addressed SVGs) + `data/catalog/` (JSON committed to git).
 *
 *   npm run publish                    upload new/changed SVGs to R2 as svg/{hash}.svg (and Lordicon
 *                                      animations as lottie/{hash}.json, gzip), write data/catalog/
 *   npm run publish -- --no-upload     only write data/catalog/ (icons not yet on R2 keep their legacy URL)
 *   npm run publish -- --max-uploads=1000 --concurrency=25
 *
 * Sync state lives in the catalog itself: an icon variant has `hash` only once `svg/{hash}.svg` is on R2
 * (`lottie` likewise for `lottie/{hash}.json`).
 * Unchanged files are skipped without any R2 request. Then: review `git diff data/catalog`, commit, push.
 */
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import {
  CATALOG_SCHEMA_VERSION,
  SITE_IDS,
  compareIconRecords,
  defaultIconFileName,
  iconFiles,
  serializeCollectionFile,
  serializeCollectionsList,
  type CatalogCollection,
  type CatalogCollectionFile,
  type CatalogIconRecord,
  type CatalogManifest,
  type SiteId,
} from '@svg-hub/catalog';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('@svg-hub/shared');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUTPUT_DIR: string = shared.OUTPUT_DIR;
const CATALOG_DIR = path.join(ROOT, 'data', 'catalog');
const HASH_LENGTH = 16;

interface Args {
  upload: boolean;
  concurrency: number;
  maxUploads: number;
}

function parseArgs(): Args {
  const args: Args = { upload: true, concurrency: 25, maxUploads: Infinity };
  for (const a of process.argv.slice(2)) {
    if (a === '--no-upload') args.upload = false;
    else if (a.startsWith('--concurrency='))
      args.concurrency = Math.max(1, Math.min(100, Number(a.split('=')[1]) || 25));
    else if (a.startsWith('--max-uploads=')) args.maxUploads = Math.max(0, Number(a.split('=')[1]) || 0);
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

const listDirs = (dir: string) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((d) => fs.statSync(path.join(dir, d)).isDirectory()) : [];

const contentHash = (content: string) => createHash('sha256').update(content).digest('hex').slice(0, HASH_LENGTH);
const svgKey = (h: string) => `svg/${h}.svg`;
const lottieKey = (h: string) => `lottie/${h}.json`;

interface PendingObject {
  body: string | Buffer;
  contentType: string;
  contentEncoding?: string;
}

/** Enriched legacy icon (StateManager.enrichIconRecord output) → catalog record, same rules as the old runtime. */
function toRecord(ic: Record<string, any>, site: SiteId): Omit<CatalogIconRecord, 'hash' | 'lottie'> {
  const slug = String(ic.slug || '');
  const title = String(ic.title || slug);
  const rawCategory = String(ic.rawCategory || '');
  const lordicon = site === 'lordicon' ? shared.resolveLordiconCategory(rawCategory, slug, title) : null;
  const cat = shared.normalizeCategoryId(
    lordicon ? lordicon.appCategory : ic.category || (site === 'allsvgicons' ? 'popular' : 'interface')
  );
  const type = String(ic.iconType || (site === 'allsvgicons' || site === 'lordicon' ? 'animated' : 'ui-icon'));
  const animated = type === 'animated' || site === 'allsvgicons' || site === 'lordicon';
  const lc = lordicon ? lordicon.lordiconCategory : animated ? cat : '';

  const files: Record<string, string> = {};
  for (const [name, rel] of Object.entries<string>(ic.variants || { default: ic.relativePath })) {
    if (!rel) continue;
    if (!rel.startsWith('icons/') || rel.slice(6).includes('/')) throw new Error(`Unexpected variant path ${rel}`);
    files[name] = rel.slice('icons/'.length);
  }

  const id = String(ic.id || slug);
  const rec: Omit<CatalogIconRecord, 'hash' | 'lottie'> = {
    id,
    slug,
    title,
    cat,
    style: String(ic.styleType || 'filled'),
    type,
    grid: String(ic.gridSize || '24x24'),
    at: String(ic.downloadedAt || ''),
  };
  const names = Object.keys(files);
  if (!(names.length === 1 && files.default === defaultIconFileName(id, slug))) rec.files = files;
  if (rawCategory && rawCategory !== cat) rec.raw = rawCategory;
  if (lc) rec.lc = lc;
  const tags = [...new Set<string>((ic.tags || []).map(String))];
  if (tags.length) rec.tags = tags;
  return rec;
}

function readPrevious(file: string): Map<string, CatalogIconRecord> {
  const map = new Map<string, CatalogIconRecord>();
  if (!fs.existsSync(file)) return map;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as CatalogCollectionFile;
    for (const ic of parsed.icons) map.set(ic.id, ic);
  } catch {
    /* corrupt or old format: treat as new */
  }
  return map;
}

/** Every content-addressed object key already on R2, according to the committed catalog. */
function collectKnownKeys(): Set<string> {
  const known = new Set<string>();
  const root = path.join(CATALOG_DIR, 'collections');
  for (const site of listDirs(root)) {
    for (const f of fs.readdirSync(path.join(root, site))) {
      if (!f.endsWith('.json')) continue;
      for (const [, ic] of readPrevious(path.join(root, site, f))) {
        for (const h of Object.values(ic.hash ?? {})) known.add(svgKey(h));
        if (ic.lottie) known.add(lottieKey(ic.lottie));
      }
    }
  }
  return known;
}

async function runPool<T>(items: T[], concurrency: number, fn: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (next < items.length) await fn(items[next++]!);
    })
  );
}

async function main() {
  const args = parseArgs();
  const sm = new shared.StateManager();
  const r2 = args.upload ? new shared.R2Client() : null;
  if (r2 && !r2.hasCredentials()) {
    throw new Error(
      'Thiếu R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY trong .env (hoặc chạy với --no-upload)'
    );
  }

  const known = collectKnownKeys();
  console.log(`[publish] Đã có trên R2 (theo catalog): ${known.size.toLocaleString()} object`);

  const written = new Set<string>();
  const summaries: CatalogCollection[] = [];
  let uploaded = 0;
  let uploadedBytes = 0;
  let failed = 0;
  let stopUploads = '';
  let totalIcons = 0;
  let hashedIcons = 0;
  let lottieIcons = 0;

  for (const site of SITE_IDS) {
    for (const dir of listDirs(path.join(OUTPUT_DIR, site))) {
      const entry = sm._getCachedCollectionEntry(site, dir);
      if (!entry || !entry.enrichedIcons?.length) continue;
      const info = entry.colInfo;
      const slug = String(info.slug || dir);
      const outFile = path.join(CATALOG_DIR, 'collections', site, `${slug}.json`);
      const previous = readPrevious(outFile);
      const iconsDir = path.join(OUTPUT_DIR, site, dir, 'icons');

      // Hash only when it can matter: uploading, or verifying a previously recorded hash
      const pending = new Map<string, PendingObject>(); // object key → body
      const records: CatalogIconRecord[] = entry.enrichedIcons.map((ic: Record<string, any>) => {
        const rec: CatalogIconRecord = toRecord(ic, site);
        const prev = previous.get(rec.id);
        const prevHash = prev?.hash ?? {};
        const hash: Record<string, string> = {};
        for (const [variant, file] of Object.entries(iconFiles(rec))) {
          if (!args.upload && !prevHash[variant]) continue;
          const full = path.join(iconsDir, file);
          if (!fs.existsSync(full)) continue;
          const minified: string = shared.minifySvg(fs.readFileSync(full, 'utf8'));
          const h = contentHash(minified);
          hash[variant] = h;
          if (!known.has(svgKey(h)))
            pending.set(svgKey(h), { body: minified, contentType: 'image/svg+xml; charset=utf-8' });
        }
        if (Object.keys(hash).length) rec.hash = hash;

        // Lordicon animation data (written by the crawler / `npm run lordicon:lottie`)
        if (site === 'lordicon' && (args.upload || prev?.lottie)) {
          const lottieFile = shared.lottieFilePath(OUTPUT_DIR, dir, rec.slug);
          if (fs.existsSync(lottieFile)) {
            const json = fs.readFileSync(lottieFile, 'utf8');
            const h = contentHash(json);
            rec.lottie = h;
            if (!known.has(lottieKey(h)) && args.upload) {
              pending.set(lottieKey(h), {
                body: gzipSync(json, { level: 9 }),
                contentType: 'application/json; charset=utf-8',
                contentEncoding: 'gzip',
              });
            }
          }
        }
        return rec;
      });

      // Upload missing objects for this collection, then drop hashes that are still not on R2
      if (pending.size && r2 && !stopUploads) {
        const queue = [...pending.keys()].slice(0, Math.max(0, args.maxUploads - uploaded));
        await runPool(queue, args.concurrency, async (key) => {
          if (stopUploads) return;
          const obj = pending.get(key)!;
          try {
            const res = await r2.putObject(key, obj.body, {
              contentType: obj.contentType,
              contentEncoding: obj.contentEncoding,
              autoSaveState: false,
              recordKey: false,
            });
            known.add(key);
            uploaded++;
            uploadedBytes += res.bytes;
          } catch (err: any) {
            if (err?.code === 'R2_QUOTA_EXCEEDED') stopUploads = err.message;
            else if (++failed <= 10) console.error(`[publish] Lỗi upload ${key}: ${err?.message}`);
          }
        });
        if (uploaded >= args.maxUploads && !stopUploads) stopUploads = `đạt --max-uploads=${args.maxUploads}`;
        r2.saveState();
      }
      for (const rec of records) {
        if (rec.lottie && !known.has(lottieKey(rec.lottie))) delete rec.lottie;
        if (!rec.hash) continue;
        for (const [v, h] of Object.entries(rec.hash)) if (!known.has(svgKey(h))) delete rec.hash[v];
        if (Object.keys(rec.hash).length === 0) delete rec.hash;
      }

      records.sort(compareIconRecords);
      const header: CatalogCollection = {
        site,
        slug,
        name: String(info.name || slug),
        author: String(info.author || 'Open Source'),
        license: String(info.license || 'MIT / CC0'),
        count: records.length,
      };
      if (info.description) header.description = String(info.description);
      if (info.url) header.sourceUrl = String(info.url);
      if (info.updatedAt || info.crawledAt) header.updatedAt = String(info.updatedAt || info.crawledAt);

      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      const text = serializeCollectionFile({ ...header, icons: records });
      if (!fs.existsSync(outFile) || fs.readFileSync(outFile, 'utf8') !== text) fs.writeFileSync(outFile, text);
      written.add(outFile);
      summaries.push(header);
      totalIcons += records.length;
      hashedIcons += records.filter(
        (r) => r.hash && Object.keys(r.hash).length === Object.keys(iconFiles(r)).length
      ).length;
      lottieIcons += records.filter((r) => r.lottie).length;
      if (uploaded > 0 && uploaded % 1000 < pending.size) {
        console.log(
          `[publish] Đã upload ${uploaded.toLocaleString()} file (${(uploadedBytes / 1048576).toFixed(1)} MB)`
        );
      }
    }
  }

  // Remove collections that disappeared from output/
  const colRoot = path.join(CATALOG_DIR, 'collections');
  let removed = 0;
  for (const site of listDirs(colRoot)) {
    for (const f of fs.readdirSync(path.join(colRoot, site))) {
      const full = path.join(colRoot, site, f);
      if (f.endsWith('.json') && !written.has(full)) {
        fs.unlinkSync(full);
        removed++;
      }
    }
  }

  summaries.sort((a, b) => (`${a.site}/${a.slug}` < `${b.site}/${b.slug}` ? -1 : 1));
  fs.writeFileSync(path.join(CATALOG_DIR, 'collections.json'), serializeCollectionsList(summaries));
  const manifest: CatalogManifest = {
    schema: CATALOG_SCHEMA_VERSION,
    totalIcons,
    totalCollections: summaries.length,
    hashedIcons,
    lottieIcons,
  };
  fs.writeFileSync(path.join(CATALOG_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log('[publish] Xong');
  console.log(`  Collection : ${summaries.length.toLocaleString()} (xoá ${removed})`);
  console.log(`  Icon       : ${totalIcons.toLocaleString()} (đã lên R2 theo hash: ${hashedIcons.toLocaleString()})`);
  console.log(`  Animation  : ${lottieIcons.toLocaleString()} icon có Lottie trên R2`);
  console.log(
    `  Upload mới : ${uploaded.toLocaleString()} file, ${(uploadedBytes / 1048576).toFixed(1)} MB, lỗi ${failed}`
  );
  if (stopUploads) console.warn(`  Dừng upload: ${stopUploads}. Chạy lại để upload tiếp.`);
  if (!args.upload) console.log('  (--no-upload: icon chưa có hash dùng đường dẫn R2 cũ)');
  console.log('  Tiếp theo: git diff --stat data/catalog && git add data/catalog && git commit');
}

main().catch((err) => {
  console.error('[publish] Lỗi:', err);
  process.exit(1);
});
