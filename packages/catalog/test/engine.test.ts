import { describe, expect, it } from 'vitest';
import {
  CatalogIndex,
  buildCatalogIndex,
  decodeContainer,
  encodeContainer,
  intersectSorted,
  serializeCollectionFile,
  tokenize,
  unionSorted,
  type CatalogCollectionFile,
  type CatalogIconRecord,
  type TaxonomyInput,
} from '../src';

const taxonomy: TaxonomyInput = {
  categories: [
    { id: 'interface', label: 'Interface' },
    { id: 'brand', label: 'Brand' },
    { id: 'popular', label: 'Popular' },
  ],
  lordiconCategories: [{ id: 'popular', label: 'Popular', appCategory: 'popular' }],
  styles: [
    { id: 'outlined', label: 'Outlined' },
    { id: 'filled', label: 'Filled' },
  ],
  iconTypes: [
    { id: 'ui-icon', label: 'UI' },
    { id: 'animated', label: 'Animated' },
    { id: 'brand-logo', label: 'Brand' },
  ],
  sites: [
    { id: 'svgrepo', label: 'Vector Pack' },
    { id: 'thesvg', label: 'Brand Pack' },
    { id: 'allsvgicons', label: 'Motion Pack' },
    { id: 'lordicon', label: 'Interactive Motion' },
  ],
  brands: [
    { slug: 'family-google', name: 'Google', primaryCategory: 'brand', tier: 1, regex: /\b(google|gmail)\b/i },
    { slug: 'ui-alias', name: 'UI Alias', tier: 2, exactCol: 'ui-pack' },
  ],
  strictBrandCollections: [],
  categoryAliases: { finance: 'business-and-finance' },
};

let clock = Date.parse('2026-01-01T00:00:00Z');
const icon = (
  over: Partial<CatalogIconRecord> & Pick<CatalogIconRecord, 'id' | 'slug' | 'title'>
): CatalogIconRecord => ({
  cat: 'interface',
  style: 'outlined',
  type: 'ui-icon',
  grid: '24x24',
  // Later in the fixture = more recent
  at: new Date((clock += 1000)).toISOString(),
  ...over,
});

const uiPack: CatalogCollectionFile = {
  site: 'svgrepo',
  slug: 'ui-pack',
  name: 'UI Pack',
  author: 'Jane',
  license: 'MIT',
  updatedAt: '2026-02-01T00:00:00Z',
  count: 5,
  icons: [
    icon({ id: '1', slug: 'arrow-left', title: 'Arrow Left', tags: ['arrow', 'direction'] }),
    icon({ id: '2', slug: 'left-arrow-key', title: 'Keyboard', tags: ['left', 'arrow', 'key'] }),
    icon({ id: '3', slug: 'home', title: 'Home', style: 'filled', tags: ['house'] }),
    icon({ id: '4', slug: 'home', title: 'Home', tags: ['house'], raw: 'all' }),
    icon({ id: '5', slug: 'smartphone', title: 'Smartphone', grid: '16x16', tags: ['phone', 'device'] }),
  ],
};
const brands: CatalogCollectionFile = {
  site: 'thesvg',
  slug: 'family-google',
  name: 'Google Family',
  author: 'theSVG',
  license: 'Brand',
  updatedAt: '2026-01-15T00:00:00Z',
  count: 2,
  icons: [
    icon({ id: 'gmail', slug: 'gmail', title: 'Gmail', cat: 'brand', type: 'brand-logo', style: 'filled' }),
    icon({
      id: 'gdrive',
      slug: 'google-drive',
      title: 'Google Drive',
      cat: 'brand',
      type: 'brand-logo',
      files: { default: 'google-drive.svg', dark: 'google-drive.dark.svg' },
      hash: { default: 'aaaabbbbccccdddd' },
    }),
  ],
};
const otherBrands: CatalogCollectionFile = {
  site: 'thesvg',
  slug: 'misc-logos',
  name: 'Misc Logos',
  author: 'theSVG',
  license: 'Brand',
  updatedAt: '2026-01-10T00:00:00Z',
  count: 1,
  icons: [icon({ id: 'g1', slug: 'google-maps', title: 'Google Maps', cat: 'brand', type: 'brand-logo' })],
};
const lordicon: CatalogCollectionFile = {
  site: 'lordicon',
  slug: 'lordicon-system-outline',
  name: 'System — Outline',
  author: 'Open Source',
  license: 'MIT / CC0',
  updatedAt: '2026-01-05T00:00:00Z',
  count: 1,
  icons: [
    icon({ id: '19', slug: '19-magnifier', title: 'Magnifier', cat: 'popular', lc: 'popular', type: 'animated' }),
  ],
};

