import { notFound } from 'next/navigation';
import CollectionView from '@/features/collection/CollectionView';
import { getCatalog } from '@/lib/catalog';
import { loadCollectionPage } from '@/lib/collectionPage';

// Clean 1-segment URL: /collection/<slug>. Same page as /collection/<site>/<slug>
export async function generateMetadata({ params }) {
  const data = loadCollectionPage(getCatalog(), 'any', decodeURIComponent(params.site), { limit: 1 });
  if (!data) return { title: 'Bộ sưu tập Vector Icons' };
  const col = data.collection;
  const title = `Bộ sưu tập ${col.name} (${col.totalIconsInCollection || data.total} SVG Icons)`;
  const description = `Khám phá bộ sưu tập ${col.name} gồm ${col.totalIconsInCollection || data.total} vector icons chuẩn hóa trên SVGCraft. Hỗ trợ xuất SVG, React JSX, Vue và PNG.`;
  return { title, description, openGraph: { title: `${title} — SVGCraft`, description } };
}

// First page without filters, rendered on first request and then served from the CDN. Filters in the URL load on the client
export const revalidate = 86400;
export function generateStaticParams() {
  return [];
}

export default function CollectionPage({ params }) {
  const data = loadCollectionPage(getCatalog(), 'any', decodeURIComponent(params.site));
  if (!data) notFound();
  return <CollectionView key={data.collection.slug} data={data} />;
}
