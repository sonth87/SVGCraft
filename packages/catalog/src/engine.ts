/**
 * Runtime query engine over `index.bin`. Environment-agnostic: the caller supplies the bytes and,
 * optionally, a reader for `details.bin` (the web app uses positional fs reads).
 *
 * Filter/sort semantics mirror the legacy StateManager so the current UI keeps working;
 * search is token based (each query word must be a substring of some token of the icon).
 */
import { decodeContainer } from './container';
import {
  REC_SEP,
  type CollectionMeta,
  type DirectoryEntry,
  type IconDetailsRecord,
  type IndexHeader,
} from './index-format';
import { intersectSorted, rangeList, tokenize, unionSorted } from './postings';
import type { SiteId } from './schema';

export interface AssetUrlConfig {
  /** Public CDN origin of the R2 bucket (custom domain), e.g. `https://cdn.example.com` */
  publicUrl?: string;
}

export interface IconListItem {
  id: string;
  slug: string;
  title: string;
  site: SiteId;
  collectionSlug: string;
  collectionName: string;
  category: string;
  lordiconCategory: string;
  styleType: string;
  iconType: string;
  gridSize: string;
  assetUrl: string;
}

export interface IconDetail extends IconListItem {
  fileName: string;
  relativePath: string;
  variants: Record<string, string>;
  variantAssetUrls: Record<string, string>;
  rawCategory: string;
  tags: string[];
  author: string;
  license: string;
  downloadedAt: string;
}

export interface Page<T> {
  total: number;
  offset: number;
  limit: number;
  items: T[];
  /** Opaque cursor for the next page, `null` on the last page */
  nextCursor: string | null;
}

export interface IconQuery {
  q?: string;
  category?: string;
  styleType?: string;
  iconType?: string;
  site?: string;
  collection?: string;
  gridSize?: string;
  letter?: string;
  sort?: string;
  offset?: number;
  limit?: number;
  cursor?: string | null;
}

export interface CollectionQuery {
  mode?: 'collections' | 'brands';
  q?: string;
  category?: string;
  styleType?: string;
  iconType?: string;
  letter?: string;
  sort?: string;
  offset?: number;
  limit?: number;
  cursor?: string | null;
}

export interface CollectionIconsQuery {
  q?: string;
  styleType?: string;
  category?: string;
  sort?: string;
  offset?: number;
  limit?: number;
  cursor?: string | null;
}

/** Collection header returned with a collection page (real, brand group or virtual Lordicon category). */
export interface CollectionInfo extends Partial<Omit<CollectionMeta, 'count' | 'site' | 'slug' | 'name'>> {
  site: string;
  slug: string;
  name: string;
  author: string;
  license: string;
  downloadedIconsCount: number;
  totalIcons: number;
}

export type DirectoryCard = Omit<
  DirectoryEntry,
  'samples' | 'searchText' | 'categoryCounts' | 'styleCounts' | 'typeCounts'
> & {
  sampleIcons: Pick<IconListItem, 'id' | 'slug' | 'title' | 'assetUrl' | 'styleType' | 'category'>[];
};

export interface RelatedIcons {
  similar: IconListItem[];
  sameStyle: IconListItem[];
  sameCollection: IconListItem[];
}

const LORDICON_STYLE_DEFS = [
  { colSlug: 'lordicon-system-outline', family: 'system', style: 'outline', label: 'System Outline' },
  { colSlug: 'lordicon-system-solid', family: 'system', style: 'solid', label: 'System Solid' },
  { colSlug: 'lordicon-doodle-color', family: 'doodle', style: 'color', label: 'Doodle Color' },
  { colSlug: 'lordicon-doodle-motif', family: 'doodle', style: 'motif', label: 'Doodle Motif' },
  { colSlug: 'lordicon-doodle-outline', family: 'doodle', style: 'outline', label: 'Doodle Outline' },
  { colSlug: 'lordicon-doodle-black', family: 'doodle', style: 'black', label: 'Doodle Black' },
  { colSlug: 'lordicon-wired-outline', family: 'wired', style: 'outline', label: 'Wired Outline' },
  { colSlug: 'lordicon-wired-flat', family: 'wired', style: 'flat', label: 'Wired Flat' },
  { colSlug: 'lordicon-wired-lineal', family: 'wired', style: 'lineal', label: 'Wired Lineal' },
  { colSlug: 'lordicon-wired-gradient', family: 'wired', style: 'gradient', label: 'Wired Gradient' },
] as const;

