'use client';

/** Collection page: filters live in the URL, pages load by cursor. Navigation clicks are handled by app.js for now. */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { CollectionPayload } from '@/lib/collectionPage';
import {
  favoritesServerSnapshot,
  favoritesSnapshot,
  showToast,
  subscribeFavorites,
  useI18n,
} from '@/features/shared/bridge';
import { Icon, styleIconName } from '@/features/shared/icons';
import { IconCard } from './IconCard';

export interface CollectionFilters {
  q: string;
  styleType: string;
  category: string;
  sort: string;
}

const NO_FILTERS: CollectionFilters = { q: '', styleType: '', category: '', sort: 'az' };

export function readFiltersFromUrl(): CollectionFilters {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') ?? '',
    styleType: params.get('style') ?? '',
    category: params.get('category') ?? '',
    sort: params.get('sort') ?? 'az',
  };
}

function filtersToSearch(f: CollectionFilters): string {
  const params = new URLSearchParams();
  if (f.q) params.set('q', f.q);
  if (f.styleType) params.set('style', f.styleType);
  if (f.category) params.set('category', f.category);
  if (f.sort && f.sort !== 'az') params.set('sort', f.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

declare global {
  interface Window {
    /** What the detail page's prev/next walks through; read by app.js */
    svgcraftCollectionItems?: CollectionPayload['items'];
  }
}

interface CollectionViewProps {
  data: CollectionPayload;
  /** Filters `data` was fetched with; `null` for the server render, which is always the unfiltered first page */
  filters: CollectionFilters | null;
}

export default function CollectionView({ data, filters: initialFilters }: CollectionViewProps) {
  const { lang, t } = useI18n();
  const col = data.collection;
  const favorites = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesServerSnapshot);
  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const [filters, setFilters] = useState<CollectionFilters>(initialFilters ?? NO_FILTERS);
  const [searchText, setSearchText] = useState(filters.q);
  const [page, setPage] = useState({ items: data.items, total: data.total, nextCursor: data.nextCursor });
  const [loadingMore, setLoadingMore] = useState(false);
  const loadedKey = useRef(JSON.stringify(initialFilters ?? NO_FILTERS));

  const apiUrl = (f: CollectionFilters, cursor?: string | null) => {
    const params = new URLSearchParams({ q: f.q, styleType: f.styleType, category: f.category, sort: f.sort });
    if (cursor) params.set('cursor', cursor);
    return `/api/catalog/collection/any/${encodeURIComponent(col.slug)}?${params.toString()}`;
  };
  const fetchPage = async (url: string, signal?: AbortSignal) => {
    const res = await fetch(url, { signal, headers: { 'x-svgcraft-client': 'web-v2' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as CollectionPayload;
  };

  // A server-rendered page opened with filters in its URL
  useEffect(() => {
    if (initialFilters) return;
    const fromUrl = readFiltersFromUrl();
    setFilters(fromUrl);
    setSearchText(fromUrl.q);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first load only
  }, []);

  // Filter change → new first page, URL follows
  useEffect(() => {
    const key = JSON.stringify(filters);
    if (key === loadedKey.current) return;
    const ctrl = new AbortController();
    fetchPage(apiUrl(filters), ctrl.signal)
      .then((res) => {
        loadedKey.current = key;
        window.history.replaceState(
          { view: 'collection', collectionSlug: col.slug },
          '',
          `/collection/${encodeURIComponent(col.slug)}${filtersToSearch(filters)}`
        );
        setPage({ items: res.items, total: res.total, nextCursor: res.nextCursor });
      })
      .catch(() => {
        /* aborted by a newer filter, or a failed request: the current page stays */
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apiUrl is derived from filters and the slug
  }, [filters, col.slug]);

  // Search as you type
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = searchText.trim();
      setFilters((f) => (f.q === q ? f : { ...f, q }));
    }, 280);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Prev/next on the detail page walks the loaded items
  useEffect(() => {
    window.svgcraftCollectionItems = page.items;
    window.dispatchEvent(new Event('svgcraft:collection-items'));
  }, [page.items]);

  const loadMore = async () => {
    if (!page.nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetchPage(apiUrl(filters, page.nextCursor));
      // A deploy between pages invalidates the cursor and the server restarts at offset 0
      setPage((p) => ({
        items: res.offset === 0 ? res.items : [...p.items, ...res.items],
        total: res.total,
        nextCursor: res.nextCursor,
      }));
    } finally {
      setLoadingMore(false);
    }
  };

  const total = col.totalIconsInCollection || data.total || 0;
  const author = !col.author || /^(thesvg|svg\s*repo)$/i.test(String(col.author).trim()) ? 'Open Source' : col.author;

  return (
    <>
      <div className="detail-topbar">
        <div className="detail-breadcrumbs">
          <button type="button" className="btn-back-catalog" data-col-back="">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              id="colLocalSearchInput"
              value={searchText}
              placeholder={t('colSearchPlaceholder', { name: col.name })}
              autoComplete="off"
              onChange={(e) => setSearchText(e.target.value)}
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
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
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
              onClick={() => setFilters((f) => ({ ...f, styleType: '' }))}
            >
              <span>{t('colAllStyles', { count: total.toLocaleString('en-US') })}</span>
            </button>
            {col.stylesBreakdown.map((st) => (
              <button
                key={st.id}
                type="button"
                className={`pill-btn ${filters.styleType === st.id ? 'active' : ''}`}
                data-col-style={st.id}
                onClick={() => setFilters((f) => ({ ...f, styleType: st.id }))}
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
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              >
                <option value="az">{t('sortAz')}</option>
                <option value="za">{t('sortZa')}</option>
                <option value="recent">{t('sortRecent')}</option>
              </select>
            </div>
            <div className="results-counter">
              {t('showingPrefix')} <strong>{page.items.length.toLocaleString('en-US')}</strong> /{' '}
              <strong>{page.total.toLocaleString('en-US')}</strong>
            </div>
          </div>
        </div>
      </div>

      <div id="colIconsGrid" className="icons-grid">
        {page.items.length === 0 ? (
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
        ) : (
          page.items.map((item, index) => {
            const key = `${item.collectionSlug}:${item.id || item.slug}`;
            return (
              <IconCard
                key={key}
                item={item}
                index={index}
                favorite={favSet.has(key) || favSet.has(`${item.site}:${key}`)}
                lang={lang}
                t={t}
              />
            );
          })
        )}
      </div>

      {page.nextCursor && (
        <div className="load-more-wrap" style={{ display: 'flex' }}>
          <button type="button" id="btnColLoadMore" className="btn-load-more" disabled={loadingMore} onClick={loadMore}>
            <span>{t('colLoadMoreBtn', { shown: page.items.length, total: page.total })}</span>
          </button>
        </div>
      )}
    </>
  );
}
