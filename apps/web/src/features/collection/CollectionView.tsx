'use client';

/** Collection page: filters live in the URL, pages load by cursor, and the list survives a visit to an icon page. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { IconListItem } from '@svg-hub/catalog';
import type { CollectionPayload } from '@/lib/collectionPage';
import { apiJson } from '../shared/api';
import { favoritesServerSnapshot, favoritesSnapshot, showToast, subscribeFavorites, useI18n } from '../shared/bridge';
import { Icon, styleIconName } from '../shared/icons';
import { LineIcon } from '../shared/line-icons';
import {
  catalogReturnHref,
  restoreScroll,
  savedScroll,
  setNavList,
  useAppRouter,
  useSearch,
  writeUrl,
} from '../shared/nav';
import { IconCard } from '../catalog/IconCard';
import { usePagedList } from '../catalog/usePagedList';

interface CollectionFilters {
  q: string;
  styleType: string;
  category: string;
  sort: string;
}

const NO_FILTERS: CollectionFilters = { q: '', styleType: '', category: '', sort: 'az' };

function parseSearch(search: string): CollectionFilters {
  const params = new URLSearchParams(search);
  return {
    q: params.get('q') ?? '',
    styleType: params.get('style') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? 'az',
  };
}

function toSearch(f: CollectionFilters): string {
  const params = new URLSearchParams();
  if (f.q) params.set('q', f.q);
  if (f.styleType) params.set('style', f.styleType);
  if (f.category) params.set('category', f.category);
  if (f.sort && f.sort !== 'az') params.set('sort', f.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export default function CollectionView({ data }: { data: CollectionPayload }) {
  const { lang, t } = useI18n();
  const router = useAppRouter();
  const search = useSearch();
  const col = data.collection;
  const favorites = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesServerSnapshot);
  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const filters = useMemo(() => parseSearch(search), [search]);
  const key = JSON.stringify([col.slug, filters]);
  const list = usePagedList<IconListItem>({
    key,
    group: col.slug,
    initial: { key: JSON.stringify([col.slug, NO_FILTERS]), page: data },
    load: (cursor, signal, bypassCache) => {
      const params = new URLSearchParams({
        q: filters.q,
        styleType: filters.styleType,
        category: filters.category,
        sort: filters.sort,
      });
      if (cursor) params.set('cursor', cursor);
      return apiJson<CollectionPayload>(`/api/catalog/collection/any/${encodeURIComponent(col.slug)}?${params}`, {
        signal,
        bypassCache,
      });
    },
  });

  const setFilters = (patch: Partial<CollectionFilters>) =>
    writeUrl(`/collection/${encodeURIComponent(col.slug)}${toSearch({ ...filters, ...patch })}`, true);

  // Search as you type
  const [text, setText] = useState(filters.q);
  const lastQ = useRef(filters.q);
  useEffect(() => {
    lastQ.current = filters.q;
    setText(filters.q);
  }, [filters.q]);
  useEffect(() => {
    const q = text.trim();
    if (q === lastQ.current) return;
    const timer = setTimeout(() => setFilters({ q }), 280);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setFilters reads the latest filters when the debounce fires
  }, [text]);

  // Prev/next on the icon page walks what is loaded here
  useEffect(() => {
    setNavList(list.items);
  }, [list.items]);

  // Back from an icon: same pages, same scroll position
  const scrolled = useRef(false);
  useLayoutEffect(() => {
    if (scrolled.current || list.loading) return;
    scrolled.current = true;
    const y = savedScroll(`${window.location.pathname}${window.location.search}`);
    if (y !== undefined) restoreScroll(y);
  }, [list.loading]);

  const total = col.totalIconsInCollection || data.total || 0;
  const author = !col.author || /^(thesvg|svg\s*repo)$/i.test(String(col.author).trim()) ? 'Open Source' : col.author;

  return (
    <section id="collectionView" className="collection-view" aria-live="polite">
      <div className="detail-topbar">
        <div className="detail-breadcrumbs">
          <button type="button" className="btn-back-catalog" onClick={() => router.back(catalogReturnHref())}>
            <Icon name="arrowLeft" />
            <span>{t('colBackCatalog')}</span>
          </button>
          <span className="crumb-sep">
            <Icon name="chevronRight" />
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{t('colBreadcrumb')}</span>
          <span className="crumb-sep">
            <Icon name="chevronRight" />
          </span>
          <span className="crumb-current">{col.name}</span>
        </div>
        <div className="detail-nav-actions">
          <button
            type="button"
            className="icon-btn-square"
            title={t('colShareTitle')}
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href).then(() => showToast(t('toastColLinkCopied')));
            }}
          >
            <Icon name="share" />
          </button>
        </div>
      </div>

      <div className="collection-hero-banner">
        <div className="collection-hero-top">
          <div className="collection-title-wrap">
            <div className="collection-folder-badge">
              <Icon name="folder" />
            </div>
            <div>
              <h1 className="collection-h1">{col.name}</h1>
              <div className="collection-meta-pills">
                <span className="col-stat-pill">
                  {t('colStatCount')}{' '}
                  <strong>
                    {total.toLocaleString('en-US')} {t('unitIcons')}
                  </strong>
                </span>
                <span className="col-stat-pill">
                  {t('colStatLicense')} <strong>{col.license || 'MIT / CC0'}</strong>
                </span>
                <span className="col-stat-pill">
                  {t('colStatAuthor')} <strong>{author}</strong>
                </span>
                {col.gridSizes.length > 0 && (
                  <span className="col-stat-pill">
                    Grid: <strong>{col.gridSizes.slice(0, 3).join(', ')}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="collection-toolbar-bar">
          <div className="col-local-search">
            <LineIcon name="search" size={16} />
            <input
              type="search"
              id="colLocalSearchInput"
              value={text}
              placeholder={t('colSearchPlaceholder', { name: col.name })}
              autoComplete="off"
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {data.lordiconCategories.length > 0 && (
            <div className="lordicon-cat-select-wrap">
              <span className="icon-inline" style={{ color: 'var(--brand-orange)' }}>
                <Icon name="waveform" />
              </span>
              <select
                id="colLordiconCatSelect"
                aria-label={t('lordiconTopicLabel')}
                value={filters.category}
                onChange={(e) => setFilters({ category: e.target.value })}
              >
                <option value="">
                  {t('lordiconAllCategories')} ({total.toLocaleString('en-US')})
                </option>
                {data.lordiconCategories.map((lc) => (
                  <option key={lc.id} value={lc.id}>
                    {lang === 'vi' && lc.labelVi ? `${lc.label} (${lc.labelVi})` : lc.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-filter-pills-group">
            <button
              type="button"
              className={`pill-btn ${filters.styleType ? '' : 'active'}`}
              onClick={() => setFilters({ styleType: '' })}
            >
              <span>{t('colAllStyles', { count: total.toLocaleString('en-US') })}</span>
            </button>
            {col.stylesBreakdown.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`pill-btn ${filters.styleType === st.id ? 'active' : ''}`}
                onClick={() => setFilters({ styleType: st.id })}
              >
                <Icon name={styleIconName(st.id)} />
                <span>
                  {st.id} ({st.count})
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="sort-select-wrap">
              <select
                id="colSortSelect"
                aria-label={t('sortTitle')}
                value={filters.sort}
                onChange={(e) => setFilters({ sort: e.target.value })}
              >
                <option value="az">{t('sortAz')}</option>
                <option value="za">{t('sortZa')}</option>
                <option value="recent">{t('sortRecent')}</option>
              </select>
            </div>
            <div className="results-counter">
              {t('showingPrefix')} <strong>{list.items.length.toLocaleString('en-US')}</strong> /{' '}
              <strong>{list.total.toLocaleString('en-US')}</strong>
            </div>
          </div>
        </div>
      </div>

      <div
        id="colIconsGrid"
        className="icons-grid"
        style={list.loading && list.items.length > 0 ? { opacity: 0.55, transition: 'opacity 0.15s' } : undefined}
      >
        {!list.loading && list.items.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '48px 20px',
              color: 'var(--text-muted)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 14,
            }}
          >
            {t('colEmptySearch')}
          </div>
        )}
        {list.items.map((item, index) => {
          const itemKey = `${item.collectionSlug}:${item.id || item.slug}`;
          return (
            <IconCard
              key={itemKey}
              item={item}
              index={index}
              favorite={favSet.has(itemKey) || favSet.has(`${item.site}:${itemKey}`)}
              lang={lang}
              t={t}
            />
          );
        })}
      </div>

      {list.hasMore && (
        <div className="load-more-wrap" style={{ display: 'flex' }}>
          <button
            type="button"
            id="btnColLoadMore"
            className="btn-load-more"
            disabled={list.loadingMore}
            onClick={() => void list.loadMore()}
          >
            <span>{t('colLoadMoreBtn', { shown: list.items.length, total: list.total })}</span>
          </button>
        </div>
      )}
    </section>
  );
}
