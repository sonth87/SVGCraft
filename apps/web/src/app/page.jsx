import CatalogPage from '@/features/catalog/CatalogPage';
import { getCatalog } from '@/lib/catalog';

// First page of the unfiltered catalog, rendered once and served from the CDN. Filters in the URL load on the client
export const revalidate = 86400;

export default function HomePage() {
  const first = getCatalog().queryIcons({ limit: 72, sort: 'recent' });
  return <CatalogPage initial={first} />;
}