const EMPTY = new Uint32Array(0);
const WORD_CACHE_SIZE = 256;

export class CatalogIndex {
  readonly header: IndexHeader;
  readonly size: number;
  private readonly c: {
    site: Uint8Array;
    col: Uint16Array;
    cat: Uint8Array;
    lc: Uint8Array;
    style: Uint8Array;
    type: Uint8Array;
    grid: Uint16Array;
    recOff: Uint32Array;
    rec: Uint8Array;
    detOff: Uint32Array;
    facPost: Uint32Array;
    tokOff: Uint32Array;
    tokPost: Uint32Array;
    brandPost: Uint32Array;
    azOrder: Uint32Array;
    azRank: Uint32Array;
    zaOrder: Uint32Array;
    zaRank: Uint32Array;
    colStart: Uint32Array;
    colBySlug: Uint32Array;
    colById: Uint32Array;
  };
  private readonly decoder = new TextDecoder();
  private readonly wordCache = new Map<string, Uint32Array>();
  private readonly colsBySlug = new Map<string, number[]>();
  private readonly publicUrl: string;

  private constructor(
    bytes: Uint8Array,
    private readonly readDetails: ((start: number, end: number) => Uint8Array) | null,
    assets: AssetUrlConfig
  ) {
    const box = decodeContainer<IndexHeader>(bytes);
    this.header = box.header;
    this.size = box.header.totalIcons;
    this.c = {
      site: box.u8('site'),
      col: box.u16('col'),
      cat: box.u8('cat'),
      lc: box.u8('lc'),
      style: box.u8('style'),
      type: box.u8('type'),
      grid: box.u16('grid'),
      recOff: box.u32('recOff'),
      rec: box.u8('rec'),
      detOff: box.u32('detOff'),
      facPost: box.u32('facPost'),
      tokOff: box.u32('tokOff'),
      tokPost: box.u32('tokPost'),
      brandPost: box.u32('brandPost'),
      azOrder: box.u32('azOrder'),
      azRank: box.u32('azRank'),
      zaOrder: box.u32('zaOrder'),
      zaRank: box.u32('zaRank'),
      colStart: box.u32('colStart'),
      colBySlug: box.u32('colBySlug'),
      colById: box.u32('colById'),
    };
    this.header.collections.forEach((c, i) => {
      const list = this.colsBySlug.get(c.slug);
      if (list) list.push(i);
      else this.colsBySlug.set(c.slug, [i]);
    });
    const pub = (assets.publicUrl ?? '').trim().replace(/\/+$/, '');
    // The S3 API endpoint is private; never hand it to browsers
    this.publicUrl = /\.r2\.cloudflarestorage\.com/i.test(pub) ? '' : pub;
  }

  static fromBytes(
    bytes: Uint8Array,
    opts: { readDetails?: (start: number, end: number) => Uint8Array; assets?: AssetUrlConfig } = {}
  ): CatalogIndex {
    return new CatalogIndex(bytes, opts.readDetails ?? null, opts.assets ?? {});
  }

  get buildId(): string {
    return this.header.buildId;
  }

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------

  summary() {
    return {
      ...this.header.summary,
      // Slim list for the legacy collection dropdown (slug/name/count only)
      collections: this.header.collections.map(({ site, slug, name, count }) => ({ site, slug, name, count })),
    };
  }

  // -------------------------------------------------------------------------
  // Icons
  // -------------------------------------------------------------------------

