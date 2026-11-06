'use client';

/** Interactive canvas: tone, keyline grid, cursor-anchored zoom, bounded pan, static SVG or live Lottie. */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { applyCustomizationsToLottieJson, formatBytes } from '@svg-hub/svg-tools';
import type { ColorMap, MotionState, StrokeMode } from '@svg-hub/svg-tools';
import { Icon } from '@/features/shared/icons';
import { loadLottie, type AnimationItem } from './lottie';
import type { Translate } from '@/features/shared/bridge';

export type SvgMode = 'static' | 'hover' | 'loop';
const TONES = ['checker', 'dark', 'light', 'auto'] as const;
type Tone = (typeof TONES)[number];

const BASE_SIZE = 180;
const MIN_SCALE = 0.35;
const MAX_SCALE = 4;

interface StageProps {
  t: Translate;
  staticSvg: string;
  byteSize: number;
  viewBox: string;
  isLordicon: boolean;
  lottieData: unknown;
  colorMap: ColorMap;
  strokeMode: StrokeMode;
  bgTransparent: boolean;
  bgColor: string;
  mode: SvgMode;
  motion: MotionState | undefined;
  /** Bumped when a motion state is clicked: in hover mode, preview it once */
  previewNonce: number;
  hoverOnce: boolean;
  onHoverOnceChange(once: boolean): void;
}

const MOUNT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const toneIcon: Record<Exclude<Tone, 'auto'>, string> = { checker: 'checkerboard', dark: 'moon', light: 'sun' };
const toneTitle = {
  checker: 'stageToneChecker',
  dark: 'stageToneDark',
  light: 'stageToneLight',
  auto: 'stageToneAuto',
} as const;

type OnceAnim = AnimationItem & { __playingOnce?: boolean };

