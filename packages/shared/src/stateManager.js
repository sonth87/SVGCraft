const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const {
  CATEGORY_DEFINITIONS,
  STYLE_TYPES,
  ICON_TYPES,
  parseSvgMetadata,
  extractTagsFromText,
  classifyIcon,
  findRelatedIcons,
} = require('./taxonomy');
const { loadEnvFiles } = require('./r2Client');

loadEnvFiles();

function resolveRepoRoot() {
  const cwd = globalThis.process.env.SVGCRAFT_ROOT || globalThis.process.cwd();
  const base = path.basename(cwd);
  const parent = path.basename(path.dirname(cwd));
  if (parent === 'apps' && (base === 'web' || base === 'crawler')) {
    return path.resolve(cwd, '..', '..');
  }
  return cwd;
}

const ROOT_DIR = resolveRepoRoot();
const dynamicRequire = typeof eval === 'function' ? eval('require') : require;
const runtimeFs = dynamicRequire('fs');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const OUTPUT_DIR = path.join(ROOT_DIR, 'output');
const STATE_FILE = path.join(DATA_DIR, 'crawl-state.json');
const LOCAL_APP_CATALOG_GZ = path.resolve(process.cwd(), 'data', 'catalog-index.json.gz');
const CATALOG_INDEX_GZ_FILE = fs.existsSync(LOCAL_APP_CATALOG_GZ)
  ? LOCAL_APP_CATALOG_GZ
  : path.join(DATA_DIR, 'catalog-index.json.gz');

function ensureDir(dirPath) {
  try {
    if (!runtimeFs['existsSync'](dirPath)) {
      runtimeFs['mkdirSync'](dirPath, { recursive: true });
    }
  } catch {
    // Ignore on read-only serverless filesystems (e.g. Vercel)
  }
}

class StateManager {
  constructor() {
    ensureDir(DATA_DIR);
    ensureDir(OUTPUT_DIR);
    this.state = this.loadState();
    this._collectionCache = new Map();
    this._collectionListCache = new Map();
    this._catalogSnapshot = null;
    this._activeCollectionMem = null; // { key, meta }
  }

  buildAssetUrl(siteId, colSlug, relativePath) {
    const r2Public = (process.env.R2_PUBLIC_URL || '').trim().replace(/\/+$/, '');
    if (r2Public) {
      return `${r2Public}/${encodeURIComponent(siteId)}/${encodeURIComponent(colSlug)}/${relativePath}`;
    }
    return `/output/${encodeURIComponent(siteId)}/${encodeURIComponent(colSlug)}/${relativePath}`;
  }

  getDefaultState() {
    return {
      sites: {
        svgrepo: {
          currentCategory: 'all',
          currentListPage: 1,
          completedCollections: [],
          collectionProgress: {},
          totalCollectionsCrawled: 0,
          totalIconsDownloaded: 0,
          lastUpdatedAt: null,
        },
        thesvg: {
          currentCategory: 'all',
          currentListPage: 1,
          completedCollections: [],
          collectionProgress: {},
          totalCollectionsCrawled: 0,
          totalIconsDownloaded: 0,
          lastUpdatedAt: null,
        },
      },
    };
  }

  loadState() {
    try {
      if (runtimeFs['existsSync'](STATE_FILE)) {
        const raw = runtimeFs['readFileSync'](STATE_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          sites: {
            ...this.getDefaultState().sites,
            ...(parsed.sites || {}),
          },
        };
      }
    } catch (err) {
      console.error('Failed to load crawl state, using default:', err.message);
    }
    return this.getDefaultState();
  }

  saveState() {
    ensureDir(DATA_DIR);
    runtimeFs['writeFileSync'](STATE_FILE, JSON.stringify(this.state, null, 2), 'utf8');
  }

  getSiteState(siteId) {
    if (!this.state.sites[siteId]) {
      this.state.sites[siteId] = {
        currentCategory: 'all',
        currentListPage: 1,
        completedCollections: [],
        collectionProgress: {},
        totalCollectionsCrawled: 0,
        totalIconsDownloaded: 0,
        lastUpdatedAt: null,
      };
    }
    return this.state.sites[siteId];
  }

