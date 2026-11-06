#!/usr/bin/env -S npx tsx
/**
 * Delete the pre-hash R2 objects `{site}/{collection}/icons/{file}` once every icon in the committed
 * catalog is served from `svg/{hash}.svg`. Content-addressed `svg/` and `lottie/` are never touched.
 *
 *   npm run r2:delete-legacy            dry run: count what would be deleted
 *   npm run r2:delete-legacy -- --yes   delete (irreversible)
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('@svg-hub/shared');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LEGACY_PREFIXES = ['svgrepo/', 'thesvg/', 'allsvgicons/', 'lordicon/'];
const LEGACY_KEY = /^(svgrepo|thesvg|allsvgicons|lordicon)\/[^/]+\/icons\/[^/]+$/;
const confirm = process.argv.includes('--yes');

async function listAll(r2: any, prefix: string) {
  const out: { key: string; size: number }[] = [];
  let token = '';
  do {
    const page = await r2.listObjects(prefix, token);
    out.push(...page.keys);
    token = page.nextToken;
  } while (token);
  return out;
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'catalog', 'manifest.json'), 'utf8'));
  if (manifest.hashedIcons !== manifest.totalIcons) {
    throw new Error(
      `Catalog chưa đủ hash (${manifest.hashedIcons}/${manifest.totalIcons}). Chạy npm run publish trước.`
    );
  }

  const r2 = new shared.R2Client();
  if (!r2.hasCredentials()) throw new Error('Thiếu thông tin R2 trong .env');

  // Sanity check: the content-addressed copies really exist
  const hashed = await listAll(r2, 'svg/');
  console.log(`[legacy] svg/ trên R2: ${hashed.length.toLocaleString()} object`);
  if (hashed.length < 200_000) throw new Error('svg/ có ít object bất thường, dừng lại để kiểm tra.');

  const legacy: { key: string; size: number }[] = [];
  let skipped = 0;
  for (const prefix of LEGACY_PREFIXES) {
    for (const obj of await listAll(r2, prefix)) {
      if (LEGACY_KEY.test(obj.key)) legacy.push(obj);
      else skipped++;
    }
  }
  const bytes = legacy.reduce((n, o) => n + o.size, 0);
  console.log(
    `[legacy] Key cũ: ${legacy.length.toLocaleString()} object, ${(bytes / 1048576).toFixed(1)} MB (bỏ qua ${skipped} key không đúng mẫu)`
  );

  if (!confirm) {
    console.log('[legacy] Chạy thử, chưa xoá gì. Thêm --yes để xoá.');
    r2.saveState();
    return;
  }

  let deleted = 0;
  let errors = 0;
  for (let i = 0; i < legacy.length; i += 1000) {
    const batch = legacy.slice(i, i + 1000).map((o) => o.key);
    errors += await r2.deleteObjects(batch);
    deleted += batch.length;
    if (deleted % 20000 < 1000 || deleted === legacy.length) {
      console.log(`[legacy] Đã xoá ${deleted.toLocaleString()}/${legacy.length.toLocaleString()} (lỗi ${errors})`);
    }
  }

  // Old per-key sync state is meaningless now (the catalog holds the sync state)
  r2.state.uploadedKeys = {};
  r2.state.totalFilesUploaded = hashed.length;
  r2.state.totalBytesUploaded = Math.max(0, r2.state.totalBytesUploaded - bytes);
  r2.saveState();
  console.log(`[legacy] Xong: xoá ${deleted.toLocaleString()} object, lỗi ${errors}`);
}

main().catch((err) => {
  console.error('[legacy] Lỗi:', err.message);
  process.exit(1);
});