const built = buildCatalogIndex([uiPack, brands, otherBrands, lordicon], taxonomy, { buildId: 'test' });
const readDetails = (s: number, e: number) => built.details.subarray(s, e);
const idx = CatalogIndex.fromBytes(built.index, { readDetails });
const titles = (r: { items: { title: string }[] }) => r.items.map((i) => i.title);
const ids = (r: { items: { id: string }[] }) => r.items.map((i) => i.id);

describe('postings', () => {
  it('tokenizes on any non letter/digit', () => {
    expect(tokenize('Arrow-Left_2 Café')).toEqual(['arrow', 'left', '2', 'café']);
  });
  it('intersects and unions sorted lists', () => {
    const a = Uint32Array.from([1, 3, 5, 7, 9]);
    const b = Uint32Array.from([3, 4, 5, 9, 12]);
    expect([...intersectSorted([a, b])]).toEqual([3, 5, 9]);
    expect([...unionSorted([a, b], 13)]).toEqual([1, 3, 4, 5, 7, 9, 12]);
    expect([...intersectSorted([a, new Uint32Array(0)])]).toEqual([]);
  });
});

describe('container', () => {
  it('round-trips header and aligned sections', () => {
    const bytes = encodeContainer(
      { hello: 'world' },
      { a: Uint8Array.from([1, 2, 3]), b: Uint32Array.from([7, 8]), c: Uint16Array.from([9]) }
    );
    // Simulate an unaligned Buffer slice
    const shifted = new Uint8Array(bytes.length + 1);
    shifted.set(bytes, 1);
    const box = decodeContainer<{ hello: string }>(shifted.subarray(1));
    expect(box.header.hello).toBe('world');
    expect([...box.u8('a')]).toEqual([1, 2, 3]);
    expect([...box.u32('b')]).toEqual([7, 8]);
    expect([...box.u16('c')]).toEqual([9]);
  });
});

describe('serializeCollectionFile', () => {
  it('writes one icon per line and parses back', () => {
    const text = serializeCollectionFile(lordicon);
    expect(text.split('\n')).toHaveLength(4);
    expect(JSON.parse(text)).toEqual(lordicon);
  });
});