  queryIcons(query: IconQuery = {}): Page<IconListItem> {
    const { offset, limit } = this.pageWindow(query, 72);
    const sort = query.sort || 'recent';
    const lists: Uint32Array[] = [];

    if (query.site) lists.push(this.facet(`site:${query.site}`));
    if (query.category) {
      const cat = this.normalizeCategory(query.category);
      if (query.category === 'animation') lists.push(this.facet('anim'));
      else if (query.category.startsWith('lordicon:')) lists.push(this.facet(`animcat:${cat}`));
      else lists.push(this.facet(`cat:${cat}`));
    }
    if (query.styleType) lists.push(this.facet(`style:${query.styleType}`));
    if (query.iconType) lists.push(this.facet(`type:${query.iconType}`));
    if (query.gridSize) lists.push(this.facet(`grid:${query.gridSize}`));
    if (query.letter) lists.push(this.facet(`letter:${query.letter === '#' ? '#' : query.letter.toUpperCase()}`));
    if (query.collection) {
      if (query.collection.startsWith('lordicon-cat-')) {
        lists.push(this.facet(`lvcol:${query.collection.slice('lordicon-cat-'.length)}`));
      } else {
        const cols = this.colsBySlug.get(query.collection) ?? [];
        lists.push(
          unionSorted(
            cols.map((i) => this.facet(`col:${i}`)),
            this.size
          )
        );
      }
    }
    lists.push(...this.textLists(query.q));

    let result = lists.length ? intersectSorted(lists) : null;
    if (result && sort !== 'az' && sort !== 'za') result = this.phraseFirst(result, query.q);
    const total = result ? result.length : this.size;
    const page = this.sortedPage(result, sort, offset, limit);
    return this.page(
      total,
      offset,
      limit,
      Array.from(page, (o) => this.item(o))
    );
  }

  /** Locate an icon by collection + id or slug. Most recent match wins, like the legacy lookup. */
  findIcon(site: string, collectionSlug: string, idOrSlug: string): number {
    const cols = this.colsBySlug.get(collectionSlug) ?? [];
    const preferred = cols.filter((i) => !site || site === 'any' || this.header.collections[i]!.site === site);
    for (const candidates of [preferred, cols]) {
      let best = -1;
      for (const col of candidates) {
        for (const ord of [
          this.lookupInCollection(col, idOrSlug, 'id'),
          this.lookupInCollection(col, idOrSlug, 'slug'),
        ]) {
          if (ord >= 0 && (best < 0 || ord < best)) best = ord;
        }
      }
      if (best >= 0) return best;
    }
    return -1;
  }

  item(ord: number): IconListItem {
    const [id = '', slug = '', title = '', file = '', hash = ''] = this.record(ord);
    const col = this.header.collections[this.c.col[ord]!]!;
    const site = this.header.dicts.site[this.c.site[ord]!]!;
    return {
      id: id || slug,
      slug,
      title: title || slug,
      site,
      collectionSlug: col.slug,
      collectionName: col.name,
      category: this.header.dicts.cat[this.c.cat[ord]!]!,
      lordiconCategory: this.header.dicts.lc[this.c.lc[ord]!]!,
      styleType: this.header.dicts.style[this.c.style[ord]!]!,
      iconType: this.header.dicts.type[this.c.type[ord]!]!,
      gridSize: this.header.dicts.grid[this.c.grid[ord]!]!,
      assetUrl: this.assetUrl(site, col.slug, file, hash),
    };
  }

  /** Full detail; requires the `details.bin` reader. */
  iconDetail(ord: number): IconDetail {
    const base = this.item(ord);
    const details = this.details(ord);
    const col = this.header.collections[this.c.col[ord]!]!;
    const variants: Record<string, string> = {};
    const variantAssetUrls: Record<string, string> = {};
    for (const [name, file] of Object.entries(details.files)) {
      variants[name] = `icons/${file}`;
      variantAssetUrls[name] = this.assetUrl(base.site, col.slug, file, details.hash?.[name] ?? '');
    }
    const defaultFile = details.files.default ?? Object.values(details.files)[0] ?? '';
    return {
      ...base,
      fileName: defaultFile,
      relativePath: `icons/${defaultFile}`,
      variants,
      variantAssetUrls,
      rawCategory: details.raw ?? base.category,
      tags: details.tags ?? [],
      author: col.author,
      license: col.license,
      downloadedAt: details.at,
    };
  }

