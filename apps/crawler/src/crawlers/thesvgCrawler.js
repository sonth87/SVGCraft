const { extractTagsFromText } = require('@svg-hub/shared');
const { BaseCrawler } = require('./baseCrawler');
const { naturalRandom, sleep } = require('../utils/humanSimulator');

const BASE_URL = 'https://thesvg.org';

const THESVG_COLLECTIONS = [
  // 7 Core Collections (~7,624 icons total)
  {
    slug: 'brands-popular',
    registryCollection: 'brands',
    name: 'theSVG Brand Icons (Full Set)',
    path: '/collection/brands',
    category: 'brand',
  },
  {
    slug: 'aws',
    registryCollection: 'aws',
    name: 'AWS Architecture Icons',
    path: '/collection/aws',
    category: 'cloud',
  },
  {
    slug: 'azure',
    registryCollection: 'azure',
    name: 'Azure Services Icons',
    path: '/collection/azure',
    category: 'cloud',
  },
  {
    slug: 'gcp',
    registryCollection: 'gcp',
    name: 'Google Cloud Icons',
    path: '/collection/gcp',
    category: 'cloud',
  },
  {
    slug: 'k8s',
    registryCollection: 'k8s',
    name: 'Kubernetes Icons',
    path: '/collection/k8s',
    category: 'cloud',
  },
  {
    slug: 'community',
    registryCollection: 'community',
    name: 'Community-Curated Icons',
    path: '/?collection=community',
    category: 'devtools',
  },
  {
    slug: 'auth-badges',
    registryCollection: 'auth-badges',
    name: 'Auth & 2FA Badge Icons',
    path: '/?collection=auth-badges',
    category: 'security',
  },

  // 21 Brand Families
  { slug: 'family-google', registryFamily: 'google', name: 'Google Brand Family', path: '/family/google', category: 'brand' },
  { slug: 'family-microsoft', registryFamily: 'microsoft', name: 'Microsoft Brand Family', path: '/family/microsoft', category: 'devtools' },
  { slug: 'family-adobe', registryFamily: 'adobe', name: 'Adobe Creative Family', path: '/family/adobe', category: 'design' },
  { slug: 'family-amazon', registryFamily: 'amazon', name: 'Amazon Family', path: '/family/amazon', category: 'cloud' },
  { slug: 'family-apple', registryFamily: 'apple', name: 'Apple Hardware & OS Family', path: '/family/apple', category: 'hardware' },
  { slug: 'family-jetbrains', registryFamily: 'jetbrains', name: 'JetBrains IDEs Family', path: '/family/jetbrains', category: 'devtools' },
  { slug: 'family-ibm', registryFamily: 'ibm', name: 'IBM & HashiCorp Family', path: '/family/ibm', category: 'cloud' },
  { slug: 'family-atlassian', registryFamily: 'atlassian', name: 'Atlassian Workspace Family', path: '/family/atlassian', category: 'productivity' },
  { slug: 'family-meta', registryFamily: 'meta', name: 'Meta Social Family', path: '/family/meta', category: 'social' },
  { slug: 'family-vercel', registryFamily: 'vercel', name: 'Vercel Developer Family', path: '/family/vercel', category: 'devtools' },
  { slug: 'family-anthropic', registryFamily: 'anthropic', name: 'Anthropic AI Family', path: '/family/anthropic', category: 'ai' },
  { slug: 'family-bytedance', registryFamily: 'bytedance', name: 'ByteDance Family', path: '/family/bytedance', category: 'social' },
  { slug: 'family-disney', registryFamily: 'disney', name: 'Disney Media Family', path: '/family/disney', category: 'media' },
  { slug: 'family-elastic', registryFamily: 'elastic', name: 'Elastic Search Family', path: '/family/elastic', category: 'data' },
  { slug: 'family-tencent', registryFamily: 'tencent', name: 'Tencent Family', path: '/family/tencent', category: 'social' },
  { slug: 'family-alibaba', registryFamily: 'alibaba', name: 'Alibaba Cloud & Commerce Family', path: '/family/alibaba', category: 'cloud' },
  { slug: 'family-cisco', registryFamily: 'cisco', name: 'Cisco Networking Family', path: '/family/cisco', category: 'security' },
  { slug: 'family-salesforce', registryFamily: 'salesforce', name: 'Salesforce CRM Family', path: '/family/salesforce', category: 'business' },
  { slug: 'family-oracle', registryFamily: 'oracle', name: 'Oracle Database & Cloud Family', path: '/family/oracle', category: 'data' },
  { slug: 'family-sony', registryFamily: 'sony', name: 'Sony Entertainment Family', path: '/family/sony', category: 'media' },
  { slug: 'family-xai', registryFamily: 'xai', name: 'xAI & X Corp Family', path: '/family/xai', category: 'ai' },
];

