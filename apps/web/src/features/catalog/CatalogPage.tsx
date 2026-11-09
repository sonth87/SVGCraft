'use client';

/** The home page: hero, filter bar, view modes, active filters and the icon / collection / brand grids. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { DirectoryCard as DirectoryEntry, IconListItem, Page } from '@svg-hub/catalog';
import { apiJson, clearApiCache } from '../shared/api';
import {
  categoryLabel,
  favoritesServerSnapshot,
  favoritesSnapshot,
  showToast,
  styleLabel,
  subscribeFavorites,
  typeLabel,
  useI18n,
  type MessageKey,
} from '../shared/bridge';
import { Icon, categoryIconName, styleIconName, typeIconName } from '../shared/icons';
import { LineIcon, type LineIconName } from '../shared/line-icons';
import { restoreScroll, savedScroll, setLastCatalogSearch, setNavList, useAppRouter, useSearch } from '../shared/nav';
import { useSummary } from '../shared/summary';
import { DirectoryCard } from './DirectoryCard';
import { IconCard } from './IconCard';
import {
  ANIMATED_STYLE_PACKS,
  DEFAULT_FILTERS,
  DEFAULT_STATE,
  isAnimatedContext,
  withViewMode,
  type CatalogFilters,
  type CatalogState,
} from './filters';
import { usePagedList, type PageLike } from './usePagedList';
import { useCatalogState } from './useCatalogState';

const PAGE_SIZE = 72;
const DIRECTORY_PAGE_SIZE = 36;
const ALPHABET = ['', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

type Item = IconListItem | DirectoryEntry;
type MenuId = 'style' | 'type' | 'collections';

const listKey = (s: CatalogState) => JSON.stringify([s.viewMode, s.filters]);

async function loadFavorites(filters: CatalogFilters): Promise<PageLike<IconListItem>> {
  const keys = (favoritesSnapshot() as string[]).slice().reverse();
  let items: IconListItem[] = [];
  if (keys.length) {
    const res = await fetch('/api/catalog/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-SVGCraft-Client': 'web-v2' },
      body: JSON.stringify({ keys }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    items = ((await res.json()) as { items: IconListItem[] }).items;
  }
  const q = filters.q.toLowerCase();
  if (q) items = items.filter((i) => `${i.title} ${i.slug}`.toLowerCase().includes(q));
  if (filters.letter) {
    items = items.filter((i) => {
      const first = (i.title || i.slug).charAt(0).toUpperCase();
      return filters.letter === '#' ? !/[A-Z]/.test(first) : first === filters.letter;
    });
  }
  return { items, total: items.length, offset: 0, nextCursor: null };
}

function FilterDropdown({
  open,
  onToggle,
  icon,
  label,
  hasValue,
  count,
  title,
  clearLabel,
  onClear,
  wide,
  id,
  children,
}: {
  open: boolean;
  onToggle(): void;
  icon: LineIconName;
  label: string;
  hasValue: boolean;
  count?: number;
  title: ReactNode;
  clearLabel: string;
  onClear(): void;
  wide?: boolean;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className={`filter-dropdown ${open ? 'open' : ''}`} id={id}>
      <button
        type="button"
        className={`filter-trigger ${hasValue ? 'has-value' : ''}`}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <LineIcon name={icon} size={15} />
        <span>{label}</span>
        {count !== undefined && <span className="trigger-count-pill">{count}</span>}
        <LineIcon name="chevron" size={14} className="chevron-icon" />
      </button>
      <div
        className={`dropdown-panel ${wide ? 'dropdown-panel-wide' : ''}`}
        role="menu"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dropdown-panel-header">
          <span>{title}</span>
          <button type="button" className="dropdown-clear-btn" onClick={onClear}>
            {clearLabel}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function CatalogPage({ initial }: { initial: Page<IconListItem> }) {
  const { lang, t } = useI18n();
  const { summary, collections, ensureCollections, reload: reloadSummary } = useSummary();
  const { state, go } = useCatalogState();
  const router = useAppRouter();
  const search = useSearch();
  const { viewMode, filters } = state;
  const isDirectory = viewMode !== 'icons';
  const favorites = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesServerSnapshot);
  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const key = listKey(state);
  const list = usePagedList<Item>({
    key,
    group: viewMode,
    initial: { key: listKey(DEFAULT_STATE), page: initial },
    cacheable: !filters.onlyFavorites,
    load: (cursor, signal, bypassCache) => {
      if (viewMode === 'icons') {
        if (filters.onlyFavorites) return loadFavorites(filters);
        const params = new URLSearchParams({
          q: filters.q,
          category: filters.category,
          styleType: filters.styleType,
          iconType: filters.iconType,
          collection: filters.collection,
          letter: filters.letter,
          sort: filters.sort,
          limit: String(PAGE_SIZE),
        });
        if (cursor) params.set('cursor', cursor);
        return apiJson<Page<IconListItem>>(`/api/catalog/icons?${params}`, { signal, bypassCache });
      }
      const params = new URLSearchParams({
        mode: viewMode,
        q: filters.q,
        category: filters.category,
        styleType: filters.styleType,
        iconType: filters.iconType,
        letter: filters.letter,
        sort: filters.sort === 'recent' ? 'count' : filters.sort,
        limit: String(DIRECTORY_PAGE_SIZE),
      });
      if (cursor) params.set('cursor', cursor);
      return apiJson<Page<DirectoryEntry>>(`/api/catalog/collections?${params}`, { signal, bypassCache });
    },
  });

  // What the icon page's prev/next walks, and where Escape / Back return to
  useEffect(() => {
    setLastCatalogSearch(search);
  }, [search]);
  useEffect(() => {
    if (!isDirectory) setNavList(list.items as IconListItem[]);
  }, [list.items, isDirectory]);

  // Back from an icon: same list, same scroll position
  const scrolled = useRef(false);
  useLayoutEffect(() => {
    if (scrolled.current || list.loading) return;
    scrolled.current = true;
    const y = savedScroll(`${window.location.pathname}${window.location.search}`);
    if (y !== undefined) restoreScroll(y);
  }, [list.loading]);

  // Infinite scroll
  const sentinel = useRef<HTMLDivElement>(null);
  const lastFetch = useRef(0);
  const loadMoreThrottled = () => {
    const now = Date.now();
    if (now - lastFetch.current < 650) return;
    lastFetch.current = now;
    void list.loadMore();
  };
  const loadMoreRef = useRef(loadMoreThrottled);
  loadMoreRef.current = loadMoreThrottled;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && loadMoreRef.current(),
      { rootMargin: '420px 0px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [list.hasMore, key]);

  // ---- Dropdowns
  const [menu, setMenu] = useState<MenuId | null>(null);
  const [colSearch, setColSearch] = useState('');
  const toggleMenu = (id: MenuId) => {
    setMenu((m) => (m === id ? null : id));
    if (id === 'collections') void ensureCollections();
  };
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  const setFilters = (patch: Partial<CatalogFilters>, options: { replace?: boolean } = {}) =>
    go({ viewMode, filters: { ...filters, ...patch } }, options);

  const animated = viewMode === 'icons' && isAnimatedContext(filters);
  const activePack = filters.collection.startsWith('lordicon-') ? filters.collection : '';
  const stripParen = (s: string) => s.split(' (')[0]!;

  const matchedCollections = useMemo(() => {
    const all = collections ?? [];
    const q = colSearch.trim().toLowerCase();
    return q ? all.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)) : all;
  }, [collections, colSearch]);

  const selectedStyle = summary.styles.find((s) => s.id === filters.styleType);
  const selectedType = summary.iconTypes.find((it) => it.id === filters.iconType);
  const selectedCollection = collections?.find((c) => c.slug === filters.collection);

  // ---- Chips
  const chips: { key: keyof CatalogFilters; label: string }[] = [];
  if (filters.category) {
    const cat = summary.categories.find((c) => c.id === filters.category);
    chips.push({
      key: 'category',
      label: `${t('chipCategory')}: ${categoryLabel(lang, filters.category, cat?.label)}`,
    });
  }
  if (filters.styleType) {
    chips.push({
      key: 'styleType',
      label: `${t('chipStyle')}: ${styleLabel(lang, filters.styleType, selectedStyle?.label)}`,
    });
  }
  if (filters.iconType && filters.iconType !== 'animated') {
    chips.push({
      key: 'iconType',
      label: `${t('chipType')}: ${typeLabel(lang, filters.iconType, selectedType?.label)}`,
    });
  }
  if (filters.collection) {
    chips.push({
      key: 'collection',
      label: `${t('chipCollection')}: ${selectedCollection?.name ?? filters.collection}`,
    });
  }
  if (filters.letter) chips.push({ key: 'letter', label: `${t('chipLetter')}: ${filters.letter}` });
  if (filters.q) chips.push({ key: 'q', label: `${t('chipKeyword')}: "${filters.q}"` });
  if (filters.onlyFavorites) chips.push({ key: 'onlyFavorites', label: t('chipFavorites') });

  const heading: MessageKey =
    viewMode === 'brands'
      ? 'heroHeadingBrands'
      : viewMode === 'collections'
        ? 'heroHeadingCollections'
        : animated
          ? 'heroHeadingAnimated'
          : 'heroHeadingIcons';
  const unit = t(viewMode === 'brands' ? 'unitBrands' : viewMode === 'collections' ? 'unitCollections' : 'unitIcons');

  // ---- Refresh
  const [syncing, setSyncing] = useState(false);
  const lastSync = useRef(0);
  const refresh = async () => {
    const now = Date.now();
    if (syncing || now - lastSync.current < 5000) return;
    lastSync.current = now;
    setSyncing(true);
    try {
      clearApiCache();
      await reloadSummary();
      list.reload();
      showToast(t('toastSynced', { count: summary.totalIcons.toLocaleString('en-US') }));
    } finally {
      setSyncing(false);
    }
  };

  const option = (active: boolean, icon: string, label: string, count: number, onClick: () => void, extra?: string) => (
    <button
      key={extra ?? label}
      type="button"
      className={`dropdown-option ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="dropdown-option-left">
        <span className="nav-icon">
          <Icon name={icon} />
        </span>
        <span className="dropdown-option-title" title={label}>
          {label}
        </span>
      </span>
      <span className="nav-count">{count.toLocaleString('en-US')}</span>
    </button>
  );

  const viewTab = (mode: 'icons' | 'collections' | 'brands', icon: LineIconName, label: string) => (
    <button
      type="button"
      className={`view-mode-btn ${viewMode === mode ? 'active' : ''}`}
      role="tab"
      aria-selected={viewMode === mode}
      onClick={() => go(withViewMode(state, mode, false))}
    >
      <LineIcon name={icon} size={14} />
      <span>{label}</span>
    </button>
  );

  const resetAll = (keepViewMode: boolean) => go(keepViewMode ? { viewMode, filters: DEFAULT_FILTERS } : DEFAULT_STATE);
  const gridClass = isDirectory ? 'collections-directory-grid' : 'icons-grid';

  return (
    <section id="catalogView" className="catalog-view">
      <div className="hero-bar">
        <div className="hero-copy">
          <h1 className="hero-title">{t(heading)}</h1>
          <p className="hero-sub" dangerouslySetInnerHTML={{ __html: t('heroSubheading') }} />
        </div>

        <div className="filter-bar-controls">
          <FilterDropdown
            id="dropdownStyle"
            open={menu === 'style'}
            onToggle={() => toggleMenu('style')}
            icon="palette"
            label={
              selectedStyle
                ? stripParen(styleLabel(lang, selectedStyle.id, selectedStyle.label))
                : t('styleTriggerDefault')
            }
            hasValue={Boolean(filters.styleType)}
            title={t('styleHeader')}
            clearLabel={t('clearSelection')}
            onClear={() => {
              setMenu(null);
              setFilters({ styleType: '' });
            }}
          >
            <div className="dropdown-options-list">
              {summary.styles.map((s) =>
                option(
                  filters.styleType === s.id,
                  styleIconName(s.id),
                  styleLabel(lang, s.id, s.label),
                  s.count,
                  () => {
                    setMenu(null);
                    setFilters({ styleType: filters.styleType === s.id ? '' : s.id });
                  },
                  s.id
                )
              )}
            </div>
          </FilterDropdown>

          <FilterDropdown
            id="dropdownIconType"
            open={menu === 'type'}
            onToggle={() => toggleMenu('type')}
            icon="pen"
            label={selectedType ? typeLabel(lang, selectedType.id, selectedType.label) : t('iconTypeTriggerDefault')}
            hasValue={Boolean(filters.iconType)}
            title={t('iconTypeHeader')}
            clearLabel={t('clearSelection')}
            onClear={() => {
              setMenu(null);
              setFilters({ iconType: '' });
            }}
          >
            <div className="dropdown-options-list">
              {summary.iconTypes.map((it) =>
                option(
                  filters.iconType === it.id,
                  typeIconName(it.id),
                  typeLabel(lang, it.id, it.label),
                  it.count,
                  () => {
                    setMenu(null);
                    setFilters({ iconType: filters.iconType === it.id ? '' : it.id });
                  },
                  it.id
                )
              )}
            </div>
          </FilterDropdown>

          <FilterDropdown
            id="dropdownCollections"
            wide
            open={menu === 'collections'}
            onToggle={() => toggleMenu('collections')}
            icon="folder"
            label={
              selectedCollection
                ? selectedCollection.name.length > 20
                  ? `${selectedCollection.name.slice(0, 18)}…`
                  : selectedCollection.name
                : t('collectionsTriggerDefault')
            }
            hasValue={Boolean(filters.collection)}
            count={summary.totalCollections}
            title={
              <>
                {t('collectionsHeader')} (<strong>{matchedCollections.length}</strong>)
              </>
            }
            clearLabel={t('clearSelection')}
            onClear={() => {
              setMenu(null);
              setColSearch('');
              setFilters({ collection: '' });
            }}
          >
            <div className="dropdown-search-wrap">
              <LineIcon name="search" size={14} />
              <input
                type="search"
                value={colSearch}
                placeholder={t('collectionSearchPlaceholder')}
                autoComplete="off"
                autoFocus={menu === 'collections'}
                onChange={(e) => setColSearch(e.target.value)}
              />
            </div>
            <div className="dropdown-options-list scroller collection-scroll-list">
              {collections === null && (
                <div
                  style={{ padding: '14px 10px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.78rem' }}
                >
                  {t('loadingPage')}
                </div>
              )}
              {collections !== null && matchedCollections.length === 0 && (
                <div
                  style={{ padding: '14px 10px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.78rem' }}
                >
                  {t('noCollectionsFound')}
                </div>
              )}
              {matchedCollections.slice(0, 150).map((col) =>
                option(
                  false,
                  'folder',
                  col.name,
                  col.count,
                  () => {
                    setMenu(null);
                    router.push(`/collection/${encodeURIComponent(col.slug)}`);
                  },
                  col.slug
                )
              )}
            </div>
          </FilterDropdown>

          <div className="sort-select-wrap">
            <LineIcon name="sort" size={14} />
            <select
              aria-label={t('sortTitle')}
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value })}
            >
              <option value="recent">{t('sortRecent')}</option>
              <option value="az">{t('sortAz')}</option>
              <option value="za">{t('sortZa')}</option>
            </select>
          </div>

          <button
            type="button"
            id="btnReloadCatalog"
            className="filter-trigger"
            title={t('reloadBtnTitle')}
            disabled={syncing}
            onClick={refresh}
          >
            <LineIcon name="refresh" size={14} className={syncing ? 'spin-anim' : undefined} />
            <span>{syncing ? t('reloadingText') : t('reloadBtnText')}</span>
          </button>
        </div>
      </div>

      <div className="toolbar-row">
        <div className="toolbar-left-group">
          <div className="view-mode-switcher" role="tablist" aria-label="View mode">
            {viewTab('icons', 'grid', t('tabIcons'))}
            {viewTab('collections', 'folder', t('tabCollections'))}
            {viewTab('brands', 'brands', t('tabBrands'))}
          </div>
          <div className="alphabet-bar" role="group" aria-label="Filter by first letter">
            {ALPHABET.map((ch) => (
              <button
                key={ch || 'all'}
                type="button"
                className={`alpha-btn ${filters.letter === ch ? 'active' : ''}`}
                onClick={() => setFilters({ letter: ch })}
              >
                {ch === '' ? t('resetAll') : ch}
              </button>
            ))}
          </div>
        </div>
        <div className="results-counter">
          {t('showingPrefix')} <strong>{list.items.length.toLocaleString('en-US')}</strong> /{' '}
          <strong>{list.total.toLocaleString('en-US')}</strong> <span>{unit}</span>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="active-filters-bar" style={{ display: 'flex' }}>
          {chips.map((c) => (
            <span key={c.key} className="filter-tag">
              <span>{c.label}</span>
              <button
                type="button"
                title={t('removeFilterTag')}
                onClick={() => setFilters({ [c.key]: c.key === 'onlyFavorites' ? false : '' })}
              >
                <Icon name="close" />
              </button>
            </span>
          ))}
          <button
            type="button"
            className="pill-btn"
            style={{ fontSize: '0.74rem', padding: '4px 10px' }}
            onClick={() => resetAll(false)}
          >
            {t('clearAllFilters')}
          </button>
        </div>
      )}

      {animated && (
        <div className="lordicon-category-bar" style={{ display: 'flex' }}>
          <span className="lordicon-row-badge">
            <span className="icon-inline">
              <Icon name="sliders" />
            </span>
            <span>{t('stylePackLabel')}</span>
          </span>
          <div className="lordicon-cat-pills">
            <button
              type="button"
              className={`pill-btn ${!activePack ? 'active' : ''}`}
              onClick={() => setFilters({ iconType: 'animated', collection: '' })}
            >
              <span>{t('allStylesLabel')}</span>
            </button>
            {ANIMATED_STYLE_PACKS.map((pk) => (
              <button
                key={pk.slug}
                type="button"
                className={`pill-btn ${activePack === pk.slug ? 'active' : ''}`}
                onClick={() => setFilters({ iconType: 'animated', collection: activePack === pk.slug ? '' : pk.slug })}
              >
                <span className="icon-inline">
                  <Icon name={styleIconName(pk.styleType)} />
                </span>
                <span>{pk.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={gridClass}
        id={isDirectory ? 'collectionsDirectoryGrid' : 'iconsGrid'}
        style={list.loading && list.items.length > 0 ? { opacity: 0.55, transition: 'opacity 0.15s' } : undefined}
      >
        {!list.loading && !list.failed && list.items.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '56px 20px',
              color: 'var(--text-muted)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                padding: 12,
                borderRadius: 12,
                background: 'var(--bg-card)',
                marginBottom: 10,
                color: 'var(--brand-orange)',
              }}
            >
              <Icon name={isDirectory ? (viewMode === 'brands' ? 'hexagon' : 'folder') : 'sparkles'} />
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
              {isDirectory ? t('emptyColsTitle', { unit }) : t('emptyIconsTitle')}
            </p>
            <p style={{ fontSize: '0.83rem', marginBottom: 16 }}>
              {isDirectory ? t('emptyColsDesc') : t('emptyIconsDesc')}
            </p>
            <button type="button" className="pill-btn active" onClick={() => resetAll(isDirectory)}>
              {t('resetFiltersBtn')}
            </button>
          </div>
        )}
        {list.failed && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
            <button type="button" className="pill-btn active" onClick={list.reload}>
              {t('reloadBtnText')}
            </button>
          </div>
        )}
        {isDirectory
          ? (list.items as DirectoryEntry[]).map((col) => (
              <DirectoryCard
                key={col.slug}
                col={col}
                lang={lang}
                t={t}
                categoryName={summary.categories.find((c) => c.id === col.primaryCategory)?.label}
              />
            ))
          : (list.items as IconListItem[]).map((item, index) => {
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
        <div ref={sentinel} className="load-more-wrap" style={{ display: 'flex' }}>
          <button
            type="button"
            className="btn-load-more"
            disabled={list.loadingMore}
            onClick={() => void list.loadMore()}
          >
            <LineIcon name="chevron" size={16} />
            <span>
              {list.loadingMore
                ? isDirectory
                  ? t('loadingMoreItems', { unit })
                  : t('loadingMoreIcons')
                : t('scrollLoadMore', {
                    shown: list.items.length.toLocaleString('en-US'),
                    total: list.total.toLocaleString('en-US'),
                    unit,
                  })}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
