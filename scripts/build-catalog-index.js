#!/usr/bin/env node
/**
 * Build a compact gzipped catalog index (`data/catalog-index.json.gz`) from `output/`
 * This ~2.9 MB file allows Vercel (`svgcraft.vercel.app`) to search, filter, and browse
 * all 224,154+ icons and 1,504+ collections in memory while serving actual .svg files from Cloudflare R2.
 */
const fs = require('fs');
const zlib = require('zlib');
const { StateManager, CATALOG_INDEX_GZ_FILE } = require('@svg-hub/shared');

function main() {
  console.log('[Catalog Indexer] Đang quét thư mục output/ để đóng gói chỉ mục cho Vercel...');
  const sm = new StateManager();
  const { allIcons, collections } = sm.loadAllEnrichedIcons();

  if (!allIcons.length) {
    console.error('[Catalog Indexer] Không tìm thấy icon nào trong output/.');
    process.exit(1);
  }

  const compactPayload = {
    generatedAt: new Date().toISOString(),
    totalIcons: allIcons.length,
    totalCollections: collections.length,
    collections: collections.map((c) => [
      c.site,
      c.slug,
      c.name || c.slug,
      c.author || '',
      c.license || '',
      c.downloadedIconsCount || 0,
    ]),
    icons: allIcons.map((i) => {
      const varKeys = Object.keys(i.variants || {});
      return [
        i.site === 'allsvgicons' ? 2 : i.site === 'thesvg' ? 1 : 0,
        i.collectionSlug,
        i.id,
        i.slug,
        i.title,
        i.category,
        i.styleType,
        i.iconType,
        i.gridSize || '24x24',
        varKeys.length > 1 ? varKeys : 0,
      ];
    }),
  };

  const rawJson = JSON.stringify(compactPayload);
  const compressed = zlib.gzipSync(Buffer.from(rawJson, 'utf8'), { level: 9 });

  fs.writeFileSync(CATALOG_INDEX_GZ_FILE, compressed);

  const path = require('path');
  const webDataDir = path.resolve(__dirname, '../apps/web/data');
  if (!fs.existsSync(webDataDir)) {
    fs.mkdirSync(webDataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(webDataDir, 'catalog-index.json.gz'), compressed);

  console.log(
    `[Catalog Indexer] Hoàn tất! Đã đóng gói ${allIcons.length.toLocaleString()} icons (${collections.length.toLocaleString()} bộ sưu tập).`
  );
  console.log(
    `[Catalog Indexer] Kích thước JSON gốc: ${(rawJson.length / 1024 / 1024).toFixed(2)} MB -> Nén Gzip: ${(compressed.length / 1024 / 1024).toFixed(2)} MB (${CATALOG_INDEX_GZ_FILE})`
  );
}

main();
