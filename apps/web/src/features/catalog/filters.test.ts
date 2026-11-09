import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTERS,
  DEFAULT_STATE,
  catalogHref,
  catalogLink,
  isAnimatedContext,
  isDefaultState,
  parseCatalogSearch,
  withViewMode,
} from './filters';

describe('catalog URL', () => {
  it('the empty URL is the default state', () => {
    expect(parseCatalogSearch('')).toEqual(DEFAULT_STATE);
    expect(catalogHref(DEFAULT_STATE)).toBe('/');
    expect(isDefaultState(DEFAULT_STATE)).toBe(true);
  });

  it('round-trips every filter', () => {
    const state = {
      viewMode: 'icons' as const,
      filters: {
        q: 'arrow left',
        category: 'interface',
        styleType: 'outlined',
        iconType: 'ui-icon',
        collection: 'lordicon-system-outline',
        letter: 'A',
        sort: 'az',
        onlyFavorites: true,
      },
    };
    const href = catalogHref(state);
    expect(href).toBe(
      '/?q=arrow+left&category=interface&style=outlined&type=ui-icon&collection=lordicon-system-outline&letter=A&sort=az&fav=1'
    );
    expect(parseCatalogSearch(href.slice(1))).toEqual(state);
  });

  it('keeps the old URL forms working', () => {
    // `lordicon:` prefix on category links from earlier versions
    expect(parseCatalogSearch('?category=lordicon:popular').filters.category).toBe('popular');
    expect(parseCatalogSearch('?view=nonsense').viewMode).toBe('icons');
  });

  it('directory modes drop the filters they cannot apply', () => {
    const brands = parseCatalogSearch('?view=brands&type=animated&style=filled&collection=x&fav=1&q=goo&category=ai');
    expect(brands.viewMode).toBe('brands');
    expect(brands.filters).toMatchObject({
      iconType: '',
      styleType: '',
      collection: '',
      onlyFavorites: false,
      q: 'goo',
      category: 'ai',
    });
    const collections = parseCatalogSearch('?view=collections&collection=x&fav=1&type=animated');
    expect(collections.filters).toMatchObject({ collection: '', onlyFavorites: false, iconType: 'animated' });
  });

  it('builds links from the detail page on top of the defaults', () => {
    expect(catalogLink({ category: 'animals' })).toBe('/?category=animals');
    expect(catalogLink({ q: 'home' })).toBe('/?q=home');
  });
});

describe('view modes', () => {
  const state = {
    viewMode: 'icons' as const,
    filters: { ...DEFAULT_FILTERS, q: 'x', category: 'ai', collection: 'c', onlyFavorites: true },
  };

  it('sidebar entries reset the taxonomy but keep the search text', () => {
    const next = withViewMode(state, 'collections', true);
    expect(next).toEqual({ viewMode: 'collections', filters: { ...DEFAULT_FILTERS, q: 'x' } });
  });

  it('switching tabs only clears what the mode cannot use', () => {
    const brands = withViewMode(
      { ...state, filters: { ...state.filters, iconType: 'animated', styleType: 'filled' } },
      'brands',
      false
    );
    expect(brands.filters).toMatchObject({
      category: 'ai',
      q: 'x',
      collection: '',
      onlyFavorites: false,
      iconType: '',
      styleType: '',
    });
    const icons = withViewMode(state, 'icons', false);
    expect(icons.filters.collection).toBe('c');
  });

  it('knows the animated context', () => {
    expect(isAnimatedContext({ ...DEFAULT_FILTERS, iconType: 'animated' })).toBe(true);
    expect(isAnimatedContext({ ...DEFAULT_FILTERS, collection: 'lordicon-wired-flat' })).toBe(true);
    expect(isAnimatedContext(DEFAULT_FILTERS)).toBe(false);
  });
});