class TheSvgCrawler extends BaseCrawler {
  constructor(stateManager, options = {}) {
    super(stateManager, options);
    this.cachedRegistry = null;
  }

  get siteId() {
    return 'thesvg';
  }

  get siteInfo() {
    return {
      id: 'thesvg',
      name: 'theSVG.org (7,600+ Brand & Cloud SVGs)',
      baseUrl: BASE_URL,
      description:
        'Crawl trọn bộ 7,600+ SVG từ theSVG.org: 7 Collections (Brands, AWS, Azure, GCP, K8s, Community, Auth Badges) & 21 Brand Families, xử lý Virtual Scroll và tải đủ các biến thể (Default, Light, Dark, Mono, Wordmark).',
      categories: [
        { id: 'all', label: 'Tất cả 7 Collections & 21 Families (7,600+ SVG)' },
        ...THESVG_COLLECTIONS.map((c) => ({ id: c.slug, label: c.name })),
      ],
      defaultOptions: {
        category: 'all',
        startListPage: 1,
        maxListPages: 0,
        maxCollectionsPerPage: 0,
        maxPagesPerCollection: 0,
        skipCompletedCollections: true,
        headless: false,
        postLoadDelayMin: 1800,
        postLoadDelayMax: 3800,
        actionGapMin: 900,
        actionGapMax: 2400,
        downloadGapMin: 80,
        downloadGapMax: 250,
        enableMouseMovement: true,
        enableRandomScroll: true,
        showVisualCursor: true,
      },
    };
  }

