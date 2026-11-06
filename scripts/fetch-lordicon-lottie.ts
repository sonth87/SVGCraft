#!/usr/bin/env -S npx tsx
/**
 * Backfill Lordicon animation data for icons that were crawled before the crawler saved it:
 * downloads every missing `.li`, decodes it and writes `output/lordicon/{col}/lottie/{slug}.json`.
 *
 *   npm run lordicon:lottie                      all collections, skip files already on disk
 *   npm run lordicon:lottie -- --concurrency=4 --collection=lordicon-wired-flat
 *
 * Safe to stop and re-run at any time. Afterwards run `npm run publish` to upload them to R2.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('@svg-hub/shared');

const OUTPUT_DIR: string = shared.OUTPUT_DIR;
const LORDICON_DIR = path.join(OUTPUT_DIR, 'lordicon');
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const args = { concurrency: 6, collection: '' };
for (const a of process.argv.slice(2)) {
  if (a.startsWith('--concurrency=')) args.concurrency = Math.max(1, Math.min(16, Number(a.split('=')[1]) || 6));
  else if (a.startsWith('--collection=')) args.collection = a.split('=')[1] ?? '';
  else throw new Error(`Unknown argument: ${a}`);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchLottie(url: string): Promise<unknown> {
  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt) await sleep(1000 * 2 ** attempt);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: '*/*' } });
      if (res.status === 404) throw Object.assign(new Error('HTTP 404'), { permanent: true });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return shared.decodeLordiconLi(await res.text());
    } catch (err) {
      lastErr = err as Error;
      if ((err as { permanent?: boolean }).permanent) break;
    }
  }
  throw lastErr ?? new Error('unknown error');
}

async function main() {
  const collections = fs
    .readdirSync(LORDICON_DIR)
    .filter((d) => fs.existsSync(path.join(LORDICON_DIR, d, 'metadata.json')))
    .filter((d) => !args.collection || d === args.collection)
    .sort();

  const jobs: { url: string; file: string; label: string }[] = [];
  for (const col of collections) {
    const parsed = shared.parseLordiconCollectionSlug(col);
    if (!parsed) continue;
    const meta = JSON.parse(fs.readFileSync(path.join(LORDICON_DIR, col, 'metadata.json'), 'utf8'));
    for (const icon of meta.icons ?? []) {
      const file = shared.lottieFilePath(OUTPUT_DIR, col, icon.slug);
      if (fs.existsSync(file)) continue;
      jobs.push({
        url: shared.lordiconLiUrl(parsed.family, parsed.style, icon.slug),
        file,
        label: `${col}/${icon.slug}`,
      });
    }
  }
  console.log(`[lottie] ${collections.length} bộ, cần tải ${jobs.length.toLocaleString()} file`);

  let done = 0;
  let bytes = 0;
  const failed: string[] = [];
  const started = Date.now();
  let next = 0;
  await Promise.all(
    Array.from({ length: args.concurrency }, async () => {
      while (next < jobs.length) {
        const job = jobs[next++]!;
        try {
          const json = JSON.stringify(await fetchLottie(job.url));
          fs.mkdirSync(path.dirname(job.file), { recursive: true });
          fs.writeFileSync(job.file + '.tmp', json);
          fs.renameSync(job.file + '.tmp', job.file);
          bytes += json.length;
        } catch (err) {
          failed.push(`${job.label}: ${(err as Error).message}`);
        }
        done++;
        if (done % 500 === 0 || done === jobs.length) {
          const rate = done / ((Date.now() - started) / 1000);
          console.log(
            `[lottie] ${done.toLocaleString()}/${jobs.length.toLocaleString()} (${(bytes / 1048576).toFixed(1)} MB, ${rate.toFixed(1)}/s, lỗi ${failed.length})`
          );
        }
        await sleep(50);
      }
    })
  );

  if (failed.length) {
    console.log(`[lottie] ${failed.length} file lỗi (chạy lại lệnh để thử tiếp):`);
    for (const f of failed.slice(0, 30)) console.log('  ' + f);
  }
  console.log('[lottie] Xong. Tiếp theo: npm run publish');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
