import { NextResponse } from 'next/server';
import { parseSvgMetadata } from '@svg-hub/shared';
import { normalizeSvgForInlineAndExport } from '@svg-hub/svg-tools';
import { cacheHeaders, getCatalog } from '@/lib/catalog';
import { loadIconSvg } from '@/lib/storage';

export const dynamic = 'force-dynamic';

type Params = { site: string; collection: string; idOrSlug: string };

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const index = getCatalog();
    const ord = index.findIcon(params.site, params.collection, params.idOrSlug);
    if (ord < 0) return NextResponse.json({ error: 'Không tìm thấy icon.' }, { status: 404 });

    const icon = index.iconDetail(ord);
    // Inline SVG for the studio (all variants in parallel); the grid loads straight from the CDN instead
    const svgVariantsContent: Record<string, string> = {};
    await Promise.all(
      Object.keys(icon.variants).map(async (variant) => {
        const svg = await loadIconSvg(index, ord, variant);
        if (svg) svgVariantsContent[variant] = normalizeSvgForInlineAndExport(svg);
      })
    );
    const rawSvg = svgVariantsContent.default ?? Object.values(svgVariantsContent)[0] ?? '';
    const meta = rawSvg ? parseSvgMetadata(rawSvg) : {};

    return NextResponse.json(
      {
        icon: {
          ...icon,
          width: meta.width,
          height: meta.height,
          viewBox: meta.viewBox || '0 0 24 24',
          gridSize: icon.gridSize || meta.gridSize || '24x24',
          fileSizeBytes: meta.fileSizeBytes,
          colorPalette: meta.colorPalette ?? [],
        },
        rawSvg,
        svgVariantsContent,
        variantAssetUrls: icon.variantAssetUrls,
        lordiconStyles: index.lordiconStyles(ord),
        recommendations: index.related(ord, 12),
      },
      { headers: cacheHeaders(index, 86400, 604800) }
    );
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
