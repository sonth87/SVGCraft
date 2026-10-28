import path from 'path';
import { NextResponse } from 'next/server';
import { getStateManager, getR2Client, OUTPUT_DIR } from '@/lib/catalogServer';

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

    const stateManager = getStateManager();
    const resolvedSite = stateManager.resolveCollectionSite(safeCol);
    const sitesToTry = resolvedSite ? [resolvedSite] : ['allsvgicons', 'thesvg', 'svgrepo'];

    // 1. Serve from local disk if present (Local Dev Mode)
    const runtimeFs = eval('require')('fs');
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

    // 2. Serve from Cloudflare R2 (Vercel Production Mode)
    const r2Client = getR2Client();

    for (const siteId of sitesToTry) {
      const candidates = getCandidateFilesForSite(safeFile, siteId);
      for (const candidate of candidates) {
        const objectKey = `${siteId}/${safeCol}/icons/${candidate}`;
        const r2Svg = await r2Client.getSvgObject(objectKey);
        if (r2Svg) {
          return new NextResponse(r2Svg, {
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
