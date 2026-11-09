'use client';

/**
 * Navigation helpers shared by every page: the URL as a store (so filters can change without a server round trip),
 * scroll memory for back/forward, the list the detail page walks with prev/next, and the top progress bar signals.
 */
import { useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import type { IconListItem } from '@svg-hub/catalog';

// --- URL as a store ---------------------------------------------------------------

const URL_EVENT = 'svgcraft:url';

function subscribeUrl(cb: () => void): () => void {
  window.addEventListener('popstate', cb);
  window.addEventListener(URL_EVENT, cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener(URL_EVENT, cb);
  };
}

/** `location.search`, empty during server render and hydration. */
export function useSearch(): string {
  return useSyncExternalStore(
    subscribeUrl,
    () => window.location.search,
    () => ''
  );
}

let internalDepth = 0;
let poppedAt = 0;
/** `internalDepth` when the user left a list page (catalog / collection) for an icon page */
let listExitDepth = -1;
let skipPop = false;

const isListPath = (path: string): boolean => path === '/' || path.startsWith('/collection/');

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
  window.addEventListener('popstate', () => {
    poppedAt = Date.now();
    if (skipPop) skipPop = false;
    else if (internalDepth > 0) internalDepth -= 1;
  });
}

/** Change the URL without navigating (filters). Next.js keeps its router in step with `history`. */
export function writeUrl(url: string, replace = false): void {
  if (url === `${window.location.pathname}${window.location.search}`) return;
  if (replace) window.history.replaceState(null, '', url);
  else {
    rememberScroll();
    internalDepth += 1;
    window.history.pushState(null, '', url);
  }
  window.dispatchEvent(new Event(URL_EVENT));
}

// --- Scroll memory ----------------------------------------------------------------

const scrollMemory = new Map<string, number>();

export function rememberScroll(): void {
  scrollMemory.set(`${window.location.pathname}${window.location.search}`, window.scrollY);
}

/** Scroll position to restore, only right after a back/forward navigation. */
export function savedScroll(urlKey: string): number | undefined {
  return Date.now() - poppedAt < 2500 ? scrollMemory.get(urlKey) : undefined;
}

export function restoreScroll(y: number): void {
  const apply = () => window.scrollTo(0, y);
  apply();
  // Next.js scrolls to the top while it swaps the page: put it back after that
  requestAnimationFrame(apply);
  setTimeout(apply, 80);
  setTimeout(apply, 250);
}

// --- Lists the detail page walks ---------------------------------------------------

let navList: IconListItem[] = [];
export const setNavList = (items: IconListItem[]): void => {
  navList = items;
};
export const getNavList = (): IconListItem[] => navList;

let lastCatalogSearch = '';
export const setLastCatalogSearch = (search: string): void => {
  lastCatalogSearch = search;
};
export const catalogReturnHref = (): string => `/${lastCatalogSearch}`;

// --- Progress bar signals ----------------------------------------------------------

export const progressStart = (): void => void window.dispatchEvent(new Event('svgcraft:progress-start'));
export const progressDone = (): void => void window.dispatchEvent(new Event('svgcraft:progress-done'));

/** Called for in-app link clicks (before Next.js handles them). */
export function noteLinkNavigation(): void {
  rememberScroll();
  if (isListPath(window.location.pathname)) listExitDepth = internalDepth;
  internalDepth += 1;
  progressStart();
}

// --- Router wrapper ----------------------------------------------------------------

export function useAppRouter() {
  const router = useRouter();
  return useMemo(
    () => ({
      push(href: string, options?: { scroll?: boolean }) {
        noteLinkNavigation();
        router.push(href, options);
      },
      /**
       * Back to the list (catalog or collection) the user opened an icon from, however many icons they stepped
       * through since. Without such a list (icon page opened directly): go to `fallback`.
       */
      backToList(fallback: string) {
        if (listExitDepth >= 0 && internalDepth > listExitDepth) {
          const steps = internalDepth - listExitDepth;
          internalDepth = listExitDepth;
          skipPop = true;
          rememberScroll();
          progressStart();
          window.history.go(-steps);
        } else {
          progressStart();
          router.push(fallback);
        }
      },
      /** History back when the user came from inside the app, otherwise go to `fallback`. */
      back(fallback: string) {
        if (internalDepth > 0) {
          rememberScroll();
          progressStart();
          router.back();
        } else {
          progressStart();
          router.push(fallback);
        }
      },
      prefetch: (href: string) => router.prefetch(href),
    }),
    [router]
  );
}
