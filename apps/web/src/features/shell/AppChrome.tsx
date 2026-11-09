'use client';

/** The frame around every page: topbar, sidebar, toasts, brand glow, progress bar and global shortcuts. Persists across navigation. */
import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SummaryProvider, type SummaryData } from '../shared/summary';
import { catalogReturnHref, noteLinkNavigation, useAppRouter } from '../shared/nav';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import TopProgress from './TopProgress';

const PAGE_LINK = /^\/(icon|collection)\//;

function Frame({ children }: { children: ReactNode }) {
  const router = useAppRouter();
  const pathname = usePathname();

  // Progress bar + scroll memory for every in-app link, before Next.js handles the click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (url.pathname === '/' || PAGE_LINK.test(url.pathname)) noteLinkNavigation();
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Escape leaves a collection or icon page for the catalog (popovers close first and stop the event)
  useEffect(() => {
    if (pathname === '/') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      router.push(catalogReturnHref());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, router]);

  return (
    <>
      <div id="brandGlowBackdrop" className="brand-glow-backdrop" aria-hidden="true">
        <div id="brandGlowOrb" className="brand-glow-orb" />
      </div>
      <TopProgress />
      <Topbar />
      <div className="app-shell">
        <Sidebar />
        <main className="main-area">{children}</main>
      </div>
      <div className="toast-container" id="toastContainer" role="status" aria-live="polite" />
    </>
  );
}

export default function AppChrome({ summary, children }: { summary: SummaryData; children: ReactNode }) {
  return (
    <SummaryProvider initial={summary}>
      <Frame>{children}</Frame>
    </SummaryProvider>
  );
}
