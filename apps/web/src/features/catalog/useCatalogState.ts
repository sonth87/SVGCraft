'use client';

import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAppRouter, useSearch, writeUrl } from '../shared/nav';
import { catalogHref, parseCatalogSearch, type CatalogState } from './filters';

/** Filters and view mode come from the URL. `go` updates it in place on the catalog, or navigates to it from other pages. */
export function useCatalogState() {
  const pathname = usePathname();
  const search = useSearch();
  const router = useAppRouter();
  const onCatalog = pathname === '/';
  const state = useMemo(() => parseCatalogSearch(onCatalog ? search : ''), [onCatalog, search]);

  const go = useCallback(
    (next: CatalogState, options: { replace?: boolean } = {}) => {
      const href = catalogHref(next);
      if (window.location.pathname === '/') writeUrl(href, options.replace);
      else router.push(href);
    },
    [router]
  );

  return { state, go, onCatalog };
}
