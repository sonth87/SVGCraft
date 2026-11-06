import { notFound } from 'next/navigation';
import SvgCraftShell from '@/components/SvgCraftShell';
import { getCatalog } from '@/lib/catalog';
import { loadCollectionPage } from '@/lib/collectionPage';

export async function generateMetadata({ params }) {
  try {
    const { site, collection } = params;
    const data = getCatalog().collectionDetails(decodeURIComponent(site), decodeURIComponent(collection), { limit: 1 });

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

// First page without filters, rendered on first request and then served from the CDN. Filters in the URL load on the client
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

export default function CollectionPage({ params }) {
  const data = loadCollectionPage(getCatalog(), decodeURIComponent(params.site), decodeURIComponent(params.collection));
  if (!data) notFound();
  return <SvgCraftShell initialCollection={data} />;
}
