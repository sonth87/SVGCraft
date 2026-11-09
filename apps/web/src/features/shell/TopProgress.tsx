'use client';

/** Thin bar under the top edge while a page loads: trickles towards 90% and completes when the route changes. */
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { progressDone, useSearch } from '../shared/nav';

export default function TopProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const state = useRef({ pending: 0, value: 0, trickle: 0, hide: 0, safety: 0 });

  useEffect(() => {
    const s = state.current;
    const render = () => {
      if (fill.current) fill.current.style.transform = `scaleX(${s.value})`;
    };
    const start = () => {
      s.pending += 1;
      window.clearTimeout(s.safety);
      s.safety = window.setTimeout(done, 10000);
      if (s.pending > 1) return;
      window.clearTimeout(s.hide);
      window.clearInterval(s.trickle);
      bar.current?.classList.remove('is-done');
      bar.current?.classList.add('is-active');
      s.value = 0.08;
      render();
      s.trickle = window.setInterval(() => {
        s.value += (0.9 - s.value) * 0.08;
        render();
      }, 200);
    };
    function done() {
      if (s.pending === 0) return;
      s.pending = 0;
      window.clearTimeout(s.safety);
      window.clearInterval(s.trickle);
      s.value = 1;
      render();
      bar.current?.classList.add('is-done');
      s.hide = window.setTimeout(() => {
        bar.current?.classList.remove('is-active', 'is-done');
        s.value = 0;
        render();
      }, 350);
    }
    window.addEventListener('svgcraft:progress-start', start);
    window.addEventListener('svgcraft:progress-done', done);
    return () => {
      window.removeEventListener('svgcraft:progress-start', start);
      window.removeEventListener('svgcraft:progress-done', done);
      window.clearInterval(s.trickle);
      window.clearTimeout(s.hide);
      window.clearTimeout(s.safety);
    };
  }, []);

  // The page changed: finish
  const pathname = usePathname();
  const search = useSearch();
  useEffect(() => {
    progressDone();
  }, [pathname, search]);

  return (
    <div ref={bar} className="top-progress-bar" aria-hidden="true">
      <div ref={fill} className="top-progress-fill" />
    </div>
  );
}
