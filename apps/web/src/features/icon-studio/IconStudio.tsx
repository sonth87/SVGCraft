'use client';

/** Icon detail page: state of the studio plus the page layout. Navigation clicks are handled by app.js for now. */
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  applyCustomizationsToSvgXml,
  defaultMotionState,
  extractEditableColorsFromSvg,
  extractLordiconMotionStates,
  formatBytes,
} from '@svg-hub/svg-tools';
import type { ColorMap, MotionState, StrokeMode } from '@svg-hub/svg-tools';
import type { IconDetailPayload } from '@/lib/iconDetail';
import {
  categoryLabel,
  isFavorite,
  readLang,
  setBrandGlow,
  showToast,
  subscribeLang,
  toggleFavorite,
  translate,
  type Lang,
  type MessageKey,
} from './bridge';
import ColorPicker from './ColorPicker';
import { compileAnimatedSvg } from './compile-animated';
import ExportPanel from './ExportPanel';
import { categoryIconName, Icon, styleIconName, typeIconName } from './icons';
import Stage, { type SvgMode } from './Stage';

export interface NavTarget {
  collectionSlug: string;
  id?: string;
  slug: string;
}
export interface DetailNav {
  prev?: NavTarget | null;
  next?: NavTarget | null;
}
export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

const iconHref = (col: string, id: string) => `/icon/${encodeURIComponent(col)}/${encodeURIComponent(id)}`;
const colHref = (col: string) => `/collection/${encodeURIComponent(col)}`;
const STROKES: [StrokeMode, MessageKey][] = [
  ['light', 'strokeLight'],
  ['regular', 'strokeRegular'],
  ['bold', 'strokeBold'],
];

const originalColorMap = (svg: string): ColorMap =>
  Object.fromEntries(extractEditableColorsFromSvg(svg).map((slot) => [slot.hex, slot.hex]));

type RecItem = IconDetailPayload['recommendations']['similar'][number];

