#!/usr/bin/env node
/**
 * Synchronize SVG icons from `output/` to Cloudflare R2 (`svg-icon` bucket)
 * Built-in Free-Tier Protection Circuit-Breaker:
 * - Hard-caps storage at 8.5 GB (below 10 GB R2 Free limit)
 * - Hard-caps Class A writes at 800,000 requests/month (below 1,000,000 R2 Free limit)
 * - Tracks uploaded files locally in `data/r2-sync-state.json` (0 ListObjects / HeadObject requests)
 * - Minifies SVG XML before upload and sets `Cache-Control: public, max-age=31536000, immutable`
 */
const fs = require('fs');
const path = require('path');
const { R2Client, OUTPUT_DIR } = require('@svg-hub/shared');

function parseArgs() {
  const args = process.argv.slice(2);
  let concurrency = 25;
  let limit = Infinity;
  let dryRun = false;
  let siteFilter = '';

  for (const arg of args) {
    if (arg.startsWith('--concurrency=')) {
      concurrency = Math.max(1, Math.min(100, Number(arg.split('=')[1]) || 25));
    } else if (arg.startsWith('--limit=')) {
      limit = Math.max(1, Number(arg.split('=')[1]) || Infinity);
    } else if (arg.startsWith('--site=')) {
      siteFilter = String(arg.split('=')[1] || '').trim();
    } else if (arg === '--dry-run') {
      dryRun = true;
    }
  }
  return { concurrency, limit, dryRun, siteFilter };
}

function collectPendingSvgTasks(r2Client, maxLimit = Infinity, siteFilter = '') {
  const tasks = [];
  let skippedAlreadyUploaded = 0;

  if (!fs.existsSync(OUTPUT_DIR)) {
    return { tasks, skippedAlreadyUploaded };
  }

  // Prioritize allsvgicons & thesvg first when syncing all sites
  const allSites = fs.readdirSync(OUTPUT_DIR).filter((d) => {
    const full = path.join(OUTPUT_DIR, d);
    return fs.existsSync(full) && fs.statSync(full).isDirectory();
  });

  const priorityOrder = { allsvgicons: 0, thesvg: 1, svgrepo: 2 };
  allSites.sort((a, b) => (priorityOrder[a] ?? 9) - (priorityOrder[b] ?? 9));

  const sites = siteFilter ? allSites.filter((s) => s === siteFilter) : allSites;

  for (const siteId of sites) {
    const siteDir = path.join(OUTPUT_DIR, siteId);
    const cols = fs.readdirSync(siteDir).filter((d) => {
      const full = path.join(siteDir, d);
      return fs.existsSync(full) && fs.statSync(full).isDirectory();
    });

    for (const colSlug of cols) {
      const iconsDir = path.join(siteDir, colSlug, 'icons');
      if (!fs.existsSync(iconsDir)) continue;

      const files = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.svg'));
      for (const fileName of files) {
        const objectKey = `${siteId}/${colSlug}/icons/${fileName}`;
        if (r2Client.isAlreadyUploaded(objectKey)) {
          skippedAlreadyUploaded++;
          continue;
        }
        tasks.push({
          objectKey,
          fullPath: path.join(iconsDir, fileName),
        });
        if (tasks.length >= maxLimit) {
          return { tasks, skippedAlreadyUploaded };
        }
      }
    }
  }

  return { tasks, skippedAlreadyUploaded };
}

