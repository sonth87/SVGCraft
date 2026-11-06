/**
 * Compile a Lottie motion state into one standalone animated SVG: sample frames with lottie-web in an offscreen
 * container, keep each as a group and flip their visibility with CSS keyframes. Needs a DOM.
 */
import { applyCustomizationsToLottieJson, applyCustomizationsToSvgXml, toSvgColor } from '@svg-hub/svg-tools';
import type { ColorMap, MotionState, StrokeMode } from '@svg-hub/svg-tools';
import { loadLottie } from './lottie';

export interface CompileOptions {
  exportMode: 'loop' | 'hover';
  /** Hover mode: play a single run per hover instead of repeating */
  hoverPlayOnce: boolean;
  colorMap: ColorMap;
  strokeMode: StrokeMode;
  bgTransparent: boolean;
  bgColor: string;
  frameSamples?: number;
}

interface LottieDims {
  w?: number;
  h?: number;
  fr?: number;
  ip?: number;
  op?: number;
}

/** Strip what lottie-web leaves behind for other states, so each sampled frame carries only what it shows. */
function cleanFrame(svgEl: SVGSVGElement): string {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll('[style*="display: none"], [style*="display:none"], [opacity="0"]').forEach((el) => {
    if (!el.closest('defs')) el.remove();
  });

  const defs = clone.querySelector('defs');
  if (defs) {
    const body = Array.from(clone.children)
      .filter((ch) => ch.tagName.toLowerCase() !== 'defs')
      .map((ch) => ch.outerHTML)
      .join('');
    const used = new Set<string>();
    const collect = (str: string) => {
      for (const m of str.matchAll(/url\(#([^)]+)\)|(?:xlink:href|href)=["']#([^"']+)["']/g)) {
        const id = m[1] || m[2];
        if (id) used.add(id);
      }
    };
    collect(body);
    let added = true;
    while (added) {
      added = false;
      for (const child of Array.from(defs.children)) {
        const id = child.getAttribute('id');
        if (id && used.has(id)) {
          const before = used.size;
          collect(child.outerHTML);
          if (used.size > before) added = true;
        }
      }
    }
    for (const child of Array.from(defs.children)) {
      const id = child.getAttribute('id');
      if (!id || !used.has(id)) child.remove();
    }
    if (defs.children.length === 0) defs.remove();
  }

  let removed = true;
  while (removed) {
    removed = false;
    clone.querySelectorAll('g').forEach((g) => {
      if (!g.closest('defs') && g.children.length === 0 && !g.textContent?.trim()) {
        g.remove();
        removed = true;
      }
    });
  }

  return clone.innerHTML
    .replace(/\sstyle=["']display:\s*block;?["']/gi, '')
    .replace(/\stransform=["']matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)["']/gi, '')
    .replace(/\s(?:opacity|fill-opacity|stroke-opacity)=["']1["']/gi, '')
    .replace(/(\d+\.\d{2,})/g, (n) => String(Number(parseFloat(n).toFixed(1))));
}

function frameKeyframes(idx: number, startPct: number, endPct: number): string {
  const endHold = Math.max(startPct, Number((endPct - 0.01).toFixed(2)));
  const pre = Math.max(0, Number((startPct - 0.01).toFixed(2)));
  if (startPct === 0 && endPct >= 100) return `@keyframes li-k-${idx}{0%,100%{opacity:1}}`;
  if (startPct === 0) return `@keyframes li-k-${idx}{0%,${endHold}%{opacity:1}${endPct}%,100%{opacity:0}}`;
  if (endPct >= 100) return `@keyframes li-k-${idx}{0%,${pre}%{opacity:0}${startPct}%,100%{opacity:1}}`;
  return `@keyframes li-k-${idx}{0%,${pre}%{opacity:0}${startPct}%,${endHold}%{opacity:1}${endPct}%,100%{opacity:0}}`;
}

export async function compileAnimatedSvg(
  lottieData: unknown,
  state: MotionState | undefined,
  { exportMode, hoverPlayOnce, colorMap, strokeMode, bgTransparent, bgColor, frameSamples = 14 }: CompileOptions
): Promise<string> {
  const lottie = await loadLottie();
  const customized = applyCustomizationsToLottieJson(lottieData, { colorMap, strokeMode }) as LottieDims;

  const w = Number(customized.w) || 430;
  const h = Number(customized.h) || 430;
  const fps = Number(customized.fr) || 60;
  const startF = state ? state.startFrame : Number(customized.ip) || 0;
  const endF = state ? state.endFrame : Number(customized.op) || 60;
  const span = Math.max(1, endF - startF);
  const durationSec = Math.max(0.45, Number((span / fps).toFixed(2)));
  const count = Math.max(8, Math.min(20, frameSamples));

  const offscreen = document.createElement('div');
  offscreen.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${w}px;height:${h}px;visibility:hidden;pointer-events:none;`;
  document.body.appendChild(offscreen);

  try {
    const anim = lottie.loadAnimation({
      container: offscreen,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: customized,
    });

    const frames: { inner: string; signature: string; slots: number }[] = [];
    for (let k = 0; k < count; k++) {
      anim.goToAndStop(Math.round(startF + (k / (count - 1)) * span), true);
      const svgEl = offscreen.querySelector('svg');
      if (!svgEl) continue;
      const inner = applyCustomizationsToSvgXml(`<svg viewBox="0 0 ${w} ${h}">${cleanFrame(svgEl)}</svg>`, {
        colorMap,
        strokeMode: 'regular',
        bgTransparent: true,
      })
        .replace(/^<svg[^>]*>/i, '')
        .replace(/<\/svg>$/i, '');
      // Consecutive identical frames (ignoring generated ids) become one longer frame
      const signature = inner.replace(/\bid=["'][^"']+["']/g, '').replace(/url\(#[^)]+\)/g, '');
      const last = frames[frames.length - 1];
      if (last && last.signature === signature) last.slots += 1;
      else frames.push({ inner, signature, slots: 1 });
    }
    anim.destroy();

    const totalSlots = frames.reduce((n, f) => n + f.slots, 0) || 1;
    let cursor = 0;
    const groups: string[] = [];
    const css: string[] = [];
    frames.forEach((f, idx) => {
      const prefix = `f${idx}_`;
      const scoped = f.inner
        .replace(/\bid=["']([^"']+)["']/g, `id="${prefix}$1"`)
        .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
        .replace(/\b(xlink:href|href)=["']#([^"']+)["']/g, `$1="#${prefix}$2"`);
      groups.push(`<g class="li-f li-f-${idx}">${scoped}</g>`);

      const startPct = Number(((cursor / totalSlots) * 100).toFixed(2));
      cursor += f.slots;
      const endPct = Number(((cursor / totalSlots) * 100).toFixed(2));
      const trigger =
        exportMode === 'hover'
          ? `svg:hover .li-f-${idx}{opacity:0;animation:li-k-${idx} ${durationSec}s steps(1,end) ${hoverPlayOnce ? '1 forwards' : 'infinite'}}`
          : `.li-f-${idx}{animation:li-k-${idx} ${durationSec}s steps(1,end) infinite}`;
      css.push(`${frameKeyframes(idx, startPct, endPct)}${trigger}`);
    });

    const base = exportMode === 'hover' ? '.li-f{opacity:0}.li-f-0{opacity:1}' : '.li-f{opacity:0}';
    const bgRect =
      !bgTransparent && bgColor
        ? `<rect class="svgcraft-bg" x="0" y="0" width="${w}" height="${h}" fill="${toSvgColor(bgColor)}"/>`
        : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><style>${base}${css.join('')}</style>${bgRect}${groups.join('')}</svg>`;
  } finally {
    offscreen.remove();
  }
}