  updateSiteState(siteId, updater) {
    const siteState = this.getSiteState(siteId);
    updater(siteState);
    siteState.lastUpdatedAt = new Date().toISOString();
    this.saveState();
    return siteState;
  }

  resetSiteState(siteId) {
    this.state = this.loadState();
    this.state.sites[siteId] = {
      currentCategory: 'all',
      currentListPage: 1,
      completedCollections: [],
      collectionProgress: {},
      totalCollectionsCrawled: 0,
      totalIconsDownloaded: 0,
      lastUpdatedAt: new Date().toISOString(),
    };
    this.saveState();
    return this.state.sites[siteId];
  }

  getCollectionDir(siteId, collectionSlug) {
    const safeSlug = String(collectionSlug).replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(OUTPUT_DIR, siteId, safeSlug);
  }

  getCollectionMetadataPath(siteId, collectionSlug) {
    return path.join(this.getCollectionDir(siteId, collectionSlug), 'metadata.json');
  }

  loadCollectionMetadata(siteId, collectionSlug) {
    const key = `${siteId}/${collectionSlug}`;
    if (this._activeCollectionMem && this._activeCollectionMem.key === key) {
      return this._activeCollectionMem.meta;
    }
    const metaPath = this.getCollectionMetadataPath(siteId, collectionSlug);
    if (runtimeFs['existsSync'](metaPath)) {
      try {
        return JSON.parse(runtimeFs['readFileSync'](metaPath, 'utf8'));
      } catch {
        return null;
      }
    }
    return null;
  }

  saveCollectionMetadata(siteId, collectionInfo) {
    const colDir = this.getCollectionDir(siteId, collectionInfo.slug);
    const iconsDir = path.join(colDir, 'icons');
    ensureDir(colDir);
    ensureDir(iconsDir);

    const existing = this.loadCollectionMetadata(siteId, collectionInfo.slug);
    const merged = {
      site: siteId,
      collection: {
        ...(existing?.collection || {}),
        ...collectionInfo,
        updatedAt: new Date().toISOString(),
        crawledAt: existing?.collection?.crawledAt || new Date().toISOString(),
      },
      icons: existing?.icons || [],
    };

    const key = `${siteId}/${collectionInfo.slug}`;
    this._activeCollectionMem = { key, meta: merged };

    runtimeFs['writeFileSync'](
      this.getCollectionMetadataPath(siteId, collectionInfo.slug),
      JSON.stringify(merged, null, 2),
      'utf8'
    );
    return merged;
  }

  isIconDownloaded(siteId, collectionSlug, iconId, iconSlug) {
    const colDir = this.getCollectionDir(siteId, collectionSlug);
    const safeIconSlug = String(iconSlug || 'icon').replace(/[^a-zA-Z0-9-_]/g, '-');
    const fileName = iconId ? `${safeIconSlug}-${iconId}.svg` : `${safeIconSlug}.svg`;
    const filePath = path.join(colDir, 'icons', fileName);
    return runtimeFs['existsSync'](filePath) && runtimeFs['statSync'](filePath).size > 20;
  }

