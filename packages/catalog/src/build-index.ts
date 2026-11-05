/**
 * Build the runtime search index from the committed catalog.
 * Runs at `next build` (scripts/build-catalog-index.ts); output is derived data and never committed.
 *
 * Icon ordinal = position in "most recent first" order, so every posting list is already sorted for
 * the default sort and intersections stay linear.
 */
import { encodeContainer } from './container';
import {
  INDEX_FORMAT_VERSION,
  REC_SEP,
  type CollectionMeta,
  type DirectoryEntry,
  type IconDetailsRecord,
  type IndexHeader,
  type IndexSummary,
  type TaxonomyInput,
} from './index-format';
import { tokenize } from './postings';
import { iconFiles, type CatalogCollectionFile, type CatalogIconRecord, type SiteId } from './schema';

export interface BuiltIndex {
  index: Uint8Array;
  details: Uint8Array;
  stats: { icons: number; collections: number; tokens: number; indexBytes: number; detailsBytes: number };
}

interface FlatIcon {
  rec: CatalogIconRecord;
  col: number;
  site: SiteId;
}

class Dict {
  readonly values: string[] = [];
  private readonly map = new Map<string, number>();
  constructor(seed: string[] = []) {
    seed.forEach((v) => this.id(v));
  }
  id(v: string): number {
    let i = this.map.get(v);
    if (i === undefined) {
      i = this.values.length;
      this.values.push(v);
      this.map.set(v, i);
    }
    return i;
  }
}

class PostingBuilder {
  readonly lists = new Map<string, number[]>();
  add(key: string, ord: number) {
    const list = this.lists.get(key);
    if (!list) this.lists.set(key, [ord]);
    else if (list[list.length - 1] !== ord) list.push(ord);
  }
  /** Pack into one u32 section + key → [start, len] */
  pack(keys: Iterable<string> = this.lists.keys()): { data: Uint32Array; refs: Record<string, [number, number]> } {
    let total = 0;
    for (const list of this.lists.values()) total += list.length;
    const data = new Uint32Array(total);
    const refs: Record<string, [number, number]> = {};
    let at = 0;
    for (const key of keys) {
      const list = this.lists.get(key);
      if (!list) continue;
      data.set(list, at);
      refs[key] = [at, list.length];
      at += list.length;
    }
    return { data: data.subarray(0, at), refs };
  }
}

const isAnimated = (site: SiteId, type: string) => type === 'animated' || site === 'allsvgicons' || site === 'lordicon';

