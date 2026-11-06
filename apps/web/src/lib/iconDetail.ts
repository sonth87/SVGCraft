/** Data of the icon detail page: one source for the SSR page and `/api/catalog/icon/*`. */
import { parseSvgMetadata } from '@svg-hub/shared';
import { normalizeSvgForInlineAndExport, sanitizeSvg } from '@svg-hub/svg-tools';
import type { CatalogIndex } from '@svg-hub/catalog';
import { loadIconSvg } from '@/lib/storage';

export async function loadIconDetail(index: CatalogIndex, ord: number) {
  const icon = index.iconDetail(ord);
  // Inline SVG for the studio (all variants in parallel); the grid loads files from the CDN instead
  const svgVariantsContent: Record<string, string> = {};
  await Promise.all(
    Object.keys(icon.variants).map(async (variant) => {
      const svg = await loadIconSvg(index, ord, variant);
      if (svg) svgVariantsContent[variant] = sanitizeSvg(normalizeSvgForInlineAndExport(svg));
    })
  );
  const rawSvg = svgVariantsContent.default ?? Object.values(svgVariantsContent)[0] ?? '';
  const meta = rawSvg ? parseSvgMetadata(rawSvg) : {};

  return {
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
  };
}

export type IconDetailPayload = Awaited<ReturnType<typeof loadIconDetail>>;