export default function Stage(props: StageProps) {
  const { t, staticSvg, byteSize, viewBox, isLordicon, lottieData, colorMap, strokeMode } = props;
  const { bgTransparent, bgColor, mode, motion, previewNonce, hoverOnce, onHoverOnceChange } = props;

  const canvasRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<OnceAnim | null>(null);
  // Server markup shows the icon until the effect below takes over the (React-free) mount node
  const [ssrSvg, setSsrSvg] = useState<string | null>(staticSvg);
  const [tone, setTone] = useState<Tone>('checker');
  const [keyline, setKeyline] = useState(false);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });

  // Follow the topbar's preview tone ('auto' as a starting point shows the checkerboard)
  useEffect(() => {
    const isTone = (v: string | undefined): v is Tone => (TONES as readonly string[]).includes(v ?? '');
    const initial = document.body.dataset.previewTone;
    if (isTone(initial) && initial !== 'auto') setTone(initial);
    const onChange = () => {
      const next = document.body.dataset.previewTone;
      if (isTone(next)) setTone(next);
    };
    window.addEventListener('svgcraft:tone', onChange);
    return () => window.removeEventListener('svgcraft:tone', onChange);
  }, []);

  const clamp = useCallback((scale: number, x: number, y: number) => {
    const cw = canvasRef.current?.clientWidth || 350;
    const ch = canvasRef.current?.clientHeight || 310;
    const size = BASE_SIZE * scale;
    const pad = 20;
    const limit = (c: number) => {
      const max = Math.max(0, (c + Math.abs(c - size)) / 2 - pad);
      return Math.max(0, Math.min(max, Math.max((c - size) / 2 - pad, (size - c) / 2 + pad)));
    };
    const lx = limit(cw);
    const ly = limit(ch);
    return { scale, x: Math.max(-lx, Math.min(lx, x)), y: Math.max(-ly, Math.min(ly, y)) };
  }, []);

  const zoomAt = useCallback(
    (factor: number, fx = 0, fy = 0) => {
      setView((v) => {
        const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, v.scale * factor));
        if (Math.abs(next - v.scale) < 0.001) return v;
        const r = next / v.scale;
        return clamp(next, fx - (fx - v.x) * r, fy - (fy - v.y) * r);
      });
    },
    [clamp]
  );
  const resetView = () => setView({ scale: 1, x: 0, y: 0 });

  // Wheel must be non-passive to keep the page from scrolling while zooming
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(
        e.deltaY < 0 ? 1.14 : 1 / 1.14,
        e.clientX - (rect.left + rect.width / 2),
        e.clientY - (rect.top + rect.height / 2)
      );
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Mount the visual: live Lottie for animated modes, otherwise the static SVG
  const animated = isLordicon && Boolean(lottieData) && mode !== 'static';
  const lastNonce = useRef(previewNonce);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (!animated) {
      mount.innerHTML = staticSvg;
      const svg = mount.querySelector('svg');
      if (svg) {
        if (!svg.getAttribute('viewBox')) {
          const w = parseFloat(svg.getAttribute('width') ?? '') || 24;
          const h = parseFloat(svg.getAttribute('height') ?? '') || 24;
          svg.setAttribute('viewBox', viewBox || `0 0 ${w} ${h}`);
        }
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        if (!svg.getAttribute('preserveAspectRatio')) svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      }
      setSsrSvg(null);
      return;
    }

    const previewOnce = mode === 'hover' && previewNonce !== lastNonce.current;
    lastNonce.current = previewNonce;
    let cancelled = false;
    let anim: OnceAnim | null = null;
    void loadLottie().then((lottie) => {
      if (cancelled) return;
      mount.innerHTML = '';
      anim = lottie.loadAnimation({
        container: mount,
        renderer: 'svg',
        loop: mode === 'loop' || !previewOnce,
        autoplay: false,
        animationData: applyCustomizationsToLottieJson(lottieData, { colorMap, strokeMode }) as object,
      }) as OnceAnim;
      animRef.current = anim;
      const mounted = anim;
      mounted.addEventListener('complete', () => {
        if (mode !== 'hover' || animRef.current !== mounted) return;
        mounted.__playingOnce = false;
        restAtStart(mounted, motion);
      });
      if (mode === 'loop') {
        if (motion) mounted.playSegments([motion.startFrame, motion.endFrame], true);
        else mounted.play();
      } else if (previewOnce && motion) {
        mounted.loop = false;
        mounted.playSegments([motion.startFrame, motion.endFrame], true);
      } else {
        mounted.goToAndStop(motion ? motion.startFrame : 0, true);
      }
    });
    return () => {
      cancelled = true;
      anim?.destroy();
      if (animRef.current === anim) animRef.current = null;
    };
  }, [animated, staticSvg, lottieData, colorMap, strokeMode, mode, motion, previewNonce, viewBox]);

  const onPointerEnter = () => {
    const anim = animRef.current;
    if (mode !== 'hover' || !anim) return;
    if (hoverOnce && anim.__playingOnce) return; // don't restart a run in progress
    anim.loop = !hoverOnce;
    anim.__playingOnce = hoverOnce;
    if (motion) anim.playSegments([motion.startFrame, motion.endFrame], true);
    else anim.goToAndPlay(0, true);
  };
  const onPointerLeave = () => {
    const anim = animRef.current;
    if (mode !== 'hover' || !anim) return;
    if (hoverOnce && anim.__playingOnce) return; // the 'complete' listener rests it
    restAtStart(anim, motion);
  };

  const px = BASE_SIZE * view.scale;

  return (
    <div className="stage-card">
      <div className="stage-toolbar-top">
        <div className="stage-control-group" role="group" aria-label="Canvas background">
          {TONES.map((id) => (
            <button
              key={id}
              type="button"
              className={`stage-ctrl-btn ${tone === id ? 'active' : ''}`}
              title={t(toneTitle[id])}
              onClick={() => setTone(id)}
            >
              {id === 'auto' ? <span>Auto</span> : <Icon name={toneIcon[id]} />}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            className={`stage-ctrl-btn ${keyline ? 'active' : ''}`}
            style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-page)', height: 30 }}
            title={t('stageKeylineTitle')}
            onClick={() => setKeyline((v) => !v)}
          >
            <Icon name="grid" />
            <span>Grid</span>
          </button>
          <div className="stage-control-group">
            <button
              type="button"
              className="stage-ctrl-btn"
              title={t('stageZoomOutTitle')}
              disabled={view.scale <= MIN_SCALE + 0.01}
              onClick={() => zoomAt(1 / 1.25)}
            >
              <Icon name="zoomOut" />
            </button>
            <button
              type="button"
              className="stage-ctrl-btn stage-zoom-readout"
              title={t('stageZoomResetTitle')}
              onClick={resetView}
            >
              {Math.round(px)}px
            </button>
            <button
              type="button"
              className="stage-ctrl-btn"
              title={t('stageZoomInTitle')}
              disabled={view.scale >= MAX_SCALE - 0.01}
              onClick={() => zoomAt(1.25)}
            >
              <Icon name="zoomIn" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="stage-canvas"
        id="stageCanvas"
        data-tone={tone}
        title={t('stageCanvasTitle')}
        // Inset shadow instead of background: a translucent color still shows the tone pattern underneath
        style={!bgTransparent && bgColor ? { boxShadow: `inset 0 0 0 9999px ${bgColor}` } : undefined}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onDoubleClick={resetView}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          drag.current = { x: e.clientX, y: e.clientY, px: view.x, py: view.y };
          e.currentTarget.classList.add('is-panning');
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (d) setView((v) => clamp(v.scale, d.px + e.clientX - d.x, d.py + e.clientY - d.y));
        }}
        onPointerUp={(e) => {
          drag.current = null;
          e.currentTarget.classList.remove('is-panning');
        }}
        onPointerCancel={(e) => {
          drag.current = null;
          e.currentTarget.classList.remove('is-panning');
        }}
      >
        <div
          className="stage-vector-box"
          style={{
            width: `${px.toFixed(1)}px`,
            height: `${px.toFixed(1)}px`,
            transform: `translate(calc(-50% + ${view.x.toFixed(1)}px), calc(-50% + ${view.y.toFixed(1)}px))`,
          }}
        >
          {ssrSvg !== null && <div style={MOUNT_STYLE} dangerouslySetInnerHTML={{ __html: ssrSvg }} />}
          {/* Owned by the effect above (static SVG or lottie-web): React must never write inside it */}
          <div ref={mountRef} style={MOUNT_STYLE} />
          <div style={{ display: keyline ? 'block' : 'none' }}>
            <Icon name="keylineGridOverlay" />
          </div>
        </div>
      </div>

      <div className="stage-footer-bar">
        <div className="stage-meta-mono">
          <span>
            viewBox: <strong>{viewBox || '0 0 24 24'}</strong>
          </span>
          <span> · </span>
          <span>{formatBytes(byteSize)}</span>
        </div>
        {isLordicon && mode === 'hover' && (
          <div className="hover-repeat-toggle" role="group" aria-label={t('hoverRepeatLabel')}>
            <span className="hover-repeat-label">{t('hoverRepeatLabel')}</span>
            <button
              type="button"
              className={`hover-repeat-btn ${hoverOnce ? 'active' : ''}`}
              onClick={() => onHoverOnceChange(true)}
            >
              {t('hoverRepeatOnce')}
            </button>
            <button
              type="button"
              className={`hover-repeat-btn ${hoverOnce ? '' : 'active'}`}
              onClick={() => onHoverOnceChange(false)}
            >
              {t('hoverRepeatLoop')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Rest on the first frame of the state. After playSegments(), lottie-web treats goToAndStop() frames as relative to
 * the active segment, so segments must be reset first or we'd land on a blank frame at (startFrame * 2).
 */
function restAtStart(anim: AnimationItem, motion: MotionState | undefined) {
  try {
    anim.resetSegments(true);
    anim.goToAndStop(motion ? motion.startFrame : 0, true);
  } catch {
    /* animation already destroyed */
  }
}