describe('queryIcons', () => {
  it('defaults to most recent first', () => {
    const r = idx.queryIcons({ limit: 3 });
    expect(r.total).toBe(9);
    expect(titles(r)).toEqual(['Magnifier', 'Google Maps', 'Google Drive']);
  });

  it('filters by facets', () => {
    expect(idx.queryIcons({ site: 'thesvg' }).total).toBe(3);
    expect(idx.queryIcons({ styleType: 'filled' }).total).toBe(2);
    expect(idx.queryIcons({ gridSize: '16x16' }).items[0]!.title).toBe('Smartphone');
    expect(idx.queryIcons({ collection: 'ui-pack', letter: 'H' }).total).toBe(2);
    expect(idx.queryIcons({ category: 'animation' }).total).toBe(1);
    expect(idx.queryIcons({ category: 'lordicon:popular' }).total).toBe(1);
    expect(idx.queryIcons({ collection: 'lordicon-cat-popular' }).total).toBe(1);
    // Raw category also matches, like the legacy filter
    expect(ids(idx.queryIcons({ category: 'all' }))).toEqual(['4']);
    expect(idx.queryIcons({ site: 'nope' }).total).toBe(0);
  });

  it('matches every word as a substring of a token', () => {
    expect(titles(idx.queryIcons({ q: 'phone' }))).toEqual(['Smartphone']);
    expect(idx.queryIcons({ q: 'hous' }).total).toBe(2);
    // Matches the collection name too
    expect(idx.queryIcons({ q: 'ui pack' }).total).toBe(5);
  });

  it('lists exact phrase matches first for multi-word queries', () => {
    // "Keyboard" (left-arrow-key) is more recent but "Arrow Left" contains the phrase
    expect(titles(idx.queryIcons({ q: 'arrow left' }))).toEqual(['Arrow Left', 'Keyboard']);
  });

  it('sorts A–Z and Z–A keeping recent-first for equal titles', () => {
    const az = idx.queryIcons({ collection: 'ui-pack', sort: 'az' });
    expect(titles(az)).toEqual(['Arrow Left', 'Home', 'Home', 'Keyboard', 'Smartphone']);
    expect(ids(az).slice(1, 3)).toEqual(['4', '3']);
    const za = idx.queryIcons({ collection: 'ui-pack', sort: 'za' });
    expect(titles(za)).toEqual(['Smartphone', 'Keyboard', 'Home', 'Home', 'Arrow Left']);
    expect(ids(za).slice(2, 4)).toEqual(['4', '3']);
    expect(titles(idx.queryIcons({ sort: 'az', limit: 2 }))).toEqual(['Arrow Left', 'Gmail']);
  });

  it('paginates with offset and cursor', () => {
    const first = idx.queryIcons({ limit: 4 });
    expect(first.nextCursor).toBeTruthy();
    const second = idx.queryIcons({ limit: 4, cursor: first.nextCursor });
    expect(second.offset).toBe(4);
    expect(ids(second)).toEqual(ids(idx.queryIcons({ limit: 4, offset: 4 })));
    const last = idx.queryIcons({ limit: 4, cursor: second.nextCursor });
    expect(last.items).toHaveLength(1);
    expect(last.nextCursor).toBeNull();
    // Cursor from another build → start over
    const stale = CatalogIndex.fromBytes(buildCatalogIndex([uiPack], taxonomy, { buildId: 'other' }).index);
    expect(stale.queryIcons({ limit: 2, cursor: first.nextCursor }).offset).toBe(0);
  });
});

describe('asset URLs', () => {
  const cdn = CatalogIndex.fromBytes(built.index, { readDetails, assets: { publicUrl: 'https://cdn.test/' } });
  const find = (index: CatalogIndex, slug: string) => index.item(index.findIcon('any', 'family-google', slug));

  it('uses the content-hash key only when the CDN is configured and the object is uploaded', () => {
    expect(find(cdn, 'google-drive').assetUrl).toBe('https://cdn.test/svg/aaaabbbbccccdddd.svg');
    expect(find(cdn, 'gmail').assetUrl).toBe('https://cdn.test/thesvg/family-google/icons/gmail-gmail.svg');
  });

  it('falls back to the same-origin proxy and never exposes the S3 API endpoint', () => {
    expect(find(idx, 'google-drive').assetUrl).toBe('/svg/family-google/google-drive.svg');
    // doubled slug-slug names are shortened (the proxy retries both)
    expect(find(idx, 'gmail').assetUrl).toBe('/svg/family-google/gmail.svg');
    const s3 = CatalogIndex.fromBytes(built.index, { assets: { publicUrl: 'https://x.r2.cloudflarestorage.com' } });
    expect(find(s3, 'gmail').assetUrl.startsWith('/svg/')).toBe(true);
  });

  it('lists R2 object keys, hash first', () => {
    const ord = idx.findIcon('any', 'family-google', 'google-drive');
    expect(idx.objectKeys(ord)).toEqual(['svg/aaaabbbbccccdddd.svg', 'thesvg/family-google/icons/google-drive.svg']);
    expect(idx.objectKeys(ord, 'dark')).toEqual(['thesvg/family-google/icons/google-drive.dark.svg']);
  });
});

