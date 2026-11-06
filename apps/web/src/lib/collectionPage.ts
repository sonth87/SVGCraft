/** Data of a collection page: one source for the SSR page and `/api/catalog/collection/*`. */
import type { CatalogIndex, CollectionIconsQuery } from '@svg-hub/catalog';

export function loadCollectionPage(index: CatalogIndex, site: string, slug: string, query: CollectionIconsQuery = {}) {
  const data = index.collectionDetails(site, slug, { limit: 72, sort: 'az', ...query });
  if (!data) return null;
  const isStylePack = data.collection.slug.startsWith('lordicon-') && !data.collection.slug.startsWith('lordicon-cat-');
  return { ...data, lordiconCategories: isStylePack ? index.summary().lordiconCategories : [] };
}

export type CollectionPayload = NonNullable<ReturnType<typeof loadCollectionPage>>;