async function main() {
  const { concurrency, limit, dryRun, siteFilter } = parseArgs();
  const r2 = new R2Client();

  console.log('======================================================================');
  console.log(' SVGCraft -> Cloudflare R2 Sync (Free-Tier Quota Protected)');
  console.log('======================================================================');
  const initialSummary = r2.getQuotaSummary();
  console.log(`- S3 Endpoint : ${initialSummary.endpoint}`);
  console.log(`- Dung lượng  : ${initialSummary.storage.usedMB} MB / ${(initialSummary.storage.limitGB * 1024).toFixed(0)} MB giới hạn an toàn (Free Tier: 10 GB)`);
  console.log(`- Class A Ops : ${initialSummary.classAOperations.used.toLocaleString()} / ${initialSummary.classAOperations.limit.toLocaleString()} lượt ghi tháng ${initialSummary.currentMonth} (Free Tier: 1,000,000)`);
  console.log(`- Đã đồng bộ  : ${initialSummary.totalFilesUploaded.toLocaleString()} files`);
  if (siteFilter) {
    console.log(`- Lọc theo nguồn: ${siteFilter}`);
  }

  if (!dryRun && !r2.hasCredentials()) {
    console.error('\n[LỖI] Chưa tìm thấy R2_ACCESS_KEY_ID và R2_SECRET_ACCESS_KEY trong file .env!');
    console.error('Vui lòng thêm thông tin xác thực R2 vào file .env ở thư mục gốc trước khi chạy.');
    process.exit(1);
  }

  console.log('\nĐang quét danh sách file .svg cần đồng bộ trong output/...');
  const { tasks, skippedAlreadyUploaded } = collectPendingSvgTasks(r2, limit, siteFilter);
  console.log(`- Bỏ qua (đã có trên R2): ${skippedAlreadyUploaded.toLocaleString()} files`);
  console.log(`- Cần tải lên R2 đợt này : ${tasks.length.toLocaleString()} files (Concurrency: ${concurrency})`);

  if (tasks.length === 0 || dryRun) {
    if (dryRun) console.log('[Dry-Run] Kết thúc kiểm tra, không thực hiện ghi lên R2.');
    else console.log('Tất cả file SVG đã được đồng bộ lên Cloudflare R2!');
    return;
  }

  let cursor = 0;
  let uploadedCount = 0;
  let uploadedBytes = 0;
  let failedCount = 0;
  let quotaAborted = false;
  let quotaAbortReason = '';
  const startTime = Date.now();

  // Save state cleanly on Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n[Đang dừng] Đang lưu trạng thái r2-sync-state.json trước khi thoát...');
    r2.saveState();
    process.exit(0);
  });

  async function worker() {
    while (!quotaAborted) {
      const idx = cursor++;
      if (idx >= tasks.length) break;

      const task = tasks[idx];
      try {
        const rawSvg = fs.readFileSync(task.fullPath, 'utf8');
        const res = await r2.putSvgObject(task.objectKey, rawSvg, {
          skipIfUploaded: true,
          autoSaveState: false,
        });

        if (!res.skipped) {
          uploadedCount++;
          uploadedBytes += res.bytes;
        }

        if (uploadedCount > 0 && uploadedCount % 250 === 0) {
          r2.saveState();
          const elapsedSec = Math.max(1, (Date.now() - startTime) / 1000);
          const speed = (uploadedCount / elapsedSec).toFixed(1);
          const q = r2.getQuotaSummary();
          console.log(
            `[Tiến độ] Đã đẩy ${uploadedCount.toLocaleString()}/${tasks.length.toLocaleString()} files (${speed} files/s) | Tổng R2: ${q.storage.usedMB} MB | Class A: ${q.classAOperations.used.toLocaleString()}/${q.classAOperations.limit.toLocaleString()}`
          );
        }
      } catch (err) {
        if (err && err.code === 'R2_QUOTA_EXCEEDED') {
          quotaAborted = true;
          quotaAbortReason = err.message;
          break;
        }
        failedCount++;
        if (failedCount <= 10) {
          console.error(`[Lỗi tải file ${task.objectKey}]: ${err.message}`);
        }
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  r2.saveState();

  console.log('\n======================================================================');
  if (quotaAborted) {
    console.warn(`[CẦU CHÌ AN TOÀN KÍCH HOẠT] ${quotaAbortReason}`);
  } else {
    console.log('[HOÀN TẤT ĐỒNG BỘ R2]');
  }
  const finalQ = r2.getQuotaSummary();
  console.log(`- Đã tải lên mới : ${uploadedCount.toLocaleString()} files (${(uploadedBytes / 1024 / 1024).toFixed(2)} MB đã nén)`);
  console.log(`- Lỗi            : ${failedCount}`);
  console.log(`- Tổng lưu trữ R2: ${finalQ.storage.usedMB} MB / ${(finalQ.storage.limitGB * 1024).toFixed(0)} MB giới hạn an toàn`);
  console.log(`- Class A tháng  : ${finalQ.classAOperations.used.toLocaleString()} / ${finalQ.classAOperations.limit.toLocaleString()}`);
  console.log('======================================================================');
}

main().catch((err) => {
  console.error('[Fatal Error]:', err);
  process.exit(1);
});