  /**
   * Save an individual SVG file (plus optional light/dark variants) and update metadata.json
   */
  saveIconSvg(siteId, collectionSlug, iconData, svgContent, extraVariants = {}) {
    const colDir = this.getCollectionDir(siteId, collectionSlug);
    const iconsDir = path.join(colDir, 'icons');
    ensureDir(iconsDir);

    const safeIconSlug = String(iconData.slug || 'icon').replace(/[^a-zA-Z0-9-_]/g, '-');
    const fileName = iconData.id ? `${safeIconSlug}-${iconData.id}.svg` : `${safeIconSlug}.svg`;
    const filePath = path.join(iconsDir, fileName);

    runtimeFs['writeFileSync'](filePath, svgContent, 'utf8');

    const variantsMap = {
      default: `icons/${fileName}`,
    };

    // Save any extra variants (e.g. light.svg, dark.svg from thesvg.org)
    for (const [varName, varSvgXml] of Object.entries(extraVariants || {})) {
      if (varSvgXml && varSvgXml.includes('<svg')) {
        const varFileName = iconData.id
          ? `${safeIconSlug}-${iconData.id}.${varName}.svg`
          : `${safeIconSlug}.${varName}.svg`;
        runtimeFs['writeFileSync'](path.join(iconsDir, varFileName), varSvgXml, 'utf8');
        variantsMap[varName] = `icons/${varFileName}`;
      }
    }

    const dimensions = parseSvgMetadata(svgContent);
    const key = `${siteId}/${collectionSlug}`;
    const meta =
      (this._activeCollectionMem && this._activeCollectionMem.key === key
        ? this._activeCollectionMem.meta
        : this.loadCollectionMetadata(siteId, collectionSlug)) || {
        site: siteId,
        collection: { slug: collectionSlug },
        icons: [],
      };

    this._activeCollectionMem = { key, meta };

    const iconTags = Array.from(
      new Set([
        ...(iconData.tags || []),
        ...extractTagsFromText(iconData.slug, iconData.title, iconData.rawCategory, collectionSlug),
      ])
    );

    const classification = classifyIcon({
      siteId,
      collectionSlug,
      collectionName: meta.collection?.name || collectionSlug,
      rawCategory: iconData.rawCategory || meta.collection?.category || '',
      title: iconData.title || iconData.slug || '',
      slug: iconData.slug || '',
      detectedStyle: dimensions.detectedStyle,
    });

    const iconRecord = {
      id: String(iconData.id || iconData.slug || ''),
      title: iconData.title || iconData.slug || '',
      slug: iconData.slug || '',
      fileName,
      relativePath: `icons/${fileName}`,
      variants: variantsMap,
      sourceUrl: iconData.sourceUrl || '',
      detailUrl: iconData.detailUrl || '',
      width: dimensions.width,
      height: dimensions.height,
      viewBox: dimensions.viewBox,
      gridSize: dimensions.gridSize,
      fileSizeBytes: dimensions.fileSizeBytes,
      colorPalette: dimensions.colorPalette || [],
      category: iconData.category || classification.category,
      rawCategory: iconData.rawCategory || meta.collection?.category || '',
      styleType: iconData.styleType || classification.styleType,
      iconType: iconData.iconType || classification.iconType,
      license: iconData.license || meta.collection?.license || 'MIT / CC0',
      author: iconData.author || meta.collection?.author || (siteId === 'thesvg' ? 'theSVG' : 'SVG Repo'),
      tags: iconTags,
      downloadedAt: new Date().toISOString(),
    };

    const existingIdx = meta.icons.findIndex(
      (item) => (item.id && item.id === iconRecord.id) || item.fileName === iconRecord.fileName
    );
    if (existingIdx >= 0) {
      meta.icons[existingIdx] = iconRecord;
    } else {
      meta.icons.push(iconRecord);
    }

    meta.collection.downloadedIconsCount = meta.icons.length;
    meta.collection.updatedAt = new Date().toISOString();

    runtimeFs['writeFileSync'](
      this.getCollectionMetadataPath(siteId, collectionSlug),
      JSON.stringify(meta, null, 2),
      'utf8'
    );

    iconRecord._collectionIconsCount = meta.icons.length;
    return iconRecord;
  }

  /**
   * Ensure metadata records are enriched with accurate taxonomy fields on read
   */
  enrichIconRecord(icon, siteId, collection) {
    let category = icon.category;
    let styleType = icon.styleType;
    let iconType = icon.iconType;

    if (!category || !styleType || !iconType) {
      const classification = classifyIcon({
        siteId,
        collectionSlug: collection?.slug || '',
        collectionName: collection?.name || '',
        rawCategory: icon.rawCategory || collection?.category || '',
        title: icon.title || icon.slug || '',
        slug: icon.slug || '',
        detectedStyle: icon.styleType || 'filled',
      });
      category = category || classification.category;
      styleType = styleType || classification.styleType;
      iconType = iconType || classification.iconType;
    }

    const colSlug = collection?.slug || '';
    const colName = collection?.name || colSlug;

    return {
      id: icon.id,
      title: icon.title,
      slug: icon.slug,
      fileName: icon.fileName,
      relativePath: icon.relativePath,
      variants: icon.variants || { default: icon.relativePath },
      gridSize: icon.gridSize,
      category,
      rawCategory: icon.rawCategory || '',
      styleType,
      iconType,
      author: icon.author,
      license: icon.license,
      tags: icon.tags || [],
      downloadedAt: icon.downloadedAt,
      _ts: icon.downloadedAt ? Date.parse(icon.downloadedAt) || 0 : 0,
      site: siteId,
      collectionSlug: colSlug,
      collectionName: colName,
      assetUrl: this.buildAssetUrl(siteId, colSlug, icon.relativePath),
    };
  }

