'use client';

/** Unified export: pick a format, tweak its options, then copy or download. */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  applyCustomizationsToLottieJson,
  formatBytes,
  highlightCodeBlock,
  prettyFormatSvgXml,
  svgToDataUri,
  svgToHtmlImg,
  svgToJsx,
  svgToVue,
  toPascalCaseComponentName,
} from '@svg-hub/svg-tools';
import type { ColorMap, MotionState, StrokeMode } from '@svg-hub/svg-tools';
import { readStorage, showToast, writeStorage } from './bridge';
import { copyPng, downloadBlob, svgToPngBlob } from './export-file';
import { Icon } from './icons';
import type { SvgMode } from './Stage';
import type { Translate } from './IconStudio';

const PNG_SIZES = [32, 64, 128, 256, 512];
const SVG_MODE_FORMATS = new Set(['svg', 'jsx', 'vue', 'datauri']);
const LANG_BADGE: Record<string, string> = {
  svg: 'XML / SVG',
  jsx: 'JSX / TSX',
  vue: 'Vue SFC',
  html: 'HTML',
  datauri: 'Data URI',
  png: 'Image / PNG',
  lottie: 'Lottie JSON',
};
const EXT: Record<string, string> = {
  svg: '.svg',
  jsx: '.jsx',
  vue: '.vue',
  html: '.html',
  datauri: '.txt',
  png: '.png',
  lottie: '.json',
};
const MODES = [
  ['static', 'exportModeStaticShort', 'exportModeStaticSub'],
  ['hover', 'exportModeHoverShort', 'exportModeHoverSub'],
  ['loop', 'exportModeLoopShort', 'exportModeLoopSub'],
] as const;

interface LottieInfo {
  w?: number;
  h?: number;
  fr?: number;
  ip?: number;
  op?: number;
}

interface ExportPanelProps {
  t: Translate;
  icon: { slug: string; title: string; width?: string; height?: string };
  assetUrl: string;
  variant: string;
  styleLabel: string;
  isLordicon: boolean;
  staticSvg: string;
  /** Current output: compiled animated SVG when ready, otherwise the static SVG */
  currentSvg: string;
  compiling: boolean;
  /** Resolves to the up-to-date SVG for the current mode, compiling if needed */
  getExportSvg(): Promise<string>;
  lottieData: unknown;
  lottieFailed: boolean;
  colorMap: ColorMap;
  strokeMode: StrokeMode;
  states: MotionState[];
  motionId: string;
  onMotionChange(id: string): void;
  mode: SvgMode;
  onModeChange(mode: SvgMode): void;
}

