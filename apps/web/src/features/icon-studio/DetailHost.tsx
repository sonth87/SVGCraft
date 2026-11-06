'use client';

/**
 * React island for `#detailView`. Renders the server-provided icon on `/icon/*` pages and any icon the legacy
 * page script opens in place via `window.svgcraftDetail`, so the catalog grid and its scroll position survive.
 */
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { IconDetailPayload } from '@/lib/iconDetail';
import { loadLottie } from './lottie';
import type { DetailNav } from './IconStudio';

const IconStudio = dynamic(() => import('./IconStudio'));

type DetailView = { data: IconDetailPayload; nav: DetailNav } | null;

let setView: ((view: DetailView) => void) | null = null;
let pending: DetailView | undefined;

function show(view: DetailView) {
  if (setView) setView(view);
  else pending = view;
}

declare global {
  interface Window {
    svgcraftDetail?: { open(data: IconDetailPayload, nav?: DetailNav): void; close(): void };
    svgcraftLoadLottie?: typeof loadLottie;
  }
}

// Set while the bundle evaluates, so it is ready before app.js runs
if (typeof window !== 'undefined') {
  window.svgcraftDetail = { open: (data, nav = {}) => show({ data, nav }), close: () => show(null) };
  window.svgcraftLoadLottie = loadLottie;
}

export default function DetailHost({ initial }: { initial?: IconDetailPayload | null }) {
  const [view, setLocalView] = useState<DetailView>(initial ? { data: initial, nav: {} } : null);

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
  const { icon } = view.data;
  return <IconStudio key={`${icon.collectionSlug}:${icon.id}`} data={view.data} nav={view.nav} />;
}
