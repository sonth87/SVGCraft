'use client';

/** Card in an icon grid. Opening the icon and the hover animation are delegated to app.js through `data-*` for now. */
import { memo } from 'react';
import { svgToJsx, toPascalCaseComponentName } from '@svg-hub/svg-tools';
import type { IconListItem } from '@svg-hub/catalog';
import { showToast, styleLabel, toggleFavorite, typeLabel, type Lang, type Translate } from '@/features/shared/bridge';
import { Icon, styleIconName } from '@/features/shared/icons';

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

function IconCardBase({ item, index, favorite, lang, t }: IconCardProps) {
  const id = item.id || item.slug;
  const openKey = `${item.collectionSlug}:${id}`;
  const href = `/icon/${encodeURIComponent(item.collectionSlug)}/${encodeURIComponent(id)}`;
  const isLordicon = item.site === 'lordicon' || item.collectionSlug.startsWith('lordicon-');
  const isAnimated = isLordicon || item.iconType === 'animated' || item.site === 'allsvgicons';
  const sub = isLordicon ? item.lordiconCategory || item.category : item.category;

  return (
    <article className="icon-card" data-icon-card={openKey}>
      <a
        className="icon-preview-area"
        href={href}
        data-open-detail={openKey}
        data-lordicon-col={isLordicon ? item.collectionSlug : undefined}
        data-lordicon-slug={isLordicon ? item.slug : undefined}
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
        />
      </a>

      <a className="icon-info-area" href={href} data-open-detail={openKey}>
        <div className="icon-name" title={item.title}>
          {item.title || item.slug}
        </div>
        <div className="icon-sub">
          {sub} · {item.collectionName}
        </div>
      </a>

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
