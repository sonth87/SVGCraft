/** Catalog filters and view mode, and their URL form (`/?q=…&category=…&view=collections`). Pure functions. */

export type ViewMode = 'icons' | 'collections' | 'brands';

export interface CatalogFilters {
  q: string;
  category: string;
  styleType: string;
  iconType: string;
  collection: string;
  letter: string;
  sort: string;
  onlyFavorites: boolean;
}

export interface CatalogState {
  viewMode: ViewMode;
  filters: CatalogFilters;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  q: '',
  category: '',
  styleType: '',
  iconType: '',
  collection: '',
  letter: '',
  sort: 'recent',
  onlyFavorites: false,
};

export const DEFAULT_STATE: CatalogState = { viewMode: 'icons', filters: DEFAULT_FILTERS };

export function parseCatalogSearch(search: string): CatalogState {
  const params = new URLSearchParams(search);
  const view = params.get('view');
  const viewMode: ViewMode = view === 'collections' || view === 'brands' ? view : 'icons';
  const filters: CatalogFilters = {
    q: params.get('q') || '',
    category: (params.get('category') || '').replace(/^lordicon:/, ''),
    styleType: params.get('style') || '',
    iconType: params.get('type') || '',
    collection: params.get('collection') || '',
    letter: params.get('letter') || '',
    sort: params.get('sort') || 'recent',
    onlyFavorites: params.get('fav') === '1',
  };
  if (viewMode === 'brands') {
    filters.iconType = '';
    filters.styleType = '';
    filters.collection = '';
    filters.onlyFavorites = false;
  } else if (viewMode === 'collections') {
    filters.collection = '';
    filters.onlyFavorites = false;
  }
  return { viewMode, filters };
}

export function catalogHref({ viewMode, filters: f }: CatalogState): string {
  const params = new URLSearchParams();
  if (viewMode !== 'icons') params.set('view', viewMode);
  if (f.q) params.set('q', f.q);
  if (f.category) params.set('category', f.category);
  if (f.styleType) params.set('style', f.styleType);
  if (f.iconType) params.set('type', f.iconType);
  if (f.collection) params.set('collection', f.collection);
  if (f.letter) params.set('letter', f.letter);
  if (f.sort && f.sort !== 'recent') params.set('sort', f.sort);
  if (f.onlyFavorites) params.set('fav', '1');
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

/** Href of the catalog with some filters set on top of the defaults (links from the detail page). */
export const catalogLink = (filters: Partial<CatalogFilters>): string =>
  catalogHref({ viewMode: 'icons', filters: { ...DEFAULT_FILTERS, ...filters } });

export const isDefaultState = (s: CatalogState): boolean => catalogHref(s) === '/';

/** Switch view mode. `reset` clears the taxonomy filters (sidebar entries), otherwise only the ones the mode cannot use. */
export function withViewMode(state: CatalogState, viewMode: ViewMode, reset: boolean): CatalogState {
  const filters = { ...state.filters };
  if (reset) {
    Object.assign(filters, {
      category: '',
      styleType: '',
      iconType: '',
      collection: '',
      letter: '',
      onlyFavorites: false,
    });
  } else {
    if (viewMode !== 'icons') Object.assign(filters, { onlyFavorites: false, collection: '' });
    if (viewMode === 'brands') Object.assign(filters, { iconType: '', styleType: '' });
  }
  return { viewMode, filters };
}

/** Animated-icons context: the Lordicon style packs row and animated category counts apply. */
export const isAnimatedContext = (f: CatalogFilters): boolean =>
  f.iconType === 'animated' || f.collection.startsWith('lordicon-');

export const ANIMATED_STYLE_PACKS = [
  { slug: 'lordicon-wired-outline', label: 'Wired Outline', styleType: 'duotone' },
  { slug: 'lordicon-wired-flat', label: 'Wired Flat', styleType: 'multicolor' },
  { slug: 'lordicon-wired-lineal', label: 'Wired Lineal', styleType: 'multicolor' },
  { slug: 'lordicon-wired-gradient', label: 'Wired Gradient', styleType: 'multicolor' },
  { slug: 'lordicon-doodle-color', label: 'Doodle Color', styleType: 'multicolor' },
  { slug: 'lordicon-doodle-motif', label: 'Doodle Motif', styleType: 'duotone' },
  { slug: 'lordicon-doodle-outline', label: 'Doodle Outline', styleType: 'outlined' },
  { slug: 'lordicon-doodle-black', label: 'Doodle Black', styleType: 'filled' },
  { slug: 'lordicon-system-outline', label: 'System Outline', styleType: 'outlined' },
  { slug: 'lordicon-system-solid', label: 'System Solid', styleType: 'filled' },
] as const;