  details(ord: number): IconDetailsRecord {
    if (!this.readDetails) throw new Error('details.bin reader not configured');
    const bytes = this.readDetails(this.c.detOff[ord]!, this.c.detOff[ord + 1]!);
    return JSON.parse(this.decoder.decode(bytes)) as IconDetailsRecord;
  }

  /** R2 object keys that may hold this icon's SVG, best first (content hash, then legacy path). */
  objectKeys(ord: number, variant = 'default'): string[] {
    const d = this.details(ord);
    const col = this.header.collections[this.c.col[ord]!]!;
    const file = d.files[variant] ?? d.files.default;
    const keys: string[] = [];
    const hash = d.hash?.[variant];
    if (hash) keys.push(`svg/${hash}.svg`);
    if (file) keys.push(`${col.site}/${col.slug}/icons/${file}`);
    return keys;
  }

  related(ord: number, limit = 12): RelatedIcons {
    const N = this.size;
    const tCol = this.c.col[ord]!;
    const tCat = this.c.cat[ord]!;
    const tStyle = this.c.style[ord]!;
    const tType = this.c.type[ord]!;
    const tGrid = this.c.grid[ord]!;

    // Shared tag tokens (fall back to title tokens) counted through the token postings
    let words: string[] = [];
    try {
      const d = this.details(ord);
      words = [...new Set((d.tags ?? []).flatMap(tokenize))];
    } catch {
      /* no details reader: title only */
    }
    if (words.length === 0) words = [...new Set(tokenize(this.record(ord)[2] ?? ''))];

    const shared = new Uint8Array(N);
    const touched: number[] = [];
    for (const w of words) {
      const list = this.tokenPostings(w);
      for (let i = 0; i < list.length; i++) {
        const o = list[i]!;
        if (o === ord) continue;
        if (shared[o] === 0) touched.push(o);
        if (shared[o]! < 255) shared[o] = shared[o]! + 1;
      }
    }
    const colList = this.facet(`col:${tCol}`);
    for (let i = 0; i < Math.min(colList.length, 200); i++) {
      const o = colList[i]!;
      // Same-collection icons are candidates even without shared tags
      if (o !== ord && shared[o] === 0) touched.push(o);
    }

    const score = (o: number) =>
      shared[o]! * 12 +
      (this.c.cat[o] === tCat ? 8 : 0) +
      (this.c.style[o] === tStyle ? 6 : 0) +
      (this.c.type[o] === tType ? 4 : 0) +
      (this.c.grid[o] === tGrid ? 3 : 0) +
      (this.c.col[o] === tCol ? 5 : 0);

    // Top-k by score, ties → most recent (lower ordinal)
    const top: { o: number; s: number }[] = [];
    for (const o of touched) {
      const s = score(o);
      if (s <= 0) continue;
      if (top.length === limit && (s < top[limit - 1]!.s || (s === top[limit - 1]!.s && o > top[limit - 1]!.o)))
        continue;
      let i = top.length;
      while (i > 0 && (top[i - 1]!.s < s || (top[i - 1]!.s === s && top[i - 1]!.o > o))) i--;
      top.splice(i, 0, { o, s });
      if (top.length > limit) top.pop();
    }

    const sameCollection: number[] = [];
    for (let i = 0; i < colList.length && sameCollection.length < limit; i++) {
      if (colList[i] !== ord) sameCollection.push(colList[i]!);
    }
    const sameStyle: number[] = [];
    const styleList = this.facet(`style:${this.header.dicts.style[tStyle]}`);
    for (let i = 0; i < styleList.length && sameStyle.length < limit; i++) {
      const o = styleList[i]!;
      if (o !== ord && this.c.cat[o] === tCat && this.c.col[o] !== tCol) sameStyle.push(o);
    }

    return {
      similar: top.map((t) => this.item(t.o)),
      sameStyle: sameStyle.map((o) => this.item(o)),
      sameCollection: sameCollection.map((o) => this.item(o)),
    };
  }

