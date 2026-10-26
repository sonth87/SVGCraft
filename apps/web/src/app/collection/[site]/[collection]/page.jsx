import SvgCraftShell from '@/components/SvgCraftShell';
import { getStateManager } from '@/lib/catalogServer';

export async function generateMetadata({ params }) {
  try {
    const { site, collection } = params;
    const stateManager = getStateManager();
    const data = stateManager.getCollectionDetails(
      decodeURIComponent(site),
      decodeURIComponent(collection),
      { limit: 1 }
    );

    if (data && data.collection) {
      const col = data.collection;
      const title = `Bộ sưu tập ${col.name} (${col.totalIconsInCollection || data.total} SVG Icons)`;
      const description = `Khám phá bộ sưu tập ${col.name} gồm ${col.totalIconsInCollection || data.total} vector icons chuẩn hóa trên SVGCraft. Hỗ trợ xuất SVG, React JSX, Vue và PNG.`;
      return {
        title,
        description,
        openGraph: {
          title: `${title} — SVGCraft`,
          description,
        },
      };
    }
  } catch {
    // Fallback to default metadata
  }

  return {
    title: 'Bộ sưu tập Vector Icons',
  };
}

export default function CollectionDetailPage() {
  return <SvgCraftShell />;
}
