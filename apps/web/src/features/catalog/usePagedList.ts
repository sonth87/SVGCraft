'use client';

/**
 * A list that loads by cursor, keyed by what it shows. Finished pages stay in memory, so coming back from an icon
 * page shows the same list instantly (with every page that was loaded) instead of starting over.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export interface PageLike<T> {
  items: T[];
  total: number;
  offset: number;
  nextCursor: string | null;
}

interface ListState<T> {
  key: string;
  /** Lists in the same group look alike (same card type), so the old one can stay on screen while the next loads */
  group: string;
  items: T[];
  total: number;
  nextCursor: string | null;
  failed: boolean;
}

const MAX_CACHED_LISTS = 24;
const cache = new Map<string, ListState<unknown>>();

export function clearListCache(): void {
  cache.clear();
}

function remember<T>(state: ListState<T>): void {
  if (cache.has(state.key)) cache.delete(state.key);
  cache.set(state.key, state as ListState<unknown>);
  if (cache.size > MAX_CACHED_LISTS) cache.delete(cache.keys().next().value as string);
}

const fromPage = <T>(key: string, group: string, page: PageLike<T>): ListState<T> => ({
  key,
  group,
  items: page.items,
  total: page.total,
  nextCursor: page.nextCursor,
  failed: false,
});

export function usePagedList<T>({
  key,
  group,
  initial,
  cacheable = true,
  load,
}: {
  key: string;
  group: string;
  /** Server-rendered first page for `initial.key` */
  initial?: { key: string; page: PageLike<T> };
  cacheable?: boolean;
  load(cursor: string | null, signal: AbortSignal, bypassCache: boolean): Promise<PageLike<T>>;
}) {
  const loadRef = useRef(load);
  loadRef.current = load;

  const [state, setState] = useState<ListState<T>>(() => {
    const cached = cacheable ? (cache.get(key) as ListState<T> | undefined) : undefined;
    if (cached) return cached;
    if (initial && initial.key === key) return fromPage(key, group, initial.page);
    return { key: '', group, items: [], total: 0, nextCursor: null, failed: false };
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [nonce, setNonce] = useState(0);
  const forceFetch = useRef(false);
  const busy = useRef(false);

  // New key: use what we have, otherwise fetch the first page. A reload fetches again, keeping the old list meanwhile.
  useEffect(() => {
    const bypass = forceFetch.current;
    if (!bypass) {
      if (state.key === key) {
        if (cacheable) remember(state);
        return;
      }
      const cached = cacheable ? (cache.get(key) as ListState<T> | undefined) : undefined;
      if (cached) {
        setState(cached);
        return;
      }
    }
    forceFetch.current = false;
    const ctrl = new AbortController();
    loadRef
      .current(null, ctrl.signal, bypass)
      .then((page) => {
        const next = fromPage(key, group, page);
        if (cacheable) remember(next);
        setState(next);
      })
      .catch((err: unknown) => {
        if ((err as Error)?.name === 'AbortError' || ctrl.signal.aborted) return;
        setState({ key, group, items: [], total: 0, nextCursor: null, failed: true });
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs when the key (or a reload) changes
  }, [key, nonce]);

  const loadMore = useCallback(async () => {
    if (busy.current || state.key !== key || !state.nextCursor) return;
    busy.current = true;
    setLoadingMore(true);
    try {
      const page = await loadRef.current(state.nextCursor, new AbortController().signal, false);
      setState((s) => {
        if (s.key !== key) return s;
        // A deploy between pages invalidates the cursor and the server restarts at 0: replace instead of repeating
        const next: ListState<T> = {
          key,
          group,
          items: page.offset === 0 ? page.items : [...s.items, ...page.items],
          total: page.total,
          nextCursor: page.nextCursor,
          failed: false,
        };
        if (cacheable) remember(next);
        return next;
      });
    } catch {
      /* the button stays; try again */
    } finally {
      busy.current = false;
      setLoadingMore(false);
    }
  }, [key, group, state, cacheable]);

  const reload = useCallback(() => {
    cache.delete(key);
    forceFetch.current = true;
    setNonce((n) => n + 1);
  }, [key]);

  const ready = state.key === key;
  // While the next list loads, the previous one of the same kind stays visible (no blank flash, no scroll jump)
  const visible = ready || state.group === group;
  return {
    items: visible ? state.items : [],
    total: visible ? state.total : 0,
    hasMore: ready && state.nextCursor !== null,
    loading: !ready,
    failed: ready && state.failed,
    loadingMore,
    loadMore,
    reload,
  };
}