  /** Same icon in the other Lordicon families/styles (null for non-Lordicon icons). */
  lordiconStyles(ord: number) {
    const col = this.header.collections[this.c.col[ord]!]!;
    if (col.site !== 'lordicon' && !/^lordicon-/i.test(col.slug)) return null;
    const self = this.item(ord);
    const baseSlug = self.slug.replace(/^\d+-/, '');
    const targetFamily = /^lordicon-/i.test(col.slug) ? (col.slug.split('-')[1] ?? '') : '';

    return LORDICON_STYLE_DEFS.flatMap((sd) => {
      const colIdx = (this.colsBySlug.get(sd.colSlug) ?? [])[0];
      let sibling = -1;
      if (colIdx !== undefined) {
        sibling = this.lookupInCollection(colIdx, self.slug, 'slug');
        if (sibling < 0 && baseSlug) {
          for (let i = this.c.colStart[colIdx]!; i < this.c.colStart[colIdx + 1]!; i++) {
            const o = this.c.colBySlug[i]!;
            if ((this.record(o)[1] ?? '').replace(/^\d+-/, '') === baseSlug && (sibling < 0 || o < sibling))
              sibling = o;
          }
        }
      }
      if (sibling < 0 && sd.family !== targetFamily) return [];
      const sib = sibling >= 0 ? this.item(sibling) : null;
      const resolvedSlug = sib ? sib.slug : self.slug;
      const cdnSvgUrl = `https://media.lordicon.com/icons/${sd.family}/${sd.style}/${resolvedSlug}.svg`;
      const assetUrl = sib ? sib.assetUrl : cdnSvgUrl;
      return [
        {
          ...sd,
          collectionSlug: sd.colSlug,
          iconSlug: resolvedSlug,
          iconId: sib ? sib.id : self.id,
          isCurrent: sd.colSlug === col.slug,
          isCrawled: Boolean(sib),
          isLocal: Boolean(sib),
          assetUrl,
          localAssetUrl: assetUrl,
          svgUrl: assetUrl,
          cdnSvgUrl,
          cdnLiUrl: `https://media.lordicon.com/icons/${sd.family}/${sd.style}/${resolvedSlug}.li`,
        },
      ];
    });
  }

  // -------------------------------------------------------------------------
  // Collections & brands
  // -------------------------------------------------------------------------

  queryCollections(query: CollectionQuery = {}): Page<DirectoryCard> {
    const { offset, limit } = this.pageWindow(query, 24);
    const brands = query.mode === 'brands';
    const directory = brands ? this.header.brandsDirectory : this.header.collectionsDirectory;
    const q = String(query.q ?? '')
      .trim()
      .toLowerCase();

    let cat = this.normalizeCategory(query.category ?? '');
    if (brands && cat && !directory.some((c) => c.primaryCategory === cat || c.categoryCounts[cat])) cat = '';
    const type = brands ? '' : (query.iconType ?? '');
    const style = brands ? '' : (query.styleType ?? '');
    const letter = query.letter ?? '';

    const filtered = directory.filter((c) => {
      if (cat && c.primaryCategory !== cat && !c.categoryCounts[cat]) return false;
      if (style && c.primaryStyle !== style && !c.styleCounts[style]) return false;
      if (type && !c.typeCounts[type]) return false;
      if (letter) {
        const first = (c.name || c.slug).charAt(0).toUpperCase();
        if (letter === '#' ? /[A-Z]/.test(first) : first !== letter.toUpperCase()) return false;
      }
      return !q || c.searchText.includes(q);
    });

    const sort = query.sort ?? 'popular';
    if (sort === 'az') filtered.sort((a, b) => (a.name || a.slug).localeCompare(b.name || b.slug));
    else if (sort === 'za') filtered.sort((a, b) => (b.name || b.slug).localeCompare(a.name || a.slug));
    else if (cat) {
      filtered.sort((a, b) => {
        const pa = a.primaryCategory === cat ? 1 : 0;
        const pb = b.primaryCategory === cat ? 1 : 0;
        return pb - pa || (b.categoryCounts[cat] ?? 0) - (a.categoryCounts[cat] ?? 0);
      });
    } else if (brands) filtered.sort((a, b) => (a.brandTier || 3) - (b.brandTier || 3) || b.count - a.count);
    else filtered.sort((a, b) => b.count - a.count);

    const items = filtered.slice(offset, offset + limit).map((entry) => this.card(entry));
    return this.page(filtered.length, offset, limit, items);
  }