  /**
   * Lightweight cache entry used by Crawler Studio's listCrawledCollections (only stores 6 sample icons per collection, never all icons)
   */
  _getCachedCollectionListEntry(sId, cSlug) {
    const metaPath = this.getCollectionMetadataPath(sId, cSlug);
    if (!runtimeFs['existsSync'](metaPath)) return null;

    let stat;
    try {
      stat = runtimeFs['statSync'](metaPath);
    } catch {
      return null;
    }

    const cacheKey = `${sId}/${cSlug}`;
    const cached = this._collectionListCache.get(cacheKey);
    if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
      return cached.listEntry;
    }

    const meta = this.loadCollectionMetadata(sId, cSlug);
    if (!meta) return null;

    const colInfo = {
      site: sId,
      ...meta.collection,
      slug: meta.collection?.slug || cSlug,
      name: meta.collection?.name || cSlug,
      downloadedIconsCount: (meta.icons || []).length,
    };

    const sampleIcons = (meta.icons || [])
      .slice(0, 6)
      .map((ic) => this.enrichIconRecord(ic, sId, colInfo));

    const listEntry = {
      ...colInfo,
      sampleIcons,
    };

    this._collectionListCache.set(cacheKey, {
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      listEntry,
    });

    return listEntry;
  }

  _getCachedCollectionEntry(sId, cSlug) {
    const metaPath = this.getCollectionMetadataPath(sId, cSlug);
    if (!runtimeFs['existsSync'](metaPath)) return null;

    let stat;
    try {
      stat = runtimeFs['statSync'](metaPath);
    } catch {
      return null;
    }

    const cacheKey = `${sId}/${cSlug}`;
    const cached = this._collectionCache.get(cacheKey);
    if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
      return cached;
    }

    const meta = this.loadCollectionMetadata(sId, cSlug);
    if (!meta) return null;

    const colInfo = {
      site: sId,
      ...meta.collection,
      slug: meta.collection?.slug || cSlug,
      name: meta.collection?.name || cSlug,
      downloadedIconsCount: (meta.icons || []).length,
    };

    const enrichedIcons = (meta.icons || []).map((ic) =>
      this.enrichIconRecord(ic, sId, colInfo)
    );

    const entry = {
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      colInfo,
      enrichedIcons,
    };

    this._collectionCache.set(cacheKey, entry);
    return entry;
  }

  listCrawledCollections(siteId = null, limit = 36) {
    ensureDir(OUTPUT_DIR);
    if (!runtimeFs['existsSync'](OUTPUT_DIR)) return [];
    const results = [];
    const siteDirs = siteId
      ? [siteId]
      : runtimeFs['readdirSync'](OUTPUT_DIR).filter((d) => {
          const full = path.join(OUTPUT_DIR, d);
          return runtimeFs['existsSync'](full) && runtimeFs['statSync'](full).isDirectory();
        });

    for (const sId of siteDirs) {
      const sitePath = path.join(OUTPUT_DIR, sId);
      if (!runtimeFs['existsSync'](sitePath)) continue;

      const colDirs = runtimeFs['readdirSync'](sitePath).filter((d) => {
        const full = path.join(sitePath, d);
        return runtimeFs['existsSync'](full) && runtimeFs['statSync'](full).isDirectory();
      });

      for (const cSlug of colDirs) {
        const listEntry = this._getCachedCollectionListEntry(sId, cSlug);
        if (listEntry) {
          results.push(listEntry);
        }
      }
    }

    results.sort((a, b) => {
      const ta = new Date(a.updatedAt || a.crawledAt || 0).getTime();
      const tb = new Date(b.updatedAt || b.crawledAt || 0).getTime();
      return tb - ta;
    });

    return limit > 0 ? results.slice(0, limit) : results;
  }

  /**
   * Hydrate catalog from compressed data/catalog-index.json.gz (used on Vercel / cloud deployment where output/ is stored on R2)
   */
  _loadFromCompactIndex() {
    if (!fs.existsSync(CATALOG_INDEX_GZ_FILE)) {
      return { allIcons: [], collections: [] };
    }

    const stat = fs.statSync(CATALOG_INDEX_GZ_FILE);
    const r2Key = process.env.R2_PUBLIC_URL || '';
    const signature = `gz:${stat.mtimeMs}:${stat.size}:${r2Key}`;
    if (this._catalogSnapshot && this._catalogSnapshot.signature === signature) {
      return {
        allIcons: this._catalogSnapshot.allIcons,
        collections: this._catalogSnapshot.collections,
      };
    }

    const rawGz = fs.readFileSync(CATALOG_INDEX_GZ_FILE);
    const parsed = JSON.parse(zlib.gunzipSync(rawGz).toString('utf8'));

    const colMap = new Map();
    const collections = (parsed.collections || []).map((row) => {
      const [site, slug, name, author, license, count] = row;
      const colObj = {
        site,
        slug,
        name: name || slug,
        author: author || (site === 'thesvg' ? 'theSVG' : 'SVG Repo'),
        license: license || 'MIT / CC0',
        downloadedIconsCount: count || 0,
        totalIcons: count || 0,
      };
      colMap.set(`${site}:${slug}`, colObj);
      return colObj;
    });

    const allIcons = (parsed.icons || []).map((row, idx) => {
      const [siteCode, colSlug, id, slug, title, category, styleType, iconType, gridSize, varKeys] = row;
      const siteId = siteCode === 1 ? 'thesvg' : 'svgrepo';
      const colObj = colMap.get(`${siteId}:${colSlug}`);
      const safeIconSlug = String(slug || 'icon').replace(/[^a-zA-Z0-9-_]/g, '-');
      const fileName = id && siteId !== 'thesvg' ? `${safeIconSlug}-${id}.svg` : `${safeIconSlug}.svg`;
      const relativePath = `icons/${fileName}`;

      const variants = { default: relativePath };
      if (Array.isArray(varKeys)) {
        for (const vk of varKeys) {
          if (vk === 'default') continue;
          const vFile = id && siteId !== 'thesvg' ? `${safeIconSlug}-${id}.${vk}.svg` : `${safeIconSlug}.${vk}.svg`;
          variants[vk] = `icons/${vFile}`;
        }
      }

      return {
        id: String(id || slug),
        title: title || slug,
        slug,
        fileName,
        relativePath,
        variants,
        gridSize: gridSize || '24x24',
        category: category || 'interface',
        rawCategory: '',
        styleType: styleType || 'filled',
        iconType: iconType || 'ui-icon',
        author: colObj?.author || (siteId === 'thesvg' ? 'theSVG' : 'SVG Repo'),
        license: colObj?.license || 'MIT / CC0',
        tags: extractTagsFromText(slug, title, colSlug),
        _ts: 1700000000000 - idx,
        site: siteId,
        collectionSlug: colSlug,
        collectionName: colObj?.name || colSlug,
        assetUrl: this.buildAssetUrl(siteId, colSlug, relativePath),
      };
    });

    this._catalogSnapshot = {
      signature,
      allIcons,
      collections,
      summary: null,
    };

    return { allIcons, collections };
  }

  /**
   * Load all icons across all collections with full taxonomy enrichment
   */
  loadAllEnrichedIcons() {
    ensureDir(OUTPUT_DIR);
    const entries = [];
    let signatureSum = 0;

    if (runtimeFs['existsSync'](OUTPUT_DIR)) {
      const siteDirs = runtimeFs['readdirSync'](OUTPUT_DIR).filter((d) => {
        const full = path.join(OUTPUT_DIR, d);
        return runtimeFs['existsSync'](full) && runtimeFs['statSync'](full).isDirectory();
      });

      for (const sId of siteDirs) {
        const sitePath = path.join(OUTPUT_DIR, sId);
        const colDirs = runtimeFs['readdirSync'](sitePath).filter((d) => {
          const full = path.join(sitePath, d);
          return runtimeFs['existsSync'](full) && runtimeFs['statSync'](full).isDirectory();
        });

        for (const cSlug of colDirs) {
          const entry = this._getCachedCollectionEntry(sId, cSlug);
          if (!entry) continue;
          entries.push(entry);
          signatureSum += entry.mtimeMs + entry.size;
        }
      }
    }

    // Fallback to compact gzipped catalog index (e.g. on Vercel deployment with Cloudflare R2 storage)
    if (entries.length === 0 && fs.existsSync(CATALOG_INDEX_GZ_FILE)) {
      return this._loadFromCompactIndex();
    }

    const r2Key = process.env.R2_PUBLIC_URL || '';
    const signature = `${entries.length}:${signatureSum}:${r2Key}`;
    if (this._catalogSnapshot && this._catalogSnapshot.signature === signature) {
      return {
        allIcons: this._catalogSnapshot.allIcons,
        collections: this._catalogSnapshot.collections,
      };
    }

    const allIcons = [];
    const collections = [];
    for (const entry of entries) {
      collections.push(entry.colInfo);
      for (const ic of entry.enrichedIcons) {
        allIcons.push(ic);
      }
    }

    // Pre-sort by most recently downloaded so default 'recent' queries don't need to sort 125k+ items
    allIcons.sort((a, b) => b._ts - a._ts);

    collections.sort((a, b) => {
      const ta = a.updatedAt || a.crawledAt ? Date.parse(a.updatedAt || a.crawledAt) || 0 : 0;
      const tb = b.updatedAt || b.crawledAt ? Date.parse(b.updatedAt || b.crawledAt) || 0 : 0;
      return tb - ta;
    });

    this._catalogSnapshot = {
      signature,
      allIcons,
      collections,
      summary: null,
    };

    return { allIcons, collections };
  }

  /**
   * Get full catalog summary (counts per category, styleType, iconType, site, collection, letter)
   */
  getCatalogSummary() {
    const { allIcons, collections } = this.loadAllEnrichedIcons();
    if (this._catalogSnapshot && this._catalogSnapshot.summary) {
      return this._catalogSnapshot.summary;
    }

    const categoryCounts = {};
    const styleCounts = {};
    const typeCounts = {};
    const siteCounts = {};
    const gridCounts = {};

    for (const ic of allIcons) {
      categoryCounts[ic.category] = (categoryCounts[ic.category] || 0) + 1;
      styleCounts[ic.styleType] = (styleCounts[ic.styleType] || 0) + 1;
      typeCounts[ic.iconType] = (typeCounts[ic.iconType] || 0) + 1;
      siteCounts[ic.site] = (siteCounts[ic.site] || 0) + 1;
      if (ic.gridSize) {
        gridCounts[ic.gridSize] = (gridCounts[ic.gridSize] || 0) + 1;
      }
    }

    const summary = {
      totalIcons: allIcons.length,
      totalCollections: collections.length,
      categories: CATEGORY_DEFINITIONS.map((c) => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        count: categoryCounts[c.id] || 0,
      })),
      styles: STYLE_TYPES.map((s) => ({
        id: s.id,
        label: s.label,
        count: styleCounts[s.id] || 0,
      })),
      iconTypes: ICON_TYPES.map((t) => ({
        id: t.id,
        label: t.label,
        count: typeCounts[t.id] || 0,
      })),
      sites: [
        { id: 'svgrepo', label: 'SVG Repo', count: siteCounts.svgrepo || 0 },
        { id: 'thesvg', label: 'theSVG.org', count: siteCounts.thesvg || 0 },
      ],
      gridSizes: Object.entries(gridCounts).map(([size, count]) => ({ size, count })),
      collections: collections.map((c) => ({
        site: c.site,
        slug: c.slug,
        name: c.name,
        author: c.author,
        license: c.license,
        count: c.downloadedIconsCount,
        totalIcons: c.totalIcons,
      })),
    };

    if (this._catalogSnapshot) {
      this._catalogSnapshot.summary = summary;
    }

    return summary;
  }

  /**
   * Filter, search, sort, and paginate icons for the theSVG-style web showcase
   */
  queryIcons({
    q = '',
    category = '',
    styleType = '',
    iconType = '',
    site = '',
    collection = '',
    gridSize = '',
    letter = '',
    sort = 'recent',
    offset = 0,
    limit = 120,
  } = {}) {
    const { allIcons } = this.loadAllEnrichedIcons();
    const query = String(q || '').trim().toLowerCase();

    let filtered = allIcons.filter((ic) => {
      if (site && ic.site !== site) return false;
      if (category && ic.category !== category) return false;
      if (styleType && ic.styleType !== styleType) return false;
      if (iconType && ic.iconType !== iconType) return false;
      if (collection && ic.collectionSlug !== collection) return false;
      if (gridSize && ic.gridSize !== gridSize) return false;
      if (letter) {
        const firstChar = (ic.title || ic.slug || '').charAt(0).toUpperCase();
        if (letter === '#') {
          if (/[A-Z]/.test(firstChar)) return false;
        } else if (firstChar !== letter.toUpperCase()) {
          return false;
        }
      }
      if (query) {
        const haystack = [
          ic.title,
          ic.slug,
          ic.collectionName,
          ic.category,
          ic.rawCategory,
          ic.styleType,
          ic.author,
          ...(ic.tags || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sort === 'az') {
      filtered.sort((a, b) => (a.title || a.slug).localeCompare(b.title || b.slug));
    } else if (sort === 'za') {
      filtered.sort((a, b) => (b.title || b.slug).localeCompare(a.title || a.slug));
    }
    // Note: for sort === 'recent', allIcons is already sorted by _ts descending!

    const total = filtered.length;
    const items = filtered.slice(Number(offset) || 0, (Number(offset) || 0) + (Number(limit) || 120));

    return {
      total,
      offset: Number(offset) || 0,
      limit: Number(limit) || 120,
      items,
    };
  }

  /**
   * Get single collection metadata + icons within that collection for the dedicated Collection Screen
   */
  getCollectionDetails(
    siteId,
    collectionSlug,
    { q = '', styleType = '', category = '', sort = 'az', offset = 0, limit = 120 } = {}
  ) {
    let targetSite = siteId;
    let entry = null;

    if (targetSite && targetSite !== 'any') {
      entry = this._getCachedCollectionEntry(targetSite, collectionSlug);
    }

    const { allIcons, collections } = this.loadAllEnrichedIcons();
    const foundCol = collections.find(
      (c) => c.slug === collectionSlug && (!targetSite || targetSite === 'any' || c.site === targetSite)
    ) || collections.find((c) => c.slug === collectionSlug);

    if (!entry && foundCol) {
      targetSite = foundCol.site;
      entry = this._getCachedCollectionEntry(targetSite, collectionSlug);
    }

    if (!entry && !foundCol) return null;

    const colInfo = entry ? entry.colInfo : foundCol;
    const allColIcons = entry
      ? entry.enrichedIcons || []
      : allIcons.filter((ic) => ic.site === targetSite && ic.collectionSlug === collectionSlug);
    const query = String(q || '').trim().toLowerCase();

    const styleCounts = {};
    const categoryCounts = {};
    const gridSizes = new Set();

    for (const ic of allColIcons) {
      if (ic.styleType) styleCounts[ic.styleType] = (styleCounts[ic.styleType] || 0) + 1;
      if (ic.category) categoryCounts[ic.category] = (categoryCounts[ic.category] || 0) + 1;
      if (ic.gridSize) gridSizes.add(ic.gridSize);
    }

    let filtered = allColIcons.filter((ic) => {
      if (styleType && ic.styleType !== styleType) return false;
      if (category && ic.category !== category) return false;
      if (query) {
        const haystack = [ic.title, ic.slug, ic.category, ic.styleType, ...(ic.tags || [])]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sort === 'az') {
      filtered.sort((a, b) => (a.title || a.slug).localeCompare(b.title || b.slug));
    } else if (sort === 'za') {
      filtered.sort((a, b) => (b.title || b.slug).localeCompare(a.title || a.slug));
    } else if (sort === 'recent') {
      filtered.sort((a, b) => b._ts - a._ts);
    }

    const totalMatched = filtered.length;
    const items = filtered.slice(Number(offset) || 0, (Number(offset) || 0) + (Number(limit) || 120));

    return {
      collection: {
        ...colInfo,
        site: targetSite,
        totalIconsInCollection: allColIcons.length,
        stylesBreakdown: Object.entries(styleCounts).map(([id, count]) => ({ id, count })),
        categoriesBreakdown: Object.entries(categoryCounts).map(([id, count]) => ({ id, count })),
        gridSizes: Array.from(gridSizes),
      },
      total: totalMatched,
      offset: Number(offset) || 0,
      limit: Number(limit) || 120,
      items,
    };
  }

  /**
   * Get single icon details + raw SVG XML + React/JSX code + Recommendations (similar, sameStyle, sameCollection)
   */
  getIconWithRecommendations(siteId, collectionSlug, iconIdOrSlug) {
    const { allIcons } = this.loadAllEnrichedIcons();
    const target = allIcons.find(
      (ic) =>
        ic.site === siteId &&
        ic.collectionSlug === collectionSlug &&
        (String(ic.id) === String(iconIdOrSlug) || ic.slug === iconIdOrSlug)
    );

    if (!target) return null;

    const colMeta = this.loadCollectionMetadata(siteId, collectionSlug);
    const fullDiskIcon = (colMeta?.icons || []).find(
      (ic) => String(ic.id) === String(iconIdOrSlug) || ic.slug === iconIdOrSlug
    );
    const mergedTarget = fullDiskIcon ? { ...fullDiskIcon, ...target } : { ...target };

    const colDir = this.getCollectionDir(siteId, collectionSlug);
    const svgVariantsContent = {};
    const variantAssetUrls = {};

    for (const [varName, relPath] of Object.entries(mergedTarget.variants || { default: mergedTarget.relativePath })) {
      const fullPath = path.join(colDir, relPath);
      variantAssetUrls[varName] = this.buildAssetUrl(siteId, collectionSlug, relPath);
      if (runtimeFs['existsSync'](fullPath)) {
        svgVariantsContent[varName] = runtimeFs['readFileSync'](fullPath, 'utf8');
      }
    }

    const rawSvg = svgVariantsContent.default || Object.values(svgVariantsContent)[0] || '';
    if (rawSvg) {
      const parsedMeta = parseSvgMetadata(rawSvg);
      mergedTarget.width = mergedTarget.width || parsedMeta.width;
      mergedTarget.height = mergedTarget.height || parsedMeta.height;
      mergedTarget.viewBox = mergedTarget.viewBox || parsedMeta.viewBox || '0 0 24 24';
      mergedTarget.gridSize = mergedTarget.gridSize || parsedMeta.gridSize || '24x24';
      mergedTarget.fileSizeBytes = mergedTarget.fileSizeBytes || parsedMeta.fileSizeBytes;
      if (!mergedTarget.colorPalette || mergedTarget.colorPalette.length === 0) {
        mergedTarget.colorPalette = parsedMeta.colorPalette || [];
      }
    }
    mergedTarget.variantAssetUrls = variantAssetUrls;

    const recommendations = findRelatedIcons(mergedTarget, allIcons, 12);

    return {
      icon: mergedTarget,
      rawSvg,
      svgVariantsContent,
      variantAssetUrls,
      recommendations,
    };
  }
}

module.exports = {
  StateManager,
  ROOT_DIR,
  DATA_DIR,
  OUTPUT_DIR,
  STATE_FILE,
  CATALOG_INDEX_GZ_FILE,
};