describe('icon lookup and detail', () => {
  it('finds by id or slug, most recent wins for duplicate slugs', () => {
    expect(idx.item(idx.findIcon('any', 'ui-pack', '3')).id).toBe('3');
    expect(idx.item(idx.findIcon('svgrepo', 'ui-pack', 'home')).id).toBe('4');
    expect(idx.findIcon('any', 'ui-pack', 'missing')).toBe(-1);
    expect(idx.findIcon('any', 'no-such-collection', '1')).toBe(-1);
  });

  it('returns detail fields from details.bin', () => {
    const d = idx.iconDetail(idx.findIcon('any', 'family-google', 'gdrive'));
    expect(d.variants).toEqual({ default: 'icons/google-drive.svg', dark: 'icons/google-drive.dark.svg' });
    expect(d.variantAssetUrls.dark).toBe('/svg/family-google/google-drive.dark.svg');
    expect(d.author).toBe('theSVG');
    expect(idx.iconDetail(idx.findIcon('any', 'ui-pack', '4')).rawCategory).toBe('all');
  });

  it('recommends icons sharing tags, same collection and same style', () => {
    const rel = idx.related(idx.findIcon('any', 'ui-pack', 'arrow-left'), 3);
    expect(rel.similar[0]!.title).toBe('Keyboard');
    expect(rel.sameCollection.map((i) => i.id)).not.toContain('1');
    expect(rel.sameCollection).toHaveLength(3);
  });
});

describe('collections', () => {
  it('builds directory cards with samples, sorted by size', () => {
    const r = idx.queryCollections({});
    expect(r.items.map((c) => c.slug)).toEqual(['ui-pack', 'family-google', 'misc-logos', 'lordicon-system-outline']);
    expect(r.items[0]!.sampleIcons).toHaveLength(5);
    expect(r.items[0]).not.toHaveProperty('searchText');
    expect(idx.queryCollections({ q: 'smartphone' }).items.map((c) => c.slug)).toEqual(['ui-pack']);
  });

  it('lists brand groups (regex brands and aliases of a real collection)', () => {
    const r = idx.queryCollections({ mode: 'brands' });
    // An `exactCol` alias keeps the real collection slug (links go to that collection) with the brand name
    expect(r.items.map((c) => [c.slug, c.name, c.count])).toEqual([
      ['family-google', 'Google', 3],
      ['ui-pack', 'UI Alias', 5],
    ]);
  });

  it('returns collection details with breakdowns', () => {
    const d = idx.collectionDetails('svgrepo', 'ui-pack', { limit: 2 })!;
    expect(d.collection.totalIconsInCollection).toBe(5);
    expect(d.collection.stylesBreakdown).toEqual([
      { id: 'outlined', count: 4 },
      { id: 'filled', count: 1 },
    ]);
    expect(titles(d)).toEqual(['Arrow Left', 'Home']);
    expect(idx.collectionDetails('any', 'missing')).toBeNull();
  });

  it('keeps the curated order for brand groups (own collection first)', () => {
    const d = idx.collectionDetails('any', 'family-google', {})!;
    expect(d.collection.site).toBe('any');
    expect(titles(d)).toEqual(['Google Drive', 'Gmail', 'Google Maps']);
  });

  it('builds virtual Lordicon category collections', () => {
    const d = idx.collectionDetails('lordicon', 'lordicon-cat-popular', {})!;
    expect(d.collection.name).toBe('Animated — Popular');
    expect(d.total).toBe(1);
  });

  it('summarizes counts', () => {
    const s = idx.summary();
    expect(s.totalIcons).toBe(9);
    expect(s.totalBrands).toBe(2);
    expect(s.sites.find((x) => x.id === 'thesvg')!.count).toBe(3);
    expect(s.categories.find((c) => c.id === 'brand')).toMatchObject({ count: 3, brandCount: 1 });
    expect(s.collections[0]).toEqual({ site: 'svgrepo', slug: 'ui-pack', name: 'UI Pack', count: 5 });
  });
});
