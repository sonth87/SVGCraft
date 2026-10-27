import SvgCraftShell from '@/components/SvgCraftShell';
import { getStateManager } from '@/lib/catalogServer';

export async function generateMetadata({ params }) {
  try {
    // Clean 2-segment URL: /icon/<collection>/<idOrSlug>
    // Mapped to [site]/[collection] to share Next.js dynamic segment naming with /icon/[site]/[collection]/[idOrSlug]
    const collectionSlug = decodeURIComponent(params.site);
    const idOrSlug = decodeURIComponent(params.collection);
    const stateManager = getStateManager();
    const data = stateManager.getIconWithRecommendations('any', collectionSlug, idOrSlug);

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

export default function CleanIconDetailPage() {
  return <SvgCraftShell />;
}
