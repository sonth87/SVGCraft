import { NextResponse } from 'next/server';
import { getStateManager, getR2Client, parseSvgMetadata } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { site, collection, idOrSlug } = params;
    const stateManager = getStateManager();
    const r2Client = getR2Client();

    const data = stateManager.getIconWithRecommendations(site, collection, idOrSlug);
    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy icon.' }, { status: 404 });
    }

    // Fetch raw SVG XML from Cloudflare R2 on demand when running on Vercel without local output/ directory
    if (!data.rawSvg && data.icon) {
      const resolvedSite = data.icon.site || site;
      const variants = data.icon.variants || { default: data.icon.relativePath };
      for (const [varName, relPath] of Object.entries(variants)) {
        const key = `${resolvedSite}/${collection}/${relPath}`;
        const fetched = await r2Client.getSvgObject(key).catch(() => null);
        if (fetched && fetched.includes('<svg')) {
          data.svgVariantsContent[varName] = fetched;
        }
      }
      data.rawSvg = data.svgVariantsContent.default || Object.values(data.svgVariantsContent)[0] || '';
      if (data.rawSvg) {
        const parsedMeta = parseSvgMetadata(data.rawSvg);
        data.icon.width = data.icon.width || parsedMeta.width;
        data.icon.height = data.icon.height || parsedMeta.height;
        data.icon.viewBox = data.icon.viewBox || parsedMeta.viewBox || '0 0 24 24';
        data.icon.gridSize = data.icon.gridSize || parsedMeta.gridSize || '24x24';
        data.icon.fileSizeBytes = data.icon.fileSizeBytes || parsedMeta.fileSizeBytes;
        if (!data.icon.colorPalette || data.icon.colorPalette.length === 0) {
          data.icon.colorPalette = parsedMeta.colorPalette || [];
        }
      }
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