export default function ExportPanel(props: ExportPanelProps) {
  const { t, icon, assetUrl, variant, styleLabel, isLordicon, staticSvg, currentSvg, compiling, getExportSvg } = props;
  const { lottieData, lottieFailed, colorMap, strokeMode, states, motionId, onMotionChange, mode, onModeChange } =
    props;

  const [fmt, setFmt] = useState('svg');
  const [pngSize, setPngSize] = useState(256);
  const copyBtn = useRef<HTMLButtonElement>(null);

  const formats = [
    { id: 'svg', label: 'SVG', icon: 'code' },
    { id: 'jsx', label: 'React', icon: 'react' },
    { id: 'vue', label: 'Vue', icon: 'vue' },
    { id: 'html', label: 'HTML', icon: 'code' },
    { id: 'datauri', label: 'Data URI', icon: 'link' },
    { id: 'png', label: 'PNG', icon: 'image' },
    ...(isLordicon ? [{ id: 'lottie', label: 'Lottie', icon: 'play-circle' }] : []),
  ];

  // Remembered per viewer; read after mount so server and client markup match
  useEffect(() => {
    const savedFmt = readStorage('svgcraft:export:format');
    if (savedFmt && (savedFmt !== 'lottie' || isLordicon) && LANG_BADGE[savedFmt]) setFmt(savedFmt);
    const savedSize = Number(readStorage('svgcraft:export:pngSize'));
    if (PNG_SIZES.includes(savedSize)) setPngSize(savedSize);
  }, [isLordicon]);

  const componentName = toPascalCaseComponentName(icon.slug || icon.title);

  const codeFor = (format: string, svg: string): string => {
    switch (format) {
      case 'jsx':
        return svgToJsx(svg, componentName);
      case 'vue':
        return svgToVue(svg);
      case 'html':
        return svgToHtmlImg(assetUrl, {
          title: icon.title || icon.slug,
          width: icon.width || 24,
          height: icon.height || 24,
          origin: typeof window === 'undefined' ? '' : window.location.origin,
        });
      case 'datauri':
        return svgToDataUri(svg);
      default:
        return prettyFormatSvgXml(svg);
    }
  };

  const lottieJson = useMemo(
    () =>
      fmt === 'lottie' && lottieData
        ? JSON.stringify(applyCustomizationsToLottieJson(lottieData, { colorMap, strokeMode }))
        : '',
    [fmt, lottieData, colorMap, strokeMode]
  );

  const display = useMemo(() => {
    if (fmt === 'png') return { html: '', meta: `PNG · ${pngSize} × ${pngSize}px` };
    if (fmt === 'lottie') {
      if (!lottieJson) return { text: t('exportLottieLoading'), meta: '' };
      const info = lottieData as LottieInfo;
      const stateList = states.map((s) => `${s.label} (${s.startFrame}–${s.endFrame})`).join(', ');
      const text = [
        `// Lottie JSON — ${styleLabel}`,
        `// ${info.w}×${info.h} · ${info.fr}fps · ${Number(info.op) - Number(info.ip)} frames`,
        `// Motion states: ${stateList || '—'}`,
        `// ${t('exportLottieNote')}`,
        '',
        `${lottieJson.slice(0, 1200)}${lottieJson.length > 1200 ? ' …' : ''}`,
      ].join('\n');
      return { text, meta: `JSON · ${formatBytes(new Blob([lottieJson]).size)}` };
    }
    const code = codeFor(fmt, currentSvg);
    return { html: highlightCodeBlock(code, fmt), meta: formatBytes(new Blob([code]).size) };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- codeFor only depends on the values listed
  }, [fmt, pngSize, currentSvg, lottieJson, states, assetUrl, t]);

  const baseName = () => {
    const suffix =
      isLordicon && mode !== 'static' && SVG_MODE_FORMATS.has(fmt)
        ? `-${styleLabel.replace('/', '-')}-${mode}`
        : variant !== 'default'
          ? `-${variant}`
          : '';
    return `${icon.slug || 'icon'}${suffix}`;
  };

  const payload = async (): Promise<{ text: string; file: string; mime: string }> => {
    const base = baseName();
    if (fmt === 'lottie') return { text: lottieJson, file: `${base}.json`, mime: 'application/json' };
    const svg = SVG_MODE_FORMATS.has(fmt) ? await getExportSvg() : currentSvg;
    switch (fmt) {
      case 'jsx':
        return { text: codeFor('jsx', svg), file: `${componentName}.jsx`, mime: 'text/javascript' };
      case 'vue':
        return { text: codeFor('vue', svg), file: `${componentName}.vue`, mime: 'text/plain' };
      case 'html':
        return { text: codeFor('html', svg), file: `${base}.html`, mime: 'text/html' };
      case 'datauri':
        return { text: codeFor('datauri', svg), file: `${base}.txt`, mime: 'text/plain' };
      default:
        return { text: svg.trim(), file: `${base}.svg`, mime: 'image/svg+xml' };
    }
  };

  const downloadPng = (png: Blob) => {
    const file = `${icon.slug || 'icon'}-${pngSize}px.png`;
    downloadBlob(png, file);
    showToast(t('toastPngDownloaded', { file }));
  };

  const flash = () => {
    const btn = copyBtn.current;
    if (!btn) return;
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1400);
  };

  const copy = async () => {
    if (fmt === 'png') {
      const png = await svgToPngBlob(staticSvg, pngSize);
      if (await copyPng(png)) showToast(t('toastPngCopied', { size: pngSize }));
      else downloadPng(png);
      flash();
      return;
    }
    const { text } = await payload();
    if (!text) {
      showToast(t('exportLottieLoading'));
      return;
    }
    await navigator.clipboard.writeText(text);
    flash();
    showToast(t('toastCodeCopied', { tab: LANG_BADGE[fmt] ?? fmt }));
  };

  const download = async () => {
    if (fmt === 'png') {
      downloadPng(await svgToPngBlob(staticSvg, pngSize));
      return;
    }
    const { text, file, mime } = await payload();
    if (!text) {
      showToast(t('exportLottieLoading'));
      return;
    }
    downloadBlob(new Blob([text], { type: `${mime};charset=utf-8` }), file);
    showToast(t('toastFileDownloaded', { file }));
  };

  const onCopy = () => copy().catch(() => showToast(t('exportFailed')));
  const onDownload = () => download().catch(() => showToast(t('exportFailed')));

  // C = copy, D = download
  const shortcuts = useRef({ onCopy, onDownload });
  shortcuts.current = { onCopy, onDownload };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const key = e.key.toLowerCase();
      if (key === 'c' && !window.getSelection()?.toString()) {
        e.preventDefault();
        void shortcuts.current.onCopy();
      } else if (key === 'd') {
        e.preventDefault();
        void shortcuts.current.onDownload();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const modeApplies = SVG_MODE_FORMATS.has(fmt);
  const modeNote = !modeApplies
    ? fmt === 'png'
      ? t('exportModeNotePng')
      : fmt === 'html'
        ? t('exportModeNoteHtml')
        : fmt === 'lottie'
          ? t('exportModeNoteLottie')
          : ''
    : '';
  const previewPx = Math.min(pngSize, 160);

  return (
    <div className="code-studio-card export-panel" id="exportPanel">
      {isLordicon && (
        <div className={`export-mode-row ${modeApplies ? '' : 'is-not-applied'}`} id="exportModeRow">
          <div className="export-option-group export-motion-group">
            <span className="export-option-label">{t('exportOptMotion')}</span>
            <div className="code-tabs-group" id="lordiconMotionStatesWrap">
              {states.length === 0 && !lottieFailed && (
                <span className="export-mode-note" style={{ padding: '0 8px' }}>
                  {t('exportMotionLoading')}
                </span>
              )}
              {states.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className={`code-tab-btn ${st.id === motionId ? 'active' : ''}`}
                  title={`${st.rawName} · ${st.durationFrames} frames`}
                  onClick={() => onMotionChange(st.id)}
                >
                  <Icon name="play-circle" />
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="export-mode-break" aria-hidden="true" />
          <div className="export-option-group" data-export-option="svgMode">
            <span className="export-option-label">{t('exportOptAnimation')}</span>
            <div className="code-tabs-group">
              {MODES.map(([id, labelKey, subKey]) => (
                <button
                  key={id}
                  type="button"
                  className={`code-tab-btn ${mode === id ? 'active' : ''}`}
                  title={t(subKey)}
                  onClick={() => onModeChange(id)}
                >
                  {t(labelKey)}
                </button>
              ))}
            </div>
          </div>
          <span className="export-mode-note">{modeNote}</span>
        </div>
      )}

      <div className="code-studio-header">
        <div className="code-tabs-group" role="tablist" aria-label={t('exportPanelTitle')}>
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`code-tab-btn ${f.id === fmt ? 'active' : ''}`}
              role="tab"
              aria-selected={f.id === fmt}
              onClick={() => {
                setFmt(f.id);
                writeStorage('svgcraft:export:format', f.id);
              }}
            >
              <Icon name={f.icon} />
              <span>{f.label}</span>
            </button>
          ))}
        </div>
        <span className="code-lang-badge">{LANG_BADGE[fmt] ?? 'CODE'}</span>
      </div>

      {fmt === 'png' && (
        <div className="export-options-row">
          <div className="export-option-group" data-export-option="pngSize">
            <span className="export-option-label">{t('exportOptSize')}</span>
            <div className="code-tabs-group">
              {PNG_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`code-tab-btn ${sz === pngSize ? 'active' : ''}`}
                  onClick={() => {
                    setPngSize(sz);
                    writeStorage('svgcraft:export:pngSize', String(sz));
                  }}
                >
                  {sz}px
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {fmt === 'png' ? (
        <div className="export-png-preview">
          <div className="export-png-frame" style={{ width: previewPx, height: previewPx }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- data URI of the live SVG */}
            <img src={svgToDataUri(staticSvg)} width={previewPx} height={previewPx} alt="" />
          </div>
        </div>
      ) : (
        <pre className="code-studio-pre scroller">
          {display.text !== undefined ? (
            <code>{display.text}</code>
          ) : (
            <code dangerouslySetInnerHTML={{ __html: display.html ?? '' }} />
          )}
        </pre>
      )}

      <div className="export-footer">
        <span className="export-footer-meta">{compiling && modeApplies ? t('exportCompiling') : display.meta}</span>
        <div className="export-footer-actions">
          <button
            ref={copyBtn}
            type="button"
            className="btn-copy-code-snippet"
            title={`${t('exportCopyBtn')} (C)`}
            onClick={onCopy}
          >
            <Icon name="copy" />
            <span>{t('exportCopyBtn')}</span>
            <kbd className="export-kbd">C</kbd>
          </button>
          <button
            type="button"
            className="btn-export-download"
            title={`${t('exportDownloadBtn')} (D)`}
            onClick={onDownload}
          >
            <Icon name="download" />
            <span>{`${t('exportDownloadBtn')} ${EXT[fmt] ?? ''}`.trim()}</span>
            <kbd className="export-kbd">D</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