  collectionDetails(site: string, slug: string, query: CollectionIconsQuery = {}) {
    const { offset, limit } = this.pageWindow(query, 72);
    let base: Uint32Array;
    let natural: Uint32Array | null = null;
    let info: CollectionInfo;
    let resolvedSite: string;
    let isBrand = false;

    if (slug.startsWith('lordicon-cat-')) {
      const lcId = slug.slice('lordicon-cat-'.length);
      base = this.facet(`lvcol:${lcId}`);
      if (base.length === 0) return null;
      resolvedSite = 'lordicon';
      info = {
        site: 'lordicon',
        slug,
        name: `Animated — ${this.header.lordiconCategoryLabels[lcId] ?? lcId}`,
        author: 'Open Source',
        license: 'MIT / CC0',
        downloadedIconsCount: base.length,
        totalIcons: base.length,
      };
    } else if (this.header.brandLists[slug]) {
      const [start, len] = this.header.brandLists[slug]!;
      natural = this.c.brandPost.subarray(start, start + len);
      base = Uint32Array.from(natural).sort();
      resolvedSite = 'any';
      isBrand = true;
      const entry = this.header.brandsDirectory.find((b) => b.slug === slug);
      info = {
        site: 'any',
        slug,
        name: entry?.name ?? slug,
        author: 'Open Source',
        license: 'Brand Trademarks / MIT',
        downloadedIconsCount: base.length,
        totalIcons: base.length,
      };
    } else {
      const cols = this.colsBySlug.get(slug) ?? [];
      const colIdx = cols.find((i) => !site || site === 'any' || this.header.collections[i]!.site === site) ?? cols[0];
      if (colIdx === undefined) return null;
      const meta: CollectionMeta = this.header.collections[colIdx]!;
      base = this.facet(`col:${colIdx}`);
      resolvedSite = meta.site;
      const { count, ...rest } = meta;
      info = { ...rest, downloadedIconsCount: count, totalIcons: count };
    }

    // Breakdowns over the whole collection (insertion order = natural order, like before)
    const styleCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const grids = new Set<string>();
    for (const o of natural ?? base) {
      const st = this.header.dicts.style[this.c.style[o]!]!;
      const ct = this.header.dicts.cat[this.c.cat[o]!]!;
      if (st) styleCounts[st] = (styleCounts[st] ?? 0) + 1;
      if (ct) categoryCounts[ct] = (categoryCounts[ct] ?? 0) + 1;
      const g = this.header.dicts.grid[this.c.grid[o]!]!;
      if (g) grids.add(g);
    }

    const lists: Uint32Array[] = [base];
    if (query.styleType) lists.push(this.facet(`style:${query.styleType}`));
    if (query.category) lists.push(this.facet(`cat:${query.category}`));
    lists.push(...this.textLists(query.q));
    const matched = intersectSorted(lists);

    const sort = query.sort || 'az';
    let page: Uint32Array;
    if ((sort === 'az' && !isBrand) || sort === 'za' || sort === 'recent') {
      page = this.sortedPage(matched, sort, offset, limit);
    } else if (natural) {
      // Brand groups keep their curated order: own collection first, then matches from other packs
      const keep = new Uint8Array(this.size);
      for (const o of matched) keep[o] = 1;
      page = natural.filter((o) => keep[o] === 1).subarray(offset, offset + limit);
    } else {
      page = matched.subarray(offset, offset + limit);
    }

    return {
      collection: {
        ...info,
        site: resolvedSite,
        totalIconsInCollection: base.length,
        stylesBreakdown: Object.entries(styleCounts).map(([id, count]) => ({ id, count })),
        categoriesBreakdown: Object.entries(categoryCounts).map(([id, count]) => ({ id, count })),
        gridSizes: [...grids],
      },
      ...this.page(
        matched.length,
        offset,
        limit,
        Array.from(page, (o) => this.item(o))
      ),
    };
  }

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  private record(ord: number): string[] {
    return this.decoder.decode(this.c.rec.subarray(this.c.recOff[ord]!, this.c.recOff[ord + 1]!)).split(REC_SEP);
  }

