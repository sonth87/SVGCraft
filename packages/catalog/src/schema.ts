/**
 * Shape of the committed catalog in `data/catalog/` (source of truth for the web app).
 *
 *   data/catalog/
 *     manifest.json                     totals + schema version
 *     collections.json                  one collection summary per line
 *     collections/{site}/{slug}.json    collection header + one icon per line
 *
 * Keys are short because the catalog holds ~250k icon lines; every byte is multiplied.
 */

export const CATALOG_SCHEMA_VERSION = 1;

export type SiteId = 'svgrepo' | 'thesvg' | 'allsvgicons' | 'lordicon';
export const SITE_IDS: readonly SiteId[] = ['svgrepo', 'thesvg', 'allsvgicons', 'lordicon'];

export interface CatalogIconRecord {
  id: string;
  slug: string;
  title: string;
  /** App category (already normalized, e.g. `interface`) */
  cat: string;
  /** Raw category from the source site, only when it differs from `cat` */
  raw?: string;
  /** Animated-icon category (Lordicon taxonomy). Empty for static icons */
  lc?: string;
  style: string;
  type: string;
  grid: string;
  tags?: string[];
  /**
   * File name per variant inside the collection's `icons/` folder, e.g. `{ default: 'video-513569.svg' }`.
   * Also the legacy R2 key: `{site}/{collection}/icons/{file}`.
   * Omitted when it is just `{ default: defaultIconFileName(id, slug) }` (the vast majority) — use `iconFiles()`.
   */
  files?: Record<string, string>;
  /**
   * Content hash per variant. Present only once the object is on R2 at `svg/{hash}.svg`,
   * so this doubles as the R2 sync state (no separate state file).
   */
  hash?: Record<string, string>;
  /**
   * Content hash of the animation data (Lordicon Lottie JSON). Present only once it is on R2 at
   * `lottie/{hash}.json`.
   */
  lottie?: string;
  /** Crawl time (ISO). Drives the default "recent" order */
  at: string;
}

export interface CatalogCollection {
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

export interface CatalogCollectionFile extends CatalogCollection {
  icons: CatalogIconRecord[];
}

export interface CatalogManifest {
  schema: number;
  totalIcons: number;
  totalCollections: number;
  /** Icons whose every variant is on R2 under its hash key */
  hashedIcons: number;
  /** Icons with animation data on R2 */
  lottieIcons?: number;
}

/** Crawler naming rule for the default variant file: `{slug}-{id}.svg`. */
export function defaultIconFileName(id: string, slug: string): string {
  const safe = String(slug || 'icon').replace(/[^a-zA-Z0-9-_]/g, '-');
  return id ? `${safe}-${id}.svg` : `${safe}.svg`;
}

export function iconFiles(rec: Pick<CatalogIconRecord, 'id' | 'slug' | 'files'>): Record<string, string> {
  return rec.files ?? { default: defaultIconFileName(rec.id, rec.slug) };
}

// ---------------------------------------------------------------------------
// Serialization: stable, diff-friendly JSON (one record per line)
// ---------------------------------------------------------------------------

export function serializeCollectionFile(file: CatalogCollectionFile): string {
  const { icons, ...header } = file;
  const headerJson = JSON.stringify(header);
  const lines = icons.map((ic) => JSON.stringify(ic));
  // `{"site":..., "icons":[\n{...},\n{...}\n]}`
  return `${headerJson.slice(0, -1)},"icons":[\n${lines.join(',\n')}\n]}\n`;
}

export function serializeCollectionsList(list: CatalogCollection[]): string {
  return `[\n${list.map((c) => JSON.stringify(c)).join(',\n')}\n]\n`;
}

/** Stable icon order inside a collection file, so re-publishing only diffs changed lines. */
export function compareIconRecords(a: CatalogIconRecord, b: CatalogIconRecord): number {
  if (a.slug !== b.slug) return a.slug < b.slug ? -1 : 1;
  if (a.id !== b.id) return a.id < b.id ? -1 : 1;
  return 0;
}
