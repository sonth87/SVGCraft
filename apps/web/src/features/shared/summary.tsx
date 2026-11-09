'use client';

/** Catalog taxonomy (categories, styles, types, counts) for the sidebar and filters. The 1,578 collection names load on demand. */
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { apiJson, clearApiCache } from './api';

export interface SummaryData {
  totalIcons: number;
  totalCollections: number;
  totalBrands: number;
  categories: { id: string; label: string; count: number; animatedCount: number; brandCount: number }[];
  lordiconCategories: { id: string; label: string; labelVi?: string; count: number }[];
  styles: { id: string; label: string; count: number }[];
  iconTypes: { id: string; label: string; count: number }[];
}

export interface CollectionRef {
  site: string;
  slug: string;
  name: string;
  count: number;
}

interface SummaryContextValue {
  summary: SummaryData;
  /** `null` until `ensureCollections` resolves */
  collections: CollectionRef[] | null;
  ensureCollections(): Promise<void>;
  reload(): Promise<void>;
}

const SummaryContext = createContext<SummaryContextValue | null>(null);

export function useSummary(): SummaryContextValue {
  const ctx = useContext(SummaryContext);
  if (!ctx) throw new Error('useSummary outside SummaryProvider');
  return ctx;
}

export function SummaryProvider({ initial, children }: { initial: SummaryData; children: ReactNode }) {
  const [summary, setSummary] = useState(initial);
  const [collections, setCollections] = useState<CollectionRef[] | null>(null);
  const loading = useRef<Promise<void> | null>(null);

  const load = useCallback((bypassCache: boolean) => {
    return apiJson<SummaryData & { collections?: CollectionRef[] }>('/api/catalog/summary?v=4', { bypassCache }).then(
      ({ collections: list, ...rest }) => {
        setSummary(rest);
        setCollections(list ?? []);
      }
    );
  }, []);

  const value = useMemo<SummaryContextValue>(
    () => ({
      summary,
      collections,
      ensureCollections() {
        loading.current ??= load(false).catch(() => {
          loading.current = null;
        });
        return loading.current;
      },
      async reload() {
        clearApiCache();
        loading.current = load(true);
        await loading.current;
      },
    }),
    [summary, collections, load]
  );

  return <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>;
}