function letterOf(title: string): string {
  const c = title.charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

const sortedCounts = (counts: Record<string, number>) => Object.entries(counts).sort((a, b) => b[1] - a[1]);
const bump = (counts: Record<string, number>, key: string) => {
  if (key) counts[key] = (counts[key] ?? 0) + 1;
};

export function buildCatalogIndex(
  files: CatalogCollectionFile[],
  taxonomy: TaxonomyInput,
  { buildId = String(Date.now()) }: { buildId?: string } = {}
): BuiltIndex {
  // 1. Collections, most recently updated first (matches the legacy summary order)
  const sortedFiles = [...files].sort((a, b) => {
    const ta = Date.parse(a.updatedAt ?? '') || 0;
    const tb = Date.parse(b.updatedAt ?? '') || 0;
    if (ta !== tb) return tb - ta;
    return `${a.site}/${a.slug}` < `${b.site}/${b.slug}` ? -1 : 1;
  });
  const collections: CollectionMeta[] = sortedFiles.map(({ icons, ...meta }) => ({ ...meta, count: icons.length }));

  // 2. Icons, most recent first
  const flat: FlatIcon[] = [];
  sortedFiles.forEach((file, col) => file.icons.forEach((rec) => flat.push({ rec, col, site: file.site })));
  const atMs = flat.map((f) => Date.parse(f.rec.at) || 0);
  const order = flat.map((_, i) => i).sort((a, b) => atMs[b]! - atMs[a]! || a - b);
  const icons = order.map((i) => flat[i]!);
  const N = icons.length;

  // 3. Columns
  const dicts = {
    site: new Dict(taxonomy.sites.map((s) => s.id)),
    cat: new Dict(['']),
    lc: new Dict(['']),
    style: new Dict(['']),
    type: new Dict(['']),
    grid: new Dict(['']),
  };
  const colSite = new Uint8Array(N);
  const colCol = new Uint16Array(N);
  const colCat = new Uint8Array(N);
  const colLc = new Uint8Array(N);
  const colStyle = new Uint8Array(N);
  const colType = new Uint8Array(N);
  const colGrid = new Uint16Array(N);
  if (collections.length > 0xffff) throw new Error('Too many collections for u16 column');

  const encoder = new TextEncoder();
  const recChunks: Uint8Array[] = [];
  const recOff = new Uint32Array(N + 1);
  const detChunks: Uint8Array[] = [];
  const detOff = new Uint32Array(N + 1);
  let recBytes = 0;
  let detBytes = 0;

  const facets = new PostingBuilder();
  const tokens = new PostingBuilder();

  icons.forEach(({ rec, col, site }, ord) => {
    const meta = collections[col]!;
    colSite[ord] = dicts.site.id(site);
    colCol[ord] = col;
    colCat[ord] = dicts.cat.id(rec.cat);
    colLc[ord] = dicts.lc.id(rec.lc ?? '');
    colStyle[ord] = dicts.style.id(rec.style);
    colType[ord] = dicts.type.id(rec.type);
    colGrid[ord] = dicts.grid.id(rec.grid);
    for (const d of [colCat, colLc, colStyle, colType]) {
      if (d[ord] === 255) throw new Error('Dictionary overflow (u8)');
    }

    const files = iconFiles(rec);
    const defaultVariant = files.default !== undefined ? 'default' : (Object.keys(files)[0] ?? 'default');
    const packed = encoder.encode(
      [rec.id, rec.slug, rec.title, files[defaultVariant] ?? '', rec.hash?.[defaultVariant] ?? ''].join(REC_SEP)
    );
    recChunks.push(packed);
    recBytes += packed.length;
    recOff[ord + 1] = recBytes;

    const details: IconDetailsRecord = { files, at: rec.at };
    if (rec.raw) details.raw = rec.raw;
    if (rec.tags?.length) details.tags = rec.tags;
    if (rec.hash) details.hash = rec.hash;
    const detPacked = encoder.encode(JSON.stringify(details));
    detChunks.push(detPacked);
    detBytes += detPacked.length;
    detOff[ord + 1] = detBytes;

    // Facets
    const raw = rec.raw ?? rec.cat;
    const lc = rec.lc ?? '';
    const anim = isAnimated(site, rec.type);
    facets.add(`site:${site}`, ord);
    facets.add(`col:${col}`, ord);
    for (const c of new Set([rec.cat, lc, raw])) if (c) facets.add(`cat:${c}`, ord);
    facets.add(`style:${rec.style}`, ord);
    facets.add(`type:${rec.type}`, ord);
    facets.add(`grid:${rec.grid}`, ord);
    facets.add(`letter:${letterOf(rec.title || rec.slug)}`, ord);
    if (anim) {
      facets.add('anim', ord);
      for (const c of new Set([lc, rec.cat])) if (c) facets.add(`animcat:${c}`, ord);
    }
    if (site === 'lordicon' && lc) facets.add(`lvcol:${lc}`, ord);

    // Search tokens: same fields the legacy substring search looked at
    const words = new Set<string>();
    for (const text of [
      rec.title,
      rec.slug,
      meta.name,
      rec.cat,
      lc,
      raw,
      rec.style,
      meta.author,
      ...(rec.tags ?? []),
    ]) {
      for (const w of tokenize(text)) words.add(w);
    }
    for (const w of words) tokens.add(w, ord);
  });

  const recBlob = concat(recChunks, recBytes);
  const detBlob = concat(detChunks, detBytes);

  // 4. Tokens (sorted for prefix/infix scans), postings in token order
  const tokenList = [...tokens.lists.keys()].sort();
  const tokOff = new Uint32Array(tokenList.length + 1);
  let tokTotal = 0;
  tokenList.forEach((t, i) => {
    tokTotal += tokens.lists.get(t)!.length;
    tokOff[i + 1] = tokTotal;
  });
  const tokPost = new Uint32Array(tokTotal);
  tokenList.forEach((t, i) => tokPost.set(tokens.lists.get(t)!, tokOff[i]!));

  // 5. Sort orders
  const titles = icons.map(({ rec }) => rec.title || rec.slug);
  const collator = new Intl.Collator();
  const azOrder = Uint32Array.from(icons.keys()).sort((a, b) => collator.compare(titles[a]!, titles[b]!) || a - b);
  const azRank = new Uint32Array(N);
  azOrder.forEach((ord, rank) => (azRank[ord] = rank));
  // Z–A is not just A–Z reversed: equal titles still list the most recent first
  const zaOrder = Uint32Array.from(icons.keys()).sort((a, b) => collator.compare(titles[b]!, titles[a]!) || a - b);
  const zaRank = new Uint32Array(N);
  zaOrder.forEach((ord, rank) => (zaRank[ord] = rank));

  // 6. Per-collection lookup tables: ordinals grouped by collection, sorted by slug / by id
  const byCol: number[][] = collections.map(() => []);
  icons.forEach(({ col }, ord) => byCol[col]!.push(ord));
  const colStart = new Uint32Array(collections.length + 1);
  const colBySlug = new Uint32Array(N);
  const colById = new Uint32Array(N);
  let at = 0;
  byCol.forEach((ords, col) => {
    const bySlug = [...ords].sort((a, b) => cmp(icons[a]!.rec.slug, icons[b]!.rec.slug) || a - b);
    const byId = [...ords].sort((a, b) => cmp(icons[a]!.rec.id, icons[b]!.rec.id) || a - b);
    colBySlug.set(bySlug, at);
    colById.set(byId, at);
    at += ords.length;
    colStart[col + 1] = at;
  });

  // 7. Directories (collections + brands) and summary
  const collectionsDirectory = buildCollectionsDirectory(icons, collections);
  const { brandsDirectory, brandPostings } = buildBrandsDirectory(icons, collections, collectionsDirectory, taxonomy);
  const brandPacked = brandPostings.pack();
  const summary = buildSummary(icons, collections, brandsDirectory.length, taxonomy);

  const facetPacked = facets.pack();
  const header: IndexHeader = {
    version: INDEX_FORMAT_VERSION,
    buildId,
    totalIcons: N,
    dicts: {
      site: dicts.site.values as SiteId[],
      cat: dicts.cat.values,
      lc: dicts.lc.values,
      style: dicts.style.values,
      type: dicts.type.values,
      grid: dicts.grid.values,
    },
    collections,
    facets: facetPacked.refs,
    tokens: tokenList,
    collectionsDirectory,
    brandsDirectory,
    brandLists: brandPacked.refs,
    summary,
    categoryAliases: taxonomy.categoryAliases,
    lordiconCategoryLabels: Object.fromEntries(taxonomy.lordiconCategories.map((c) => [c.id, c.label])),
  };

  const index = encodeContainer(header, {
    site: colSite,
    col: colCol,
    cat: colCat,
    lc: colLc,
    style: colStyle,
    type: colType,
    grid: colGrid,
    recOff,
    rec: recBlob,
    detOff,
    facPost: facetPacked.data,
    tokOff,
    tokPost,
    brandPost: brandPacked.data,
    azOrder,
    azRank,
    zaOrder,
    zaRank,
    colStart,
    colBySlug,
    colById,
  });

  return {
    index,
    details: detBlob,
    stats: {
      icons: N,
      collections: collections.length,
      tokens: tokenList.length,
      indexBytes: index.byteLength,
      detailsBytes: detBlob.byteLength,
    },
  };
}

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

function concat(chunks: Uint8Array[], total: number): Uint8Array {
  const out = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Directories — ported from StateManager.getCollectionsDirectory / getBrandsDirectory
// ---------------------------------------------------------------------------

interface Agg {
  count: number;
  categoryCounts: Record<string, number>;
  styleCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  samples: number[];
  keywords: Set<string>;
}

const newAgg = (name: string, slug: string): Agg => ({
  count: 0,
  categoryCounts: {},
  styleCounts: {},
  typeCounts: {},
  samples: [],
  keywords: new Set([name.toLowerCase(), slug.toLowerCase()]),
});

function addToAgg(agg: Agg, rec: CatalogIconRecord, ord: number, keywordFields: 'all' | 'title') {
  agg.count += 1;
  bump(agg.categoryCounts, rec.cat);
  bump(agg.styleCounts, rec.style);
  bump(agg.typeCounts, rec.type);
  if (agg.samples.length < 8) agg.samples.push(ord);
  if (agg.keywords.size < 45) {
    if (rec.title) agg.keywords.add(rec.title.toLowerCase());
    if (keywordFields === 'all') {
      if (rec.cat) agg.keywords.add(rec.cat.toLowerCase());
      if (rec.lc) agg.keywords.add(rec.lc.toLowerCase());
    }
  }
}

function aggToEntry(
  agg: Agg,
  base: Pick<DirectoryEntry, 'slug' | 'name' | 'license'> & Partial<DirectoryEntry>,
  fallback: { category: string; style: string; type: string }
): DirectoryEntry {
  const cats = sortedCounts(agg.categoryCounts);
  const styles = sortedCounts(agg.styleCounts);
  const types = sortedCounts(agg.typeCounts);
  return {
    count: agg.count,
    primaryCategory: cats[0]?.[0] ?? fallback.category,
    primaryStyle: styles[0]?.[0] ?? fallback.style,
    primaryIconType: types[0]?.[0] ?? fallback.type,
    categories: cats.map(([id, count]) => ({ id, count })),
    styles: styles.map(([id, count]) => ({ id, count })),
    categoryCounts: agg.categoryCounts,
    styleCounts: agg.styleCounts,
    typeCounts: agg.typeCounts,
    samples: agg.samples,
    searchText: [...agg.keywords].join(' '),
    ...base,
  };
}

function buildCollectionsDirectory(icons: FlatIcon[], collections: CollectionMeta[]): DirectoryEntry[] {
  const aggs = collections.map((c) => newAgg(c.name, c.slug));
  icons.forEach(({ rec, col }, ord) => addToAgg(aggs[col]!, rec, ord, 'all'));
  const directory: DirectoryEntry[] = [];
  aggs.forEach((agg, col) => {
    if (agg.count === 0) return;
    const c = collections[col]!;
    directory.push(
      aggToEntry(
        agg,
        { site: c.site, slug: c.slug, name: c.name, license: c.license || 'MIT / CC0', author: c.author },
        { category: 'interface', style: 'outlined', type: 'ui-icon' }
      )
    );
  });
  // Rich multi-icon collections first (stable → ties keep "recently updated" order)
  return directory.sort((a, b) => b.count - a.count);
}

function buildBrandsDirectory(
  icons: FlatIcon[],
  collections: CollectionMeta[],
  collectionsDirectory: DirectoryEntry[],
  taxonomy: TaxonomyInput
): { brandsDirectory: DirectoryEntry[]; brandPostings: PostingBuilder } {
  const strict = new Set(taxonomy.strictBrandCollections);
  const slugOf = (f: FlatIcon) => collections[f.col]!.slug;
  const brandPool: number[] = [];
  icons.forEach((f, ord) => {
    if (f.site === 'thesvg' || f.rec.type === 'brand-logo' || strict.has(slugOf(f))) brandPool.push(ord);
  });

  const brandsDirectory: DirectoryEntry[] = [];
  const brandPostings = new PostingBuilder();

  for (const def of taxonomy.brands) {
    if (def.exactCol) {
      const col = collectionsDirectory.find((c) => c.slug === def.exactCol);
      if (col) {
        brandsDirectory.push({
          ...col,
          name: def.name || col.name,
          primaryCategory: def.primaryCategory || col.primaryCategory,
          isBrandGroup: true,
          brandTier: def.tier || 1,
        });
      }
      continue;
    }
    if (!def.regex) continue;

    const primary: number[] = [];
    icons.forEach((f, ord) => {
      if (slugOf(f) === def.slug) primary.push(ord);
    });
    const primarySet = new Set(primary);
    const extra = brandPool.filter((ord) => {
      if (primarySet.has(ord)) return false;
      const { rec } = icons[ord]!;
      return def.regex!.test(`${rec.slug} ${rec.title}`);
    });
    const matched = [...primary, ...extra];
    if (matched.length === 0) continue;

    const agg = newAgg(def.name, def.slug);
    for (const ord of matched) addToAgg(agg, icons[ord]!.rec, ord, 'title');
    brandPostings.lists.set(def.slug, matched);

    const entry = aggToEntry(
      agg,
      {
        slug: def.slug,
        name: def.name,
        license: 'Brand Trademarks / MIT',
        isBrandGroup: true,
        brandTier: def.tier || 1,
      },
      { category: 'brand', style: 'multicolor', type: 'brand-logo' }
    );
    entry.primaryCategory = def.primaryCategory || entry.primaryCategory;
    entry.primaryIconType = 'brand-logo';
    brandsDirectory.push(entry);
  }

  return { brandsDirectory, brandPostings };
}

function buildSummary(
  icons: FlatIcon[],
  collections: CollectionMeta[],
  totalBrands: number,
  taxonomy: TaxonomyInput
): IndexSummary {
  const category: Record<string, number> = {};
  const animated: Record<string, number> = {};
  const style: Record<string, number> = {};
  const type: Record<string, number> = {};
  const site: Record<string, number> = {};
  for (const { rec, site: s } of icons) {
    bump(category, rec.cat);
    if (isAnimated(s, rec.type)) bump(animated, rec.lc || rec.cat);
    bump(style, rec.style);
    bump(type, rec.type);
    bump(site, s);
  }
  const brandCat: Record<string, number> = {};
  for (const b of taxonomy.brands) if (b.primaryCategory) bump(brandCat, b.primaryCategory);

  return {
    totalIcons: icons.length,
    totalCollections: collections.length,
    totalBrands,
    categories: taxonomy.categories.map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon,
      count: category[c.id] ?? 0,
      animatedCount: animated[c.id] ?? 0,
      brandCount: brandCat[c.id] ?? 0,
    })),
    lordiconCategories: taxonomy.lordiconCategories.map((c) => ({
      id: c.id,
      label: c.label,
      labelVi: c.labelVi,
      appCategory: c.appCategory,
      count: animated[c.id] ?? 0,
    })),
    styles: taxonomy.styles.map((s) => ({ ...s, count: style[s.id] ?? 0 })),
    iconTypes: taxonomy.iconTypes.map((t) => ({ ...t, count: type[t.id] ?? 0 })),
    sites: taxonomy.sites.map((s) => ({ ...s, count: site[s.id] ?? 0 })),
  };
}
