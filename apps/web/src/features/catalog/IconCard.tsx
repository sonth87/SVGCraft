'use client';

/** Card in an icon grid (catalog and collection pages). Real link to the icon page; Lordicon cards animate on hover. */
import { memo, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  defaultMotionState,
  extractLordiconMotionStates,
  svgToJsx,
  toPascalCaseComponentName,
} from '@svg-hub/svg-tools';
import type { IconListItem } from '@svg-hub/catalog';
import { apiJson } from '../shared/api';
import { showToast, styleLabel, toggleFavorite, typeLabel, type Lang, type Translate } from '../shared/bridge';
import { Icon, styleIconName } from '../shared/icons';
import { loadLottie, type AnimationItem } from '../icon-studio/lottie';

interface IconCardProps {
  item: IconListItem;
  index: number;
  favorite: boolean;
  lang: Lang;
  t: Translate;
}

async function fetchSvg(url: string, t: Translate): Promise<string> {
  const res = await fetch(url);
  if (res.status === 429) {
    showToast(t('toastRateLimit'));
    return '';
  }
  if (!res.ok) return '';
  const text = await res.text();
  return text.includes('<svg') ? text : '';
}

const lottieCache = new Map<string, Promise<{ lottie: unknown }>>();

/** Plays a Lordicon animation over the card's static image while the pointer is on it. */
function HoverLottie({
  collection,
  slug,
  onReady,
}: {
  collection: string;
  slug: string;
  onReady(ready: boolean): void;
}) {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let anim: AnimationItem | null = null;
    const key = `${collection}/${slug}`;
    let request = lottieCache.get(key);
    if (!request) {
      request = apiJson<{ lottie: unknown }>(
        `/api/lordicon/lottie?collection=${encodeURIComponent(collection)}&slug=${encodeURIComponent(slug)}`
      );
      lottieCache.set(key, request);
      request.catch(() => lottieCache.delete(key));
    }
    void Promise.all([loadLottie(), request])
      .then(([lottie, { lottie: data }]) => {
        if (cancelled || !layer.current) return;
        const state = defaultMotionState(extractLordiconMotionStates(data));
        anim = lottie.loadAnimation({
          container: layer.current,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData: JSON.parse(JSON.stringify(data)) as object,
        });
        if (state) anim.playSegments([state.startFrame, state.endFrame], true);
        else anim.play();
        onReady(true);
      })
      .catch(() => {
        /* the static image stays */
      });
    return () => {
      cancelled = true;
      anim?.destroy();
      onReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onReady is a state setter
  }, [collection, slug]);
  return <div ref={layer} className="lordicon-grid-lottie-layer" />;
}

function IconCardBase({ item, index, favorite, lang, t }: IconCardProps) {
  const router = useRouter();
  const id = item.id || item.slug;
  const openKey = `${item.collectionSlug}:${id}`;
  const href = `/icon/${encodeURIComponent(item.collectionSlug)}/${encodeURIComponent(id)}`;
  const isLordicon = item.site === 'lordicon' || item.collectionSlug.startsWith('lordicon-');
  const isAnimated = isLordicon || item.iconType === 'animated' || item.site === 'allsvgicons';
  const sub = isLordicon ? item.lordiconCategory || item.category : item.category;

  const [hover, setHover] = useState(false);
  const [lottieReady, setLottieReady] = useState(false);
  const prefetchTimer = useRef(0);

  return (
    <article className="icon-card" data-icon-card={openKey}>
      <Link
        className="icon-preview-area"
        href={href}
        prefetch={false}
        onPointerEnter={() => {
          if (isLordicon) setHover(true);
          // Warm the page while the pointer rests on the card, so the click feels instant
          window.clearTimeout(prefetchTimer.current);
          prefetchTimer.current = window.setTimeout(() => router.prefetch(href), 150);
        }}
        onPointerLeave={() => {
          setHover(false);
          window.clearTimeout(prefetchTimer.current);
        }}
      >
        <div className="card-badges-top">
          <span className="micro-icon-badge" title={`${t('detailStylePrefix')} ${styleLabel(lang, item.styleType)}`}>
            <Icon name={styleIconName(item.styleType)} />
          </span>
          {isAnimated ? (
            <span className="micro-icon-badge motion-badge" title={typeLabel(lang, 'animated')}>
              <Icon name="waveform" />
            </span>
          ) : (
            <span className="micro-badge">{item.gridSize || '24x24'}</span>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- immutable CDN SVG, no optimization needed */}
        <img
          src={item.assetUrl}
          alt={item.title}
          loading={index < 24 ? 'eager' : 'lazy'}
          fetchPriority={index < 12 ? 'high' : undefined}
          decoding="async"
          style={lottieReady ? { opacity: 0 } : undefined}
        />
        {hover && <HoverLottie collection={item.collectionSlug} slug={item.slug} onReady={setLottieReady} />}
      </Link>

      <Link className="icon-info-area" href={href} prefetch={false}>
        <div className="icon-name" title={item.title}>
          {item.title || item.slug}
        </div>
        <div className="icon-sub">
          {sub} · {item.collectionName}
        </div>
      </Link>

      <div className="icon-actions-bar">
        <button
          type="button"
          className="act-btn"
          title={t('copySvgTitle')}
          onClick={() => {
            void fetchSvg(item.assetUrl, t).then(async (svg) => {
              if (!svg) return;
              await navigator.clipboard.writeText(svg);
              showToast(t('toastSvgCopied'));
            });
          }}
        >
          SVG
        </button>
        <button
          type="button"
          className="act-btn"
          title={t('copyJsxTitle')}
          onClick={() => {
            const comp = toPascalCaseComponentName(item.slug || 'Icon');
            void fetchSvg(item.assetUrl, t).then(async (svg) => {
              if (!svg) return;
              await navigator.clipboard.writeText(svgToJsx(svg, comp));
              showToast(t('toastJsxCopied', { comp }));
            });
          }}
        >
          JSX
        </button>
        <a href={item.assetUrl} download={`${item.slug}.svg`} className="act-btn" title={t('downloadSvgTitle')}>
          <Icon name="download" />
        </a>
        <button
          type="button"
          className={`act-btn ${favorite ? 'fav-active' : ''}`}
          title={t('favoriteTitle')}
          onClick={() => toggleFavorite([openKey, `${item.site}:${openKey}`])}
        >
          <Icon name={favorite ? 'heartFilled' : 'heart'} />
        </button>
      </div>
    </article>
  );
}

export const IconCard = memo(IconCardBase);
