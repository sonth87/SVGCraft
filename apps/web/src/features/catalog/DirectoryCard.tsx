'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { DirectoryCard as DirectoryEntry } from '@svg-hub/catalog';
import { categoryLabel, type Lang, type Translate } from '../shared/bridge';
import { Icon, categoryIconName, styleIconName } from '../shared/icons';

function DirectoryCardBase({
  col,
  lang,
  t,
  categoryName,
}: {
  col: DirectoryEntry;
  lang: Lang;
  t: Translate;
  categoryName?: string;
}) {
  const label = categoryLabel(lang, col.primaryCategory, categoryName).split(' & ')[0];
  const samples = col.sampleIcons.slice(0, 8);
  return (
    <Link className="col-dir-card" href={`/collection/${encodeURIComponent(col.slug)}`} prefetch={false}>
      <div className="col-dir-preview-grid">
        {Array.from({ length: 8 }, (_, i) => {
          const ic = samples[i];
          return ic ? (
            <div key={ic.id} className="col-dir-thumb-cell" title={ic.title || ic.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element -- immutable CDN SVG */}
              <img src={ic.assetUrl} alt={ic.title || ic.slug} loading="lazy" decoding="async" />
            </div>
          ) : (
            <div key={`empty-${i}`} className="col-dir-thumb-cell" style={{ opacity: 0.25 }} />
          );
        })}
      </div>
      <div className="col-dir-info">
        <div className="col-dir-header-row">
          <div className="col-dir-title" title={col.name}>
            {col.name}
          </div>
          <span className="col-dir-count-pill">
            {(col.count || 0).toLocaleString('en-US')} {t('unitIcons')}
          </span>
        </div>
        <div className="col-dir-badges">
          <span className="col-dir-badge">
            <Icon name={categoryIconName(col.primaryCategory)} />
            <span>{label}</span>
          </span>
          <span className="col-dir-badge">
            <Icon name={styleIconName(col.primaryStyle)} />
            <span>{col.primaryStyle || 'outlined'}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export const DirectoryCard = memo(DirectoryCardBase);
