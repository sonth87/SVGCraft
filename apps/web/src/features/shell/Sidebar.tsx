'use client';

import { useSyncExternalStore } from 'react';
import {
  categoryLabel,
  favoritesServerSnapshot,
  favoritesSnapshot,
  subscribeFavorites,
  useI18n,
} from '../shared/bridge';
import { Icon, categoryIconName } from '../shared/icons';
import { LineIcon, type LineIconName } from '../shared/line-icons';
import { useSummary } from '../shared/summary';
import { DEFAULT_STATE, isAnimatedContext, withViewMode } from '../catalog/filters';
import { useCatalogState } from '../catalog/useCatalogState';

export default function Sidebar() {
  const { lang, t } = useI18n();
  const { summary } = useSummary();
  const { state, go, onCatalog } = useCatalogState();
  const { viewMode, filters } = state;
  const favorites = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesServerSnapshot);

  const animated =
    onCatalog &&
    viewMode === 'icons' &&
    !filters.onlyFavorites &&
    (isAnimatedContext(filters) || filters.category.startsWith('lordicon:'));
  const isAll =
    onCatalog &&
    viewMode === 'icons' &&
    !filters.category &&
    !filters.styleType &&
    !filters.iconType &&
    !filters.collection &&
    !filters.onlyFavorites;
  const animatedCount =
    summary.iconTypes.find((it) => it.id === 'animated')?.count ??
    summary.categories.find((c) => c.id === 'animation')?.count ??
    0;

  const lordiconCounts = new Map(summary.lordiconCategories.map((lc) => [lc.id, lc.count]));
  const animContext = onCatalog && viewMode === 'icons' && !filters.onlyFavorites && isAnimatedContext(filters);
  const brandsContext = onCatalog && viewMode === 'brands';
  const categories = summary.categories
    .filter((c) => c.id !== 'animation')
    .map((c) => {
      let count = c.count;
      if (animContext) count = c.animatedCount ?? lordiconCounts.get(c.id) ?? 0;
      else if (brandsContext && c.brandCount !== undefined) count = c.brandCount;
      return { ...c, modeCount: count };
    })
    .filter((c) => c.modeCount > 0 || filters.category === c.id);

  const item = (
    id: string,
    icon: LineIconName,
    label: string,
    active: boolean,
    count: number | null,
    onClick: () => void
  ) => (
    <button type="button" className={`nav-item ${active ? 'active' : ''}`} id={id} onClick={onClick}>
      <span className="nav-item-left">
        <span className="nav-icon">
          <LineIcon name={icon} />
        </span>
        <span>{label}</span>
      </span>
      {count !== null && <span className="nav-count">{count.toLocaleString('en-US')}</span>}
    </button>
  );

  return (
    <aside className="sidebar scroller" aria-label="SVG Categories">
      <div className="sidebar-section">
        <div className="sidebar-heading">{t('exploreHeading')}</div>
        {item('navAllIcons', 'grid', t('navAllIcons'), isAll, null, () => go(DEFAULT_STATE))}
        {item(
          'navCollectionsDirectory',
          'folder',
          t('navCollections'),
          onCatalog && viewMode === 'collections' && !filters.onlyFavorites,
          summary.totalCollections,
          () => go(withViewMode(state, 'collections', true))
        )}
        {item(
          'navBrandsDirectory',
          'brands',
          t('navBrands'),
          onCatalog && viewMode === 'brands' && !filters.onlyFavorites,
          summary.totalBrands || 49,
          () => go(withViewMode(state, 'brands', true))
        )}
        {item('navAnimatedIcons', 'activity', t('navAnimated'), animated, animatedCount, () =>
          go({
            viewMode: 'icons',
            filters: {
              ...filters,
              category: '',
              styleType: '',
              collection: '',
              onlyFavorites: false,
              iconType: filters.iconType === 'animated' ? '' : 'animated',
            },
          })
        )}
        {item('navFavorites', 'heart', t('navFavorites'), onCatalog && filters.onlyFavorites, favorites.length, () =>
          go({
            viewMode: 'icons',
            filters: {
              ...filters,
              category: '',
              styleType: '',
              iconType: '',
              collection: '',
              onlyFavorites: !filters.onlyFavorites,
            },
          })
        )}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading-row">
          <span className="sidebar-heading">{t('categoriesHeading')}</span>
          {filters.category && (
            <button
              type="button"
              id="btnResetCategory"
              className="sidebar-mini-reset"
              style={{ display: 'inline-block' }}
              title={t('resetAll')}
              onClick={() => go({ viewMode, filters: { ...filters, category: '' } })}
            >
              {t('resetAll')}
            </button>
          )}
        </div>
        <div id="sidebarCategories" className="sidebar-list">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`nav-item ${filters.category === c.id ? 'active' : ''}`}
              data-filter-cat={c.id}
              onClick={() =>
                go({
                  viewMode: viewMode === 'brands' ? 'icons' : viewMode,
                  filters: {
                    ...filters,
                    collection: filters.collection.startsWith('lordicon-cat-') ? '' : filters.collection,
                    category: filters.category === c.id ? '' : c.id,
                  },
                })
              }
            >
              <span className="nav-item-left">
                <span className="nav-icon">
                  <Icon name={categoryIconName(c.id)} />
                </span>
                <span>{categoryLabel(lang, c.id, c.label)}</span>
              </span>
              <span className="nav-count">{c.modeCount.toLocaleString('en-US')}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