function RecStrip({ items, emptyText }: { items: RecItem[] | undefined; emptyText: string }) {
  if (!items?.length) {
    return <div style={{ color: 'var(--text-dim)', fontSize: '0.82rem', padding: '12px 0' }}>{emptyText}</div>;
  }
  return (
    <div className="rec-strip">
      {items.map((item) => (
        <a
          key={`${item.collectionSlug}:${item.id}`}
          className="rec-mini-card"
          href={iconHref(item.collectionSlug, item.id || item.slug)}
          data-switch-icon={`${item.collectionSlug}:${item.id || item.slug}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- immutable CDN SVG, no optimization needed */}
          <img src={item.assetUrl} alt={item.title} loading="lazy" />
          <div
            style={{
              fontSize: '0.76rem',
              fontWeight: 600,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--text-main)',
            }}
          >
            {item.title || item.slug}
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
            {item.category} · {item.styleType}
          </div>
        </a>
      ))}
    </div>
  );
}

export default function IconStudio({ data, nav }: { data: IconDetailPayload; nav: DetailNav }) {
  const { icon, svgVariantsContent, variantAssetUrls, lordiconStyles, recommendations, rawSvg } = data;
  const lang = useSyncExternalStore<Lang>(subscribeLang, readLang, () => 'en');
  const t = useCallback<Translate>((key, vars) => translate(lang, key, vars), [lang]);

  const isLordicon = icon.site === 'lordicon' || icon.collectionSlug.startsWith('lordicon-');
  const [, family = 'system', ...styleParts] = icon.collectionSlug.split('-');
  const lordStyle = styleParts.join('-') || 'outline';
  const styleLabel = `${family}/${lordStyle}`;

  const variantKeys = useMemo(() => {
    const keys = Object.keys(svgVariantsContent);
    if (keys.length) return keys;
    const urlKeys = Object.keys(variantAssetUrls);
    return urlKeys.length ? urlKeys : ['default'];
  }, [svgVariantsContent, variantAssetUrls]);

  // ---- Customization ----
  const [variant, setVariant] = useState(variantKeys[0] ?? 'default');
  const baseSvg = svgVariantsContent[variant] || rawSvg || '';
  const slots = useMemo(() => extractEditableColorsFromSvg(baseSvg), [baseSvg]);
  const [colorMap, setColorMap] = useState<ColorMap>(() => originalColorMap(baseSvg));
  const [bgTransparent, setBgTransparent] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [strokeMode, setStrokeMode] = useState<StrokeMode>('regular');
  const originals = useMemo(() => slots.map((s) => s.hex), [slots]);

  const switchVariant = (next: string) => {
    setVariant(next);
    setColorMap(originalColorMap(svgVariantsContent[next] || rawSvg || ''));
  };
  const resetAll = () => {
    setColorMap(originalColorMap(baseSvg));
    setBgTransparent(true);
    setBgColor('#ffffff');
    setStrokeMode('regular');
  };

  const staticSvg = useMemo(
    () => applyCustomizationsToSvgXml(baseSvg, { colorMap, strokeMode, bgTransparent, bgColor }),
    [baseSvg, colorMap, strokeMode, bgTransparent, bgColor]
  );

  // Dragging in the color picker fires constantly; heavy work follows at the pace the browser can keep up with
  const deferredColors = useDeferredValue(colorMap);

  // ---- Animation (Lordicon) ----
  const [lottieData, setLottieData] = useState<unknown>(null);
  const [lottieFailed, setLottieFailed] = useState(false);
  const [states, setStates] = useState<MotionState[]>([]);
  const [motionId, setMotionId] = useState('');
  const [mode, setMode] = useState<SvgMode>(isLordicon ? 'loop' : 'static');
  const [hoverOnce, setHoverOnce] = useState(false);
  const [previewNonce, setPreviewNonce] = useState(0);
  const motion = states.find((s) => s.id === motionId) ?? states[0];

  useEffect(() => {
    if (!isLordicon) return;
    const ctrl = new AbortController();
    const fetchJson = async (url: string, headers?: HeadersInit) => {
      const res = await fetch(url, { signal: ctrl.signal, headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<unknown>;
    };
    const load = async () => {
      // Immutable CDN file first; the API reads the same object, for a CDN domain without CORS
      if (icon.lottieUrl) {
        try {
          return await fetchJson(icon.lottieUrl);
        } catch (err) {
          if (ctrl.signal.aborted) throw err;
        }
      }
      const api = `/api/lordicon/lottie?collection=${encodeURIComponent(icon.collectionSlug)}&slug=${encodeURIComponent(icon.slug)}`;
      const body = (await fetchJson(api, { 'x-svgcraft-client': 'web-v2' })) as { lottie: unknown };
      return body.lottie;
    };
    load()
      .then((lottie) => {
        const list = extractLordiconMotionStates(lottie);
        setLottieData(lottie);
        setStates(list);
        setMotionId(defaultMotionState(list)?.id ?? '');
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setLottieFailed(true);
      });
    return () => ctrl.abort();
  }, [isLordicon, icon.lottieUrl, icon.collectionSlug, icon.slug]);

  // ---- Compiled animated SVG, kept in step with the settings ----
  const animatedActive = isLordicon && mode !== 'static' && Boolean(lottieData);
  const compileKey = animatedActive
    ? JSON.stringify([motion?.id, mode, hoverOnce, deferredColors, strokeMode, bgTransparent, bgColor])
    : '';
  const [compiled, setCompiled] = useState<{ key: string; svg: string } | null>(null);
  const latest = useRef({ lottieData, motion, mode, hoverOnce, colorMap, strokeMode, bgTransparent, bgColor });
  latest.current = { lottieData, motion, mode, hoverOnce, colorMap, strokeMode, bgTransparent, bgColor };

  const compileNow = useCallback(async () => {
    const s = latest.current;
    return compileAnimatedSvg(s.lottieData, s.motion, {
      exportMode: s.mode === 'hover' ? 'hover' : 'loop',
      hoverPlayOnce: s.hoverOnce,
      colorMap: s.colorMap,
      strokeMode: s.strokeMode,
      bgTransparent: s.bgTransparent,
      bgColor: s.bgColor,
    });
  }, []);

  useEffect(() => {
    if (!compileKey) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      void compileNow()
        .then((svg) => {
          if (!cancelled) setCompiled({ key: compileKey, svg });
        })
        .catch(() => {
          /* the static SVG stays as the output */
        });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [compileKey, compileNow]);

  const compiledReady = animatedActive && compiled?.key === compileKey;
  const currentSvg = compiledReady ? compiled.svg : staticSvg;
  const compiling = animatedActive && !compiledReady;

  const getExportSvg = useCallback(async () => {
    if (!animatedActive) return staticSvg;
    if (compiledReady) return compiled.svg;
    showToast(t('toastCompilingAnimSvg'));
    return compileNow();
  }, [animatedActive, compiledReady, compiled, staticSvg, compileNow, t]);

  // ---- Page chrome ----
  const primary = colorMap[slots[0]?.hex ?? ''] ?? slots[0]?.hex ?? null;
  useEffect(() => {
    setBrandGlow(primary ?? '#f97316');
  }, [primary]);
  useEffect(() => () => setBrandGlow(null), []);

  const favKeys = [
    `${icon.collectionSlug}:${icon.id || icon.slug}`,
    `${icon.site}:${icon.collectionSlug}:${icon.id || icon.slug}`,
  ];
  const [fav, setFav] = useState(false);
  useEffect(() => {
    setFav(isFavorite(favKeys));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one icon per mounted studio
  }, []);

  const catLabel = categoryLabel(lang, icon.category);
  const hasStyles = Array.isArray(lordiconStyles) && lordiconStyles.length > 0;
  const palette = icon.colorPalette ?? [];
  const byteSize = useMemo(() => new TextEncoder().encode(currentSvg).length, [currentSvg]);
  const author =
    !icon.author || /^(thesvg|svg\s*repo)$/i.test(String(icon.author).trim()) ? 'Open Source' : icon.author;
  const navHref = (target?: NavTarget | null) =>
    target ? iconHref(target.collectionSlug, target.id || target.slug) : undefined;
  const navKey = (target?: NavTarget | null) =>
    target ? `${target.collectionSlug}:${target.id || target.slug}` : undefined;

  return (
    <>
      <div className="detail-topbar">
        <div className="detail-breadcrumbs">
          <button type="button" className="btn-back-catalog" data-detail-back="">
            <Icon name="arrowLeft" />
            <span>{t('detailBack')}</span>
          </button>
          <button type="button" className="crumb-btn" data-crumb-cat={icon.category}>
            {catLabel}
          </button>
          <span className="crumb-sep">
            <Icon name="chevronRight" />
          </span>
          <a className="crumb-btn" href={colHref(icon.collectionSlug)} data-open-col={icon.collectionSlug}>
            {icon.collectionName}
          </a>
          <span className="crumb-sep">
            <Icon name="chevronRight" />
          </span>
          <span className="crumb-current">{icon.title || icon.slug}</span>
        </div>

        <div className="detail-nav-actions">
          <button
            type="button"
            className="icon-btn-square"
            disabled={!nav.prev}
            title={t('detailPrevTitle')}
            data-switch-icon={navKey(nav.prev)}
            data-href={navHref(nav.prev)}
          >
            <Icon name="chevronLeft" />
          </button>
          <button
            type="button"
            className="icon-btn-square"
            disabled={!nav.next}
            title={t('detailNextTitle')}
            data-switch-icon={navKey(nav.next)}
            data-href={navHref(nav.next)}
          >
            <Icon name="chevronRight" />
          </button>
          <button
            type="button"
            className={`icon-btn-square ${fav ? 'active-fav' : ''}`}
            title={t('detailFavTitle')}
            onClick={() => {
              const on = toggleFavorite(favKeys);
              setFav(on);
              showToast(t(on ? 'toastFavAdded' : 'toastFavRemoved'));
            }}
          >
            <Icon name={fav ? 'heartFilled' : 'heart'} />
          </button>
          <button
            type="button"
            className="icon-btn-square"
            title={t('detailShareTitle')}
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href).then(() => showToast(t('toastIconLinkCopied')));
            }}
          >
            <Icon name="share" />
          </button>
        </div>
      </div>

      <div className="detail-hero-grid">
        <div className="detail-stage-col">
          <Stage
            t={t}
            staticSvg={staticSvg}
            byteSize={byteSize}
            viewBox={icon.viewBox}
            isLordicon={isLordicon}
            lottieData={lottieData}
            colorMap={deferredColors}
            strokeMode={strokeMode}
            bgTransparent={bgTransparent}
            bgColor={bgColor}
            mode={mode}
            motion={motion}
            previewNonce={previewNonce}
            hoverOnce={hoverOnce}
            onHoverOnceChange={setHoverOnce}
          />

          <div className="studio-customizer-box">
            <div className="panel-box-label" style={{ marginBottom: 2 }}>
              <span>{t('customizerTitle')}</span>
              <button type="button" className="stage-ctrl-btn" title={t('stageResetColorTitle')} onClick={resetAll}>
                <Icon name="rotateCcw" />
              </button>
            </div>

            <div className="studio-ctrl-row">
              <span className="studio-ctrl-label">{t('ctrlColors')}</span>
              <div className="color-wells-list">
                {slots.map((slot) => (
                  <ColorPicker
                    key={slot.hex}
                    t={t}
                    label={slot.label}
                    value={colorMap[slot.hex] ?? slot.hex}
                    originals={originals}
                    onChange={(value) => setColorMap((m) => ({ ...m, [slot.hex]: value }))}
                  />
                ))}
              </div>
            </div>

            <div className="studio-ctrl-row">
              <span className="studio-ctrl-label">{t('ctrlBackground')}</span>
              <div className="studio-ctrl-right">
                <label className="bg-transparent-toggle">
                  <input type="checkbox" checked={bgTransparent} onChange={(e) => setBgTransparent(e.target.checked)} />
                  <span>{t('ctrlTransparent')}</span>
                </label>
                <ColorPicker
                  t={t}
                  compact
                  dimmed={bgTransparent}
                  label={t('ctrlBackground')}
                  value={bgColor}
                  originals={originals}
                  onChange={(value) => {
                    setBgColor(value);
                    setBgTransparent(false);
                  }}
                />
              </div>
            </div>

            <div className="studio-ctrl-row">
              <span className="studio-ctrl-label">{t('ctrlStroke')}</span>
              <div className="stroke-segmented-group" role="group" aria-label="Stroke width">
                {STROKES.map(([id, labelKey]) => (
                  <button
                    key={id}
                    type="button"
                    className={`stroke-seg-btn ${strokeMode === id ? 'active' : ''}`}
                    onClick={() => setStrokeMode(id)}
                  >
                    {t(labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-panel-box">
            <div className="panel-box-label">
              <span>{t('detailVariantsTitle', { count: hasStyles ? lordiconStyles.length : variantKeys.length })}</span>
              <span style={{ textTransform: 'none', fontWeight: 500 }}>{hasStyles ? styleLabel : variant}</span>
            </div>
            <div className="variants-strip-grid">
              {hasStyles
                ? lordiconStyles.map((st) => (
                    <a
                      key={st.colSlug}
                      className={`variant-mini-btn ${st.isCurrent ? 'active' : ''}`}
                      href={iconHref(st.collectionSlug, st.iconId)}
                      data-switch-icon={st.isCurrent ? undefined : `${st.collectionSlug}:${st.iconId}`}
                      onClick={st.isCurrent ? (e) => e.preventDefault() : undefined}
                    >
                      <span className="variant-mini-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element -- immutable CDN SVG */}
                        <img src={st.assetUrl} alt={st.label} loading="lazy" />
                      </span>
                      <span className="variant-mini-name" title={st.label}>
                        {st.label}
                      </span>
                    </a>
                  ))
                : variantKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`variant-mini-btn ${key === variant ? 'active' : ''}`}
                      onClick={() => switchVariant(key)}
                    >
                      <span className="variant-mini-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element -- immutable CDN SVG */}
                        <img src={variantAssetUrls[key] || icon.assetUrl} alt={key} />
                      </span>
                      <span className="variant-mini-name">{key}</span>
                    </button>
                  ))}
            </div>
          </div>

          {palette.length > 0 && (
            <div className="detail-panel-box">
              <div className="panel-box-label">
                <span>{t('detailPaletteTitle')}</span>
              </div>
              <div className="palette-swatches">
                {palette.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    className="swatch-pill"
                    title={hex}
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(hex)
                        .then(() => showToast(t('toastHexCopied', { hex: hex.toUpperCase() })));
                    }}
                  >
                    <span className="swatch-dot" style={{ background: hex }} />
                    <span>{hex.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="detail-info-col">
          <div>
            <div className="detail-title-row">
              <h1 className="detail-h1">{icon.title || icon.slug}</h1>
              <code className="detail-slug-code">{icon.slug}</code>
            </div>
            <div className="detail-badges-row" style={{ marginTop: 10 }}>
              <button type="button" className="pill-btn active" data-crumb-cat={icon.category}>
                <Icon name={categoryIconName(icon.category)} />
                <span>{catLabel}</span>
              </button>
              <button type="button" className="pill-btn" data-jump-style={icon.styleType}>
                <Icon name={styleIconName(icon.styleType)} />
                <span>
                  {t('detailStylePrefix')} {icon.styleType}
                </span>
              </button>
              <button type="button" className="pill-btn" data-jump-type={icon.iconType}>
                <Icon name={typeIconName(icon.iconType)} />
                <span>{icon.iconType}</span>
              </button>
            </div>
          </div>

          <ExportPanel
            t={t}
            icon={icon}
            assetUrl={variantAssetUrls[variant] || icon.assetUrl}
            variant={variant}
            styleLabel={styleLabel}
            isLordicon={isLordicon}
            staticSvg={staticSvg}
            currentSvg={currentSvg}
            compiling={compiling}
            getExportSvg={getExportSvg}
            lottieData={lottieData}
            lottieFailed={lottieFailed}
            colorMap={deferredColors}
            strokeMode={strokeMode}
            states={states}
            motionId={motionId}
            onMotionChange={(id) => {
              setMotionId(id);
              setMode((m) => (m === 'static' ? 'loop' : m));
              setPreviewNonce((n) => n + 1);
            }}
            mode={mode}
            onModeChange={setMode}
          />

          <div className="detail-meta-grid">
            <div className="meta-stat-card">
              <span className="meta-stat-label">{t('metaCollection')}</span>
              <a className="meta-stat-link" href={colHref(icon.collectionSlug)} data-open-col={icon.collectionSlug}>
                <Icon name="folder" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {icon.collectionName}
                </span>
              </a>
            </div>
            <div className="meta-stat-card">
              <span className="meta-stat-label">{t('metaGridSize')}</span>
              <span className="meta-stat-val">{icon.gridSize || '24x24'}</span>
            </div>
            <div className="meta-stat-card">
              <span className="meta-stat-label">{t('metaFileSize')}</span>
              <span className="meta-stat-val">{formatBytes(byteSize)}</span>
            </div>
            <div className="meta-stat-card">
              <span className="meta-stat-label">{t('metaLicense')}</span>
              <span className="meta-stat-val">{icon.license || 'MIT / CC0'}</span>
            </div>
            <div className="meta-stat-card">
              <span className="meta-stat-label">{t('metaAuthor')}</span>
              <span className="meta-stat-val">{author}</span>
            </div>
          </div>

          <div>
            <div className="panel-box-label" style={{ marginBottom: 6 }}>
              <span>{t('detailTagsLabel')}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(icon.tags ?? []).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="pill-btn"
                  data-jump-tag={tag}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <h2 className="detail-section-title">
            <span className="nav-icon" style={{ color: 'var(--brand-orange)' }}>
              <Icon name="sparkles" />
            </span>
            <span>{t('recSimilarTitle')}</span>
          </h2>
        </div>
        <RecStrip items={recommendations?.similar} emptyText={t('recEmpty')} />
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <h2 className="detail-section-title">
            <span className="nav-icon" style={{ color: 'var(--brand-orange)' }}>
              <Icon name={styleIconName(icon.styleType)} />
            </span>
            <span>{t('recSameStyleTitle', { style: icon.styleType, category: catLabel })}</span>
          </h2>
        </div>
        <RecStrip items={recommendations?.sameStyle} emptyText={t('recEmpty')} />
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <h2 className="detail-section-title">
            <span className="nav-icon" style={{ color: 'var(--brand-orange)' }}>
              <Icon name="folder" />
            </span>
            <span>{t('recSameColTitle', { collection: icon.collectionName })}</span>
          </h2>
          <a className="pill-btn" href={colHref(icon.collectionSlug)} data-open-col={icon.collectionSlug}>
            <span>{t('recViewAllCol')}</span>
            <Icon name="chevronRight" />
          </a>
        </div>
        <RecStrip items={recommendations?.sameCollection} emptyText={t('recEmpty')} />
      </div>
    </>
  );
}
