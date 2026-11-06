// Development only: serves crawled SVGs from local output/. Production URLs are /cdn/svg/{hash}.svg
// (or the R2_PUBLIC_URL domain); the pre-hash R2 keys this route used to read are gone.
import path from 'path';
import { NextResponse } from 'next/server';
import { OUTPUT_DIR } from '@/lib/storage';

function getCandidateFilesForSite(safeFile, siteId) {
  const m = safeFile.match(/^([a-zA-Z0-9-_]+?)(\.[a-zA-Z0-9-_]+)?\.svg$/);
  if (!m) return [safeFile];

  const [, baseSlug, variantSuffix = ''] = m;
  const doubled = `${baseSlug}-${baseSlug}${variantSuffix}.svg`;

  if (siteId === 'thesvg' || siteId === 'allsvgicons') {
    return doubled !== safeFile ? [doubled, safeFile] : [safeFile];
  }
  return doubled !== safeFile ? [safeFile, doubled] : [safeFile];
}

export async function GET(request, { params }) {
  try {
    const { collection, fileName } = params;
    const safeCol = String(collection).replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeFile = path.basename(String(fileName));

    const runtimeFs = eval('require')('fs');
    const ALL_SITES = ['lordicon', 'allsvgicons', 'thesvg', 'svgrepo'];

    // Fast path: determine site directly by prefix or fast local folder check without scanning 240k+ catalog icons
    let sitesToTry = ALL_SITES;
    if (safeCol.startsWith('lordicon-')) {
      sitesToTry = ['lordicon'];
    } else {
      for (const sId of ALL_SITES) {
        if (runtimeFs.existsSync(path.join(OUTPUT_DIR, sId, safeCol))) {
          sitesToTry = [sId];
          break;
        }
      }
    }

    // 1. Serve from local disk if present (Local Dev Mode)
    for (const siteId of sitesToTry) {
      const candidates = getCandidateFilesForSite(safeFile, siteId);
      for (const candidate of candidates) {
        const localFilePath = path.join(OUTPUT_DIR, siteId, safeCol, 'icons', candidate);
        if (runtimeFs.existsSync(localFilePath)) {
          const svgContent = runtimeFs.readFileSync(localFilePath, 'utf8');
          return new NextResponse(svgContent, {
            status: 200,
            headers: {
              'Content-Type': 'image/svg+xml; charset=utf-8',
              'Cache-Control': 'public, s-maxage=31536000, max-age=31536000, immutable',
            },
          });
        }
      }
    }

    return new NextResponse('SVG not found', { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
