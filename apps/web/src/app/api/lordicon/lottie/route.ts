/**
 * Lordicon animation (Lottie JSON + motion states) for the studio and grid hover previews.
 * Served from our own storage only — local `output/` in development, R2 (`lottie/{hash}.json`)
 * otherwise. lordicon.com is never contacted at runtime.
 *
 *   GET /api/lordicon/lottie?collection=lordicon-wired-flat&slug=54-image-mountain
 *   GET /api/lordicon/lottie?family=wired&style=flat&slug=54-image-mountain[&includeSvg=1]
 */
import { NextResponse } from 'next/server';
import { extractLordiconMotionStates, lottieFilePath } from '@svg-hub/shared';
import { cacheHeaders, getCatalog } from '@/lib/catalog';
import { getR2Client, loadIconSvg, OUTPUT_DIR, readLocalFile } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const SAFE = /^[a-z0-9-]+$/;

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const family = String(params.get('family') || '')
      .toLowerCase()
      .trim();
    const style = String(params.get('style') || '')
      .toLowerCase()
      .trim();
    const slug = String(params.get('slug') || '')
      .trim()
      .replace(/\.(svg|li|json)$/i, '');
    const collection =
      family && style
        ? `lordicon-${family}-${style}`
        : String(params.get('collection') || '')
            .toLowerCase()
            .trim();

    if (!collection.startsWith('lordicon-') || !SAFE.test(collection) || !slug || slug.length > 120) {
      return NextResponse.json({ error: 'Tham số collection/family/style hoặc slug không hợp lệ.' }, { status: 400 });
    }

    const index = getCatalog();
    const ord = index.findIcon('lordicon', collection, slug);
    if (ord < 0) return NextResponse.json({ error: 'Không tìm thấy icon.' }, { status: 404 });
    const icon = index.item(ord);

    // Local output first (development), then R2
    let text = readLocalFile(lottieFilePath(OUTPUT_DIR, icon.collectionSlug, icon.slug));
    if (!text) {
      const key = index.lottieKey(ord);
      text = key ? await getR2Client().getObjectText(key) : null;
    }
    if (!text) return NextResponse.json({ error: 'Icon này chưa có dữ liệu animation.' }, { status: 404 });

    const lottie = JSON.parse(text);
    const rawSvg = params.get('includeSvg') === '1' ? await loadIconSvg(index, ord) : null;
    const [, fam = family, ...styleParts] = icon.collectionSlug.split('-');

    return NextResponse.json(
      {
        family: fam,
        style: styleParts.join('-') || style,
        slug: icon.slug,
        states: extractLordiconMotionStates(lottie),
        lottie,
        ...(rawSvg ? { rawSvg } : {}),
      },
      { headers: cacheHeaders(index, 86400, 604800) }
    );
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
