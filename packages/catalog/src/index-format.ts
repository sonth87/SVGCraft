/** Types shared by the index builder and the runtime query engine. */
import type { SiteId } from './schema';

export const INDEX_FORMAT_VERSION = 2;
/** Field separator inside a packed icon record (`id␟slug␟title␟file␟hash`) */
export const REC_SEP = '\u001f';

export interface TaxonomyInput {
  categories: { id: string; label: string; icon?: string }[];
  lordiconCategories: { id: string; label: string; labelVi?: string; appCategory?: string }[];
  styles: { id: string; label: string }[];
  iconTypes: { id: string; label: string }[];
  sites: { id: SiteId; label: string }[];
  /** Curated brand ecosystems. `regex` brands become virtual collections; `exactCol` brands alias a real one */
  brands: {
    slug: string;
    name: string;
    primaryCategory?: string;
    tier?: number;
    exactCol?: string;
    regex?: RegExp;
  }[];
  strictBrandCollections: string[];
  /** Legacy category id → current id (e.g. `finance` → `business-and-finance`) */
  categoryAliases: Record<string, string>;
}

export interface CollectionMeta {
  site: SiteId;
  slug: string;
  name: string;
  author: string;
  license: string;
  description?: string;
  sourceUrl?: string;
  updatedAt?: string;
  count: number;
}

/** Directory card (collections / brands listing). `samples` are icon ordinals. */
export interface DirectoryEntry {
  site?: SiteId;
  slug: string;
  name: string;
  license: string;
  author?: string;
  count: number;
  primaryCategory: string;
  primaryStyle: string;
  primaryIconType: string;
  categories: { id: string; count: number }[];
  styles: { id: string; count: number }[];
  categoryCounts: Record<string, number>;
  styleCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  samples: number[];
  searchText: string;
  isBrandGroup?: boolean;
  brandTier?: number;
}

export interface IndexSummary {
  totalIcons: number;
  totalCollections: number;
  totalBrands: number;
  categories: { id: string; label: string; icon?: string; count: number; animatedCount: number; brandCount: number }[];
  lordiconCategories: { id: string; label: string; labelVi?: string; appCategory?: string; count: number }[];
  styles: { id: string; label: string; count: number }[];
  iconTypes: { id: string; label: string; count: number }[];
  sites: { id: string; label: string; count: number }[];
}

export interface IndexHeader {
  version: number;
  buildId: string;
  totalIcons: number;
  dicts: {
    site: SiteId[];
    cat: string[];
    lc: string[];
    style: string[];
    type: string[];
    grid: string[];
  };
  /** In "most recently updated first" order; position = collection index used by the `col` column */
  collections: CollectionMeta[];
  /** Facet key → [start, length] into the `facPost` section */
  facets: Record<string, [number, number]>;
  /** Sorted unique search tokens; postings in `tokOff`/`tokPost` */
  tokens: string[];
  collectionsDirectory: DirectoryEntry[];
  brandsDirectory: DirectoryEntry[];
  /** Regex brand slug → [start, length] into `brandPost` (natural order: own collection first) */
  brandLists: Record<string, [number, number]>;
  summary: IndexSummary;
  categoryAliases: Record<string, string>;
  lordiconCategoryLabels: Record<string, string>;
}

/** Per-icon data only needed on the detail page; stored in `details.bin`, read on demand. */
export interface IconDetailsRecord {
  raw?: string;
  tags?: string[];
  files: Record<string, string>;
  hash?: Record<string, string>;
  /** Lottie content hash (`lottie/{hash}.json` on R2) */
  lottie?: string;
  at: string;
}
