#!/usr/bin/env -S npx tsx
/**
 * data/catalog/ (committed JSON) → apps/web/data/{index.bin,details.bin} (derived, gitignored).
 * Runs automatically before `next build` and `next dev`.
 *
 *   tsx scripts/build-catalog-index.ts            always rebuild
 *   tsx scripts/build-catalog-index.ts --if-stale skip when the index is newer than every catalog file
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { buildCatalogIndex, type CatalogCollectionFile, type TaxonomyInput } from '@svg-hub/catalog';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CATALOG_DIR = path.join(ROOT, 'data', 'catalog');
const OUT_DIR = path.join(ROOT, 'apps', 'web', 'data');
const INDEX_FILE = path.join(OUT_DIR, 'index.bin');
const DETAILS_FILE = path.join(OUT_DIR, 'details.bin');

function catalogFiles(): string[] {
  const root = path.join(CATALOG_DIR, 'collections');
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .flatMap((site) =>
      fs
        .readdirSync(path.join(root, site))
        .filter((f) => f.endsWith('.json'))
        .map((f) => path.join(root, site, f))
    )
    .sort();
}

function loadTaxonomy(): TaxonomyInput {
  // Taxonomy still lives in the legacy CommonJS package (moves to packages/core later)
  const shared = require('@svg-hub/shared');
  return {
    categories: shared.CATEGORY_DEFINITIONS.map((c: any) => ({ id: c.id, label: c.label, icon: c.icon })),
    lordiconCategories: shared.LORDICON_CATEGORIES.map((c: any) => ({
      id: c.id,
      label: c.label,
      labelVi: c.labelVi,
      appCategory: c.appCategory,
    })),
    styles: shared.STYLE_TYPES,
    iconTypes: shared.ICON_TYPES,
    sites: [
      { id: 'svgrepo', label: 'Vector Pack' },
      { id: 'thesvg', label: 'Brand Pack' },
      { id: 'allsvgicons', label: 'Motion Pack' },
      { id: 'lordicon', label: 'Interactive Motion' },
    ],
    brands: shared.BRAND_ECOSYSTEM_DEFINITIONS,
    strictBrandCollections: [...shared.STRICT_BRAND_COLLECTIONS],
    categoryAliases: shared.LEGACY_CATEGORY_MAP,
  };
}

function main() {
  const files = catalogFiles();
  if (files.length === 0) {
    console.error('[catalog-index] data/catalog/ trống. Chạy `npm run publish` trước.');
    process.exit(1);
  }

  if (process.argv.includes('--if-stale') && fs.existsSync(INDEX_FILE) && fs.existsSync(DETAILS_FILE)) {
    const builtAt = fs.statSync(INDEX_FILE).mtimeMs;
    const sources = [...files, path.join(CATALOG_DIR, 'collections.json'), new URL(import.meta.url).pathname];
    const newest = Math.max(...sources.filter(fs.existsSync).map((f) => fs.statSync(f).mtimeMs));
    if (newest <= builtAt) {
      console.log('[catalog-index] Index đã mới, bỏ qua.');
      return;
    }
  }

  const started = Date.now();
  const digest = createHash('sha256');
  const collections = files.map((f) => {
    const text = fs.readFileSync(f, 'utf8');
    digest.update(text);
    return JSON.parse(text) as CatalogCollectionFile;
  });
  // Same catalog → same build id, so pagination cursors survive redeploys of unchanged data
  const buildId = digest.digest('hex').slice(0, 12);

  const built = buildCatalogIndex(collections, loadTaxonomy(), { buildId });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(INDEX_FILE, built.index);
  fs.writeFileSync(DETAILS_FILE, built.details);

  const mb = (n: number) => `${(n / 1048576).toFixed(1)} MB`;
  console.log(
    `[catalog-index] ${built.stats.icons.toLocaleString()} icon, ${built.stats.collections} collection, ` +
      `${built.stats.tokens.toLocaleString()} token → index.bin ${mb(built.stats.indexBytes)}, ` +
      `details.bin ${mb(built.stats.detailsBytes)} (${Date.now() - started} ms, build ${buildId})`
  );
}

main();
