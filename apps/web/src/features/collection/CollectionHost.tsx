'use client';

/**
 * React island for `#collectionView`, same pattern as the detail page: server-rendered on `/collection/*`, and opened
 * in place by the legacy page script through `window.svgcraftCollection`. It stays mounted (hidden) while an icon is
 * open, so going back keeps the loaded pages and the filters.
 */
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { CollectionPayload } from '@/lib/collectionPage';
import type { CollectionFilters } from './CollectionView';

const CollectionView = dynamic(() => import('./CollectionView'));

type View = { data: CollectionPayload; filters: CollectionFilters | null; nonce: number } | null;

let setView: ((view: View) => void) | null = null;
let pending: View | undefined;
let nonce = 0;

function show(view: View) {
  if (setView) setView(view);
  else pending = view;
}

declare global {
  interface Window {
    svgcraftCollection?: { open(data: CollectionPayload, filters: CollectionFilters): void; close(): void };
  }
}

if (typeof window !== 'undefined') {
  window.svgcraftCollection = {
    open: (data, filters) => show({ data, filters, nonce: ++nonce }),
    close: () => show(null),
  };
}

export default function CollectionHost({ initial }: { initial?: CollectionPayload | null }) {
  const [view, setLocalView] = useState<View>(initial ? { data: initial, filters: null, nonce: 0 } : null);

  useEffect(() => {
    setView = setLocalView;
    if (pending !== undefined) {
      setLocalView(pending);
      pending = undefined;
    }
    return () => {
      setView = null;
    };
  }, []);

  if (!view) return null;
  return <CollectionView key={`${view.data.collection.slug}:${view.nonce}`} data={view.data} filters={view.filters} />;
}
