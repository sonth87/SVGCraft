import SvgCraftShell from '@/components/SvgCraftShell';
import { getStateManager } from '@/lib/catalogServer';

export async function generateMetadata({ params }) {
  try {
    const { site, collection, idOrSlug } = params;
    const stateManager = getStateManager();
    const data = stateManager.getIconWithRecommendations(
      decodeURIComponent(site),
      decodeURIComponent(collection),
      decodeURIComponent(idOrSlug)
    );

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

export default function IconDetailPage() {
  return <SvgCraftShell />;
}