  private facet(key: string): Uint32Array {
    const ref = this.header.facets[key];
    return ref ? this.c.facPost.subarray(ref[0], ref[0] + ref[1]) : EMPTY;
  }

  private normalizeCategory(cat: string): string {
    const clean = String(cat || '')
      .trim()
      .toLowerCase()
      .replace(/^lordicon:/, '');
    return this.header.categoryAliases[clean] ?? clean;
  }

  private tokenPostings(token: string): Uint32Array {
    const tokens = this.header.tokens;
    let lo = 0;
    let hi = tokens.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (tokens[mid]! < token) lo = mid + 1;
      else hi = mid;
    }
    if (tokens[lo] !== token) return EMPTY;
    return this.c.tokPost.subarray(this.c.tokOff[lo]!, this.c.tokOff[lo + 1]!);
  }

  /** One sorted list per query word: union of every token containing the word. */
  private textLists(q: string | undefined): Uint32Array[] {
    return tokenize(q ?? '').map((word) => {
      const cached = this.wordCache.get(word);
      if (cached) return cached;
      const lists: Uint32Array[] = [];
      const tokens = this.header.tokens;
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i]!.includes(word)) lists.push(this.c.tokPost.subarray(this.c.tokOff[i]!, this.c.tokOff[i + 1]!));
      }
      const union = unionSorted(lists, this.size);
      if (this.wordCache.size >= WORD_CACHE_SIZE) this.wordCache.delete(this.wordCache.keys().next().value!);
      this.wordCache.set(word, union);
      return union;
    });
  }

  /** A page of `result` (sorted ordinals, or `null` = every icon) in the requested order. */
  private sortedPage(result: Uint32Array | null, sort: string, offset: number, limit: number): Uint32Array {
    const N = this.size;
    if (sort !== 'az' && sort !== 'za') {
      return result ? result.subarray(offset, offset + limit) : rangeList(N).subarray(offset, offset + limit);
    }
    const [order, rank] = sort === 'za' ? [this.c.zaOrder, this.c.zaRank] : [this.c.azOrder, this.c.azRank];
    if (!result) return order.slice(offset, offset + limit);
    if (result.length > N / 4) {
      // Large result: walk the global order and keep members
      const member = new Uint8Array(N);
      for (const o of result) member[o] = 1;
      const out: number[] = [];
      let skipped = 0;
      for (let i = 0; i < N && out.length < limit; i++) {
        const o = order[i]!;
        if (member[o] !== 1) continue;
        if (skipped++ < offset) continue;
        out.push(o);
      }
      return Uint32Array.from(out);
    }
    const ranks = Uint32Array.from(result, (o) => rank[o]!).sort();
    return Uint32Array.from(ranks.subarray(offset, offset + limit), (r) => order[r]!);
  }

  /**
   * Multi-word search matches every icon containing all words; list the ones whose title or slug
   * contains the words as a phrase ("arrow left") first. Skipped for huge result sets.
   */
  private phraseFirst(result: Uint32Array, q: string | undefined): Uint32Array {
    const words = tokenize(q ?? '');
    if (words.length < 2 || result.length > 50_000) return result;
    const phrase = ` ${words.join(' ')} `;
    const hit: number[] = [];
    const rest: number[] = [];
    for (const o of result) {
      const [, slug = '', title = ''] = this.record(o);
      const matches =
        ` ${tokenize(title).join(' ')} `.includes(phrase) || ` ${tokenize(slug).join(' ')} `.includes(phrase);
      (matches ? hit : rest).push(o);
    }
    return hit.length === 0 || rest.length === 0 ? result : Uint32Array.from([...hit, ...rest]);
  }

  private lookupInCollection(col: number, value: string, field: 'id' | 'slug'): number {
    const table = field === 'id' ? this.c.colById : this.c.colBySlug;
    const fieldIdx = field === 'id' ? 0 : 1;
    let lo = this.c.colStart[col]!;
    let hi = this.c.colStart[col + 1]!;
    const end = hi;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if ((this.record(table[mid]!)[fieldIdx] ?? '') < value) lo = mid + 1;
      else hi = mid;
    }
    return lo < end && this.record(table[lo]!)[fieldIdx] === value ? table[lo]! : -1;
  }

  private card(entry: DirectoryEntry): DirectoryCard {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { samples, searchText, categoryCounts, styleCounts, typeCounts, ...pub } = entry;
    return {
      ...pub,
      sampleIcons: samples.map((o) => {
        const it = this.item(o);
        return {
          id: it.id,
          slug: it.slug,
          title: it.title,
          assetUrl: it.assetUrl,
          styleType: it.styleType,
          category: it.category,
        };
      }),
    };
  }

  assetUrl(site: string, colSlug: string, file: string, hash: string): string {
    if (this.publicUrl && hash) return `${this.publicUrl}/svg/${hash}.svg`;
    if (this.publicUrl)
      return `${this.publicUrl}/${encodeURIComponent(site)}/${encodeURIComponent(colSlug)}/icons/${file}`;
    // Same-origin proxy (reads R2 server side). Strip doubled "slug-slug" names, the proxy retries both
    const clean = file.replace(/^([a-zA-Z0-9-_]+?)-\1(\.[a-zA-Z0-9-_]+)?\.svg$/, '$1$2.svg');
    return `/svg/${encodeURIComponent(colSlug)}/${encodeURIComponent(clean)}`;
  }

  private pageWindow(q: { offset?: number; limit?: number; cursor?: string | null }, defaultLimit: number) {
    const limit = Math.max(1, Math.floor(Number(q.limit) || defaultLimit));
    let offset = Math.max(0, Math.floor(Number(q.offset) || 0));
    if (q.cursor) {
      const decoded = decodeCursor(q.cursor);
      // A cursor from an older deploy points into a different ordering: start over
      offset = decoded && decoded.b === this.buildId ? decoded.o : 0;
    }
    return { offset, limit };
  }

  private page<T>(total: number, offset: number, limit: number, items: T[]): Page<T> {
    const next = offset + items.length;
    return {
      total,
      offset,
      limit,
      items,
      nextCursor: items.length > 0 && next < total ? encodeCursor({ b: this.buildId, o: next }) : null,
    };
  }
}

// Cursor = base64url(JSON) — opaque to clients, pinned to the index build that produced it
function encodeCursor(c: { b: string; o: number }): string {
  return btoa(JSON.stringify(c)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeCursor(s: string): { b: string; o: number } | null {
  try {
    const parsed = JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/'))) as { b?: unknown; o?: unknown };
    if (typeof parsed.b === 'string' && typeof parsed.o === 'number' && parsed.o >= 0) {
      return { b: parsed.b, o: Math.floor(parsed.o) };
    }
  } catch {
    /* invalid cursor */
  }
  return null;
}