  /**
   * Extract the complete Next.js client registry (7,624+ icons) directly from loaded Turbopack modules or script chunks in the browser
   */
  async loadFullRegistryFromBrowser() {
    if (this.cachedRegistry && this.cachedRegistry.length > 1000) {
      return this.cachedRegistry;
    }

    this.log('🔍 Đang trích xuất danh mục tổng (Manifest Registry) từ bộ nhớ trình duyệt theSVG.org...', 'info');

    const registry = await this.page.evaluate(async () => {
      // 1. Check globalThis.TURBOPACK module factories first (fastest, zero network)
      try {
        const tp = globalThis.TURBOPACK || [];
        for (const chunk of tp) {
          if (!Array.isArray(chunk)) continue;
          for (let i = 0; i < chunk.length; i++) {
            const item = chunk[i];
            if (typeof item === 'function') {
              const fnStr = Function.prototype.toString.call(item);
              if (fnStr.includes('"slug":') && fnStr.includes('"variants":') && fnStr.includes('JSON.parse(')) {
                const mod = { exports: null };
                item(null, mod, null);
                if (Array.isArray(mod.exports) && mod.exports.length > 500) {
                  return mod.exports;
                }
              }
            }
          }
        }
      } catch {
        // Fallback to script chunk scanning below
      }

      // 2. Fallback: scan loaded Next.js script chunks from browser cache
      try {
        const scriptUrls = Array.from(document.querySelectorAll('script[src*="/_next/static/chunks/"]'))
          .map((s) => s.src)
          .filter(Boolean);

        for (const url of scriptUrls) {
          try {
            const text = await fetch(url, { cache: 'force-cache' }).then((r) => r.text());
            const marker = "JSON.parse('[{\"slug\":";
            const idx = text.indexOf(marker);
            if (idx !== -1) {
              const jsonStart = idx + "JSON.parse('".length;
              const endMarker = "]')";
              const jsonEnd = text.indexOf(endMarker, jsonStart);
              if (jsonEnd !== -1) {
                const rawJsonStr = text
                  .slice(jsonStart, jsonEnd + 1)
                  .replace(/\\'/g, "'")
                  .replace(/\\\\/g, '\\');
                const parsed = JSON.parse(rawJsonStr);
                if (Array.isArray(parsed) && parsed.length > 500) {
                  return parsed;
                }
              }
            }
          } catch {
            // Try next chunk
          }
        }
      } catch {
        // Ignore
      }

      return null;
    });

    if (Array.isArray(registry) && registry.length > 0) {
      this.cachedRegistry = registry;
      this.log(
        `✅ Đã nạp thành công ${registry.length} icons (kèm đầy đủ biến thể Light/Dark/Mono/Wordmark) từ theSVG Registry!`,
        'success'
      );
      return registry;
    }

    return null;
  }

  /**
   * Extract all icon cards currently mounted in the virtualized DOM viewport
   */
  async extractIconsFromDom(defaultCategory = 'brand') {
    return this.page.evaluate(
      ({ baseUrl, fallbackCat }) => {
        const anchors = Array.from(document.querySelectorAll('a[href^="/icon/"]'));
        const seenSlugs = new Set();
        const icons = [];

        for (const a of anchors) {
          const href = a.getAttribute('href') || '';
          const match = href.match(/^\/icon\/([^/?#]+)/);
          if (!match) continue;
          const slug = match[1];
          if (seenSlugs.has(slug)) continue;

          const imgs = Array.from(a.querySelectorAll('img[src*=".svg"]'));
          if (imgs.length === 0) continue;

          seenSlugs.add(slug);

          const variantUrls = {};
          let primaryUrl = '';

          for (const img of imgs) {
            const rawSrc = img.getAttribute('src') || '';
            if (!rawSrc) continue;
            const fullUrl = rawSrc.startsWith('http') ? rawSrc : `${baseUrl}${rawSrc}`;
            if (!primaryUrl) primaryUrl = fullUrl;

            const varMatch = rawSrc.match(/\/([^/]+)\.svg$/i);
            const varName = varMatch ? varMatch[1].toLowerCase() : 'default';
            variantUrls[varName] = fullUrl;
          }

          if (!variantUrls.default && primaryUrl) {
            variantUrls.default = primaryUrl;
          }

          const spans = Array.from(a.querySelectorAll('span'))
            .map((s) => s.innerText.trim())
            .filter(Boolean);

          const title = spans[0] || slug;
          const cardCategoryLabel = spans[1] || fallbackCat;

          icons.push({
            id: slug,
            slug,
            title,
            rawCategory: cardCategoryLabel,
            sourceUrl: variantUrls.default || primaryUrl,
            variantUrls,
            detailUrl: `${baseUrl}${href}`,
          });
        }

        const h1Text = document.querySelector('h1')?.innerText?.trim() || '';
        return {
          heading: h1Text,
          icons,
        };
      },
      { baseUrl: BASE_URL, fallbackCat: defaultCategory }
    );
  }

  /**
   * Scroll through virtualized grid while continuously harvesting mounted DOM cards at each step
   */
  async scrollAndHarvestVirtualDom(defaultCategory, maxScrollSteps = 14) {
    const harvestedMap = new Map();
    let heading = '';

    const captureCurrentViewport = async () => {
      const snap = await this.extractIconsFromDom(defaultCategory);
      if (snap.heading && !heading) heading = snap.heading;
      for (const ic of snap.icons || []) {
        if (!harvestedMap.has(ic.slug)) {
          harvestedMap.set(ic.slug, ic);
        }
      }
    };

    await captureCurrentViewport();

    for (let step = 0; step < maxScrollSteps; step++) {
      await this.checkPauseOrStop();

      const scrollStepPx = naturalRandom(420, 760);
      const reachedBottom = await this.page.evaluate((dy) => {
        window.scrollBy({ top: dy, behavior: 'smooth' });
        return window.innerHeight + window.scrollY >= document.body.scrollHeight - 120;
      }, scrollStepPx);

      await sleep(naturalRandom(380, 750));
      await captureCurrentViewport();

      if (this.human.config.enableMouseMovement && step % 3 === 1) {
        await this.human.moveMouseSmoothly(
          naturalRandom(260, 1150),
          naturalRandom(200, 680),
          12
        );
      }

      if (reachedBottom) break;
    }

    // Smoothly scroll back near top like a normal user
    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await sleep(naturalRandom(400, 700));

    return {
      heading,
      icons: Array.from(harvestedMap.values()),
    };
  }

  /**
   * Convert a registry entry into our normalized icon descriptor with full variant URLs
   */
  normalizeRegistryEntry(entry, fallbackCategory = 'brand') {
    const variantUrls = {};
    const rawVariants = entry.variants || {};

    for (const [varKey, relUrl] of Object.entries(rawVariants)) {
      if (!relUrl) continue;
      variantUrls[varKey] = relUrl.startsWith('http') ? relUrl : `${BASE_URL}${relUrl}`;
    }

    const primaryUrl =
      variantUrls.default ||
      variantUrls.color ||
      variantUrls.light ||
      variantUrls.dark ||
      variantUrls.mono ||
      Object.values(variantUrls)[0] ||
      '';

    if (!variantUrls.default && primaryUrl) {
      variantUrls.default = primaryUrl;
    }

    const categoriesList = Array.isArray(entry.categories) ? entry.categories : [];
    const aliasesList = Array.isArray(entry.aliases) ? entry.aliases : [];

    return {
      id: entry.slug,
      slug: entry.slug,
      title: entry.title || entry.slug,
      rawCategory: categoriesList.join(' ') || fallbackCategory,
      categories: categoriesList,
      aliases: aliasesList,
      hex: entry.hex || '',
      license: entry.license || 'MIT / Brand',
      sourceUrl: primaryUrl,
      variantUrls,
      detailUrl: `${BASE_URL}/icon/${entry.slug}`,
    };
  }

  async runCrawl() {
    const selectedCategory = this.options.category || 'all';
    const maxCollections = Number(this.options.maxCollectionsPerPage) || Number(this.options.maxListPages) || 0;
    const skipCompleted = this.options.skipCompletedCollections !== false;

    let targetCollections =
      selectedCategory === 'all'
        ? THESVG_COLLECTIONS
        : THESVG_COLLECTIONS.filter((c) => c.slug === selectedCategory);

    if (targetCollections.length === 0) {
      targetCollections = THESVG_COLLECTIONS;
    }

    if (maxCollections > 0) {
      targetCollections = targetCollections.slice(0, maxCollections);
    }

    this.log(`🌐 Bắt đầu crawl theSVG.org (${targetCollections.length} bộ sưu tập & families)...`, 'info');

    // First visit homepage like a normal user and load the full registry
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await this.page.waitForSelector('a[href^="/icon/"]', { timeout: 25000 }).catch(() => {});
    await this.human.waitPostPageLoad('trang chủ theSVG.org');

    const fullRegistry = await this.loadFullRegistryFromBrowser();

    for (let idx = 0; idx < targetCollections.length; idx++) {
      await this.checkPauseOrStop();
      const col = targetCollections[idx];

      // Build complete icon list for this collection/family from registry if available
      let expectedRegistryIcons = [];
      if (Array.isArray(fullRegistry) && fullRegistry.length > 0) {
        if (col.registryCollection) {
          expectedRegistryIcons = fullRegistry
            .filter((item) => item.collection === col.registryCollection)
            .map((item) => this.normalizeRegistryEntry(item, col.category));
        } else if (col.registryFamily) {
          expectedRegistryIcons = fullRegistry
            .filter((item) => item.family === col.registryFamily)
            .map((item) => this.normalizeRegistryEntry(item, col.category));
        }
      }

      // Check if collection is truly completed (both marked in state AND has all expected icons downloaded)
      const currentSiteState = this.stateManager.getSiteState(this.siteId);
      const existingColMeta = this.stateManager.loadCollectionMetadata(this.siteId, col.slug);
      const alreadyDownloadedCount = existingColMeta?.icons?.length || 0;
      const isMarkedCompleted = currentSiteState.completedCollections.includes(col.slug);

      if (
        skipCompleted &&
        isMarkedCompleted &&
        (expectedRegistryIcons.length === 0 || alreadyDownloadedCount >= expectedRegistryIcons.length)
      ) {
        this.log(
          `⏭️ Bỏ qua "${col.name}" (${col.slug}) vì đã tải đủ ${alreadyDownloadedCount}/${expectedRegistryIcons.length || alreadyDownloadedCount} SVG.`,
          'info'
        );
        continue;
      }

      const targetUrl = `${BASE_URL}${col.path}`;
      this.updateProgress({
        currentListPage: idx + 1,
        currentUrl: targetUrl,
        currentCollection: col.name,
        currentAction: `Đang điều hướng tới "${col.name}" (${targetUrl})...`,
      });

      if (idx > 0 || this.page.url() !== targetUrl) {
        await this.human.waitActionGap(`Chuyển tới bộ sưu tập "${col.name}"`);
        await this.checkPauseOrStop();

        const navLink = this.page.locator(`a[href="${col.path}"]`).first();
        if (col.path !== '/' && !col.path.startsWith('/?') && (await navLink.count()) > 0) {
          this.log(`🖱️ Di chuột và click vào "${col.name}" (${col.path})...`, 'info');
          await this.human.humanClickLocator(navLink, col.name);
          await this.page
            .waitForURL((u) => u.pathname === col.path, { timeout: 15000 })
            .catch(async () => {
              await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
            });
        } else {
          this.log(`🌐 Mở trang "${col.name}": ${targetUrl}`, 'info');
          await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        }

        await this.page.waitForSelector('a[href^="/icon/"]', { timeout: 25000 }).catch(() => {});
        await this.human.waitPostPageLoad(col.name);
      }

      // If registry wasn't loaded on homepage, try loading it again now
      if (!this.cachedRegistry) {
        await this.loadFullRegistryFromBrowser();
      }

      await this.checkPauseOrStop();

      this.updateProgress({
        currentAction: `Đang cuộn trang tự nhiên & thu thập SVG trong "${col.name}"...`,
      });

      const maxScrollSteps = Number(this.options.maxPagesPerCollection)
        ? Number(this.options.maxPagesPerCollection) * 5
        : 12;

      const domData = await this.scrollAndHarvestVirtualDom(col.category, maxScrollSteps);

      // Merge Registry icons + DOM harvested icons (Registry gives 100% coverage bypassing virtual scroll limits)
      const mergedIconsMap = new Map();
      for (const regIcon of expectedRegistryIcons) {
        mergedIconsMap.set(regIcon.slug, regIcon);
      }
      for (const domIcon of domData.icons || []) {
        if (!mergedIconsMap.has(domIcon.slug)) {
          mergedIconsMap.set(domIcon.slug, domIcon);
        } else {
          // Merge any extra variant URLs seen in DOM
          const existing = mergedIconsMap.get(domIcon.slug);
          existing.variantUrls = { ...domIcon.variantUrls, ...existing.variantUrls };
        }
      }

      const icons = Array.from(mergedIconsMap.values());

      const collectionMeta = {
        id: col.slug,
        slug: col.slug,
        name: col.name,
        href: col.path,
        url: targetUrl,
        totalIcons: icons.length,
        author: 'theSVG Community / Brand Owners',
        authorUrl: BASE_URL,
        license: 'MIT / Brand Guidelines',
        description: domData.heading || `${col.name} (${icons.length} icons) from theSVG.org`,
        category: col.category,
        tags: extractTagsFromText(
          col.slug,
          col.name,
          col.category,
          ...icons.slice(0, 10).map((i) => i.title)
        ),
      };

      const savedMeta = this.stateManager.saveCollectionMetadata(this.siteId, collectionMeta);
      this.emit('collection_updated', {
        site: this.siteId,
        ...savedMeta.collection,
        downloadedIconsCount: savedMeta.icons.length,
      });

      this.log(
        `🎨 Bộ "${col.name}": tổng cộng ${icons.length} SVG (đã có sẵn ${savedMeta.icons.length} SVG, chuẩn bị tải phần còn thiếu)...`,
        'info'
      );

      this.updateProgress({
        collectionPage: 1,
        collectionTotalPages: 1,
        collectionIconsTotal: icons.length,
        collectionIconsDownloaded: savedMeta.icons.length,
      });

      for (let i = 0; i < icons.length; i++) {
        await this.checkPauseOrStop();
        const icon = icons[i];

        if (this.stateManager.isIconDownloaded(this.siteId, col.slug, icon.id, icon.slug)) {
          continue;
        }

        this.updateProgress({
          currentAction: `Đang tải SVG [${i + 1}/${icons.length}] trong "${col.name}": ${icon.title} (${icon.slug})...`,
        });

        if (this.human.config.enableMouseMovement && i % naturalRandom(8, 15) === 0) {
          const cardLoc = this.page.locator(`a[href="/icon/${icon.slug}"]`).first();
          const box = await cardLoc.boundingBox().catch(() => null);
          if (box && box.y > 0 && box.y < 850) {
            await this.human.moveMouseSmoothly(
              Math.round(box.x + box.width / 2),
              Math.round(box.y + box.height / 2),
              10
            );
          }
        }

        try {
          const primarySvgXml = await this.fetchSvgInBrowser(icon.sourceUrl);
          const extraVariants = {};

          // Also download all variants (light, dark, mono, wordmark, color)
          for (const [varName, varUrl] of Object.entries(icon.variantUrls || {})) {
            if (varName !== 'default' && varUrl && varUrl !== icon.sourceUrl) {
              try {
                extraVariants[varName] = await this.fetchSvgInBrowser(varUrl);
              } catch {
                // Ignore optional variant error
              }
            }
          }

          const extraTags = [
            ...(icon.categories || []),
            ...(icon.aliases || []),
            col.registryFamily || '',
            col.registryCollection || '',
          ].filter(Boolean);

          const iconRecord = this.stateManager.saveIconSvg(
            this.siteId,
            col.slug,
            {
              ...icon,
              tags: extractTagsFromText(...extraTags, icon.title, icon.slug),
              license: icon.license || 'MIT / Brand',
              author: 'theSVG.org',
            },
            primarySvgXml,
            extraVariants
          );

          this.stateManager.updateSiteState(this.siteId, (st) => {
            st.totalIconsDownloaded = (st.totalIconsDownloaded || 0) + 1;
          });

          this.updateProgress({
            collectionIconsDownloaded: iconRecord._collectionIconsCount || 0,
            sessionIconsDownloaded: (this.currentProgress.sessionIconsDownloaded || 0) + 1,
          });

          this.emit('icon_downloaded', {
            siteId: this.siteId,
            collectionSlug: col.slug,
            collectionName: col.name,
            icon: iconRecord,
          });

          const variantKeys = Object.keys(iconRecord.variants || {});
          this.log(
            `✅ [${i + 1}/${icons.length}] Đã tải: ${iconRecord.fileName} (Category: ${iconRecord.category} | Variants: ${variantKeys.join(', ')})`,
            'success'
          );
        } catch (err) {
          this.log(`⚠️ Lỗi tải "${icon.title}" (${icon.sourceUrl}): ${err.message}`, 'warn');
        }

        await this.human.waitDownloadGap();
      }

      this.stateManager.updateSiteState(this.siteId, (st) => {
        if (!st.completedCollections.includes(col.slug)) {
          st.completedCollections.push(col.slug);
          st.totalCollectionsCrawled = st.completedCollections.length;
        }
      });

      this.updateProgress({
        sessionCollectionsCrawled: (this.currentProgress.sessionCollectionsCrawled || 0) + 1,
      });

      this.log(`🎉 Hoàn tất bộ sưu tập "${col.name}" (${icons.length} SVG) trên theSVG.org!`, 'success');
    }
  }
}

module.exports = { TheSvgCrawler, THESVG_COLLECTIONS };
