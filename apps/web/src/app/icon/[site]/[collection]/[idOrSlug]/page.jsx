import { notFound } from 'next/navigation';
import SvgCraftShell from '@/components/SvgCraftShell';
import { getCatalog } from '@/lib/catalog';
import { loadIconDetail } from '@/lib/iconDetail';

export async function generateMetadata({ params }) {
  try {
    const { site, collection, idOrSlug } = params;
    const index = getCatalog();
    const ord = index.findIcon(decodeURIComponent(site), decodeURIComponent(collection), decodeURIComponent(idOrSlug));
    const data = ord >= 0 ? { icon: index.item(ord) } : null;

    if (data && data.icon) {
      const title = `${data.icon.title || data.icon.slug} SVG Icon (${data.icon.collectionName})`;
      const description = `Tải xuống và tùy chỉnh ${data.icon.title || data.icon.slug} SVG Vector (${data.icon.styleType}, ${data.icon.gridSize || '24x24'}) từ bộ sưu tập ${data.icon.collectionName}. Xuất nhanh mã React JSX, Vue, HTML, Data URI & PNG.`;
      return {
        title,
        description,
        openGraph: {
          title: `${title} — SVGCraft`,
          description,
          images: data.icon.assetUrl ? [data.icon.assetUrl] : [],
        },
      };
    }
  } catch {
    // Fallback to default metadata
  }

  return {
    title: 'Chi tiết Vector Icon',
  };
}

// Rendered on first request, then served from the CDN until the next deploy or the daily refresh
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

export default async function IconDetailPage({ params }) {
  const index = getCatalog();
  const ord = index.findIcon(decodeURIComponent(params.site), decodeURIComponent(params.collection), decodeURIComponent(params.idOrSlug));
  if (ord < 0) notFound();
  return <SvgCraftShell initialDetail={await loadIconDetail(index, ord)} />;
}
