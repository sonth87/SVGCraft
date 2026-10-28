const { extractTagsFromText } = require('@svg-hub/shared');
const { BaseCrawler } = require('./baseCrawler');
const { naturalRandom, sleep } = require('../utils/humanSimulator');

const BASE_URL = 'https://lordicon.com';
const MEDIA_CDN_BASE = 'https://media.lordicon.com/icons';

const LORDICON_PACKS = [
  {
    slug: 'lordicon-system-outline',
    family: 'system',
    style: 'outline',
    styleType: 'outlined',
    name: 'Animated System — Outline',
    path: '/icons/system/outline',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'system', 'outline', 'ui', 'interface'],
  },
  {
    slug: 'lordicon-system-solid',
    family: 'system',
    style: 'solid',
    styleType: 'filled',
    name: 'Animated System — Solid',
    path: '/icons/system/solid',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'system', 'solid', 'filled', 'ui', 'interface'],
  },
  {
    slug: 'lordicon-doodle-color',
    family: 'doodle',
    style: 'color',
    styleType: 'multicolor',
    name: 'Animated Doodle — Color',
    path: '/icons/doodle/color',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'doodle', 'color', 'multicolor', 'hand-drawn'],
  },
  {
    slug: 'lordicon-doodle-motif',
    family: 'doodle',
    style: 'motif',
    styleType: 'duotone',
    name: 'Animated Doodle — Motif',
    path: '/icons/doodle/motif',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'doodle', 'motif', 'duotone', 'hand-drawn'],
  },
  {
    slug: 'lordicon-doodle-outline',
    family: 'doodle',
    style: 'outline',
    styleType: 'outlined',
    name: 'Animated Doodle — Outline',
    path: '/icons/doodle/outline',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'doodle', 'outline', 'hand-drawn'],
  },
  {
    slug: 'lordicon-doodle-black',
    family: 'doodle',
    style: 'black',
    styleType: 'filled',
    name: 'Animated Doodle — Black',
    path: '/icons/doodle/black',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'doodle', 'black', 'filled', 'hand-drawn'],
  },
  {
    slug: 'lordicon-wired-outline',
    family: 'wired',
    style: 'outline',
    styleType: 'duotone',
    name: 'Animated Wired — Outline',
    path: '/icons/wired/outline',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'wired', 'outline', 'duotone'],
  },
  {
    slug: 'lordicon-wired-flat',
    family: 'wired',
    style: 'flat',
    styleType: 'multicolor',
    name: 'Animated Wired — Flat',
    path: '/icons/wired/flat',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'wired', 'flat', 'multicolor'],
  },
  {
    slug: 'lordicon-wired-lineal',
    family: 'wired',
    style: 'lineal',
    styleType: 'multicolor',
    name: 'Animated Wired — Lineal',
    path: '/icons/wired/lineal',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'wired', 'lineal', 'multicolor'],
  },
  {
    slug: 'lordicon-wired-gradient',
    family: 'wired',
    style: 'gradient',
    styleType: 'multicolor',
    name: 'Animated Wired — Gradient',
    path: '/icons/wired/gradient',
    author: 'Open Source',
    license: 'MIT / CC0',
    tags: ['animation', 'animated', 'motion', 'lottie', 'wired', 'gradient', 'multicolor'],
  },
];

function formatTitle(text = '') {
  return String(text || '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Strip unreferenced hidden placeholder paths (<path style="display:none"/> without id)
 * to keep static SVG lightweight (~25% smaller) while preserving all visible layers, masks, and defs.
 */
function cleanLordiconSvg(svgContent = '') {
  if (!svgContent || !svgContent.includes('<svg')) return svgContent;
  return svgContent
    .replace(/<path\b(?![^>]*\bid=)[^>]*\bstyle=["']display:\s*none;?["'][^>]*\/>/gi, '')
    .replace(/<g\b(?![^>]*\bid=)[^>]*\bstyle=["']display:\s*none;?["'][^>]*>\s*<\/g>/gi, '');
}

/**
 * Parse Lordicon `/api/library/icons?family=...&style=...` payload
 * Maps each icon to its thematic category (`mainCategory`) and subcategory (`subCategory`)
 * using the `headers` index boundaries and deduplicates icons that also appear in `popular`.
 */
function parseLordiconApiPayload(payload = {}) {
  const headers = Array.isArray(payload.headers) ? [...payload.headers] : [];
  const rawIcons = Array.isArray(payload.icons) ? payload.icons : [];
  headers.sort((a, b) => (a.index || 0) - (b.index || 0));

  const bySlug = new Map();
  let hCursor = 0;
  let currentMainTitle = '';
  if (headers[0]?.title) {
    currentMainTitle = String(headers[0].title).trim().toLowerCase();
  }

  for (let pos = 0; pos < rawIcons.length; pos++) {
    while (hCursor + 1 < headers.length && headers[hCursor + 1].index <= pos) {
      hCursor++;
      if (headers[hCursor]?.title) {
        currentMainTitle = String(headers[hCursor].title).trim().toLowerCase();
      }
    }
    const activeHeader = headers[hCursor] || {};
    const mainCategory = String(activeHeader.title || currentMainTitle || '').trim().toLowerCase();
    const subCategory = String(activeHeader.subtitle || '').trim().toLowerCase();

    const raw = rawIcons[pos];
    if (!raw || raw.index === undefined || !raw.name) continue;

    const iconSlug = `${raw.index}-${raw.name}`;
    const existing = bySlug.get(iconSlug);

    if (!existing) {
      bySlug.set(iconSlug, {
        id: String(raw.index),
        index: raw.index,
        name: raw.name,
        slug: iconSlug,
        title: raw.title ? formatTitle(raw.title) : formatTitle(raw.name),
        family: raw.family,
        style: raw.style,
        premium: Boolean(raw.premium),
        mainCategory: mainCategory === 'popular' ? '' : mainCategory,
        subCategory: mainCategory === 'popular' ? '' : subCategory,
      });
    } else if (!existing.mainCategory && mainCategory && mainCategory !== 'popular') {
      existing.mainCategory = mainCategory;
      existing.subCategory = subCategory;
    }
  }

  return Array.from(bySlug.values());
}

class LordiconCrawler extends BaseCrawler {
  get siteId() {
    return 'lordicon';
  }

  get siteInfo() {
    return {
      id: 'lordicon',
      name: 'Lordicon.com (Interactive Animated Icons — All 10 Styles)',
      baseUrl: BASE_URL,
      description:
        'Crawl toàn bộ 10 bộ sưu tập Animated Icons từ Lordicon.com (https://lordicon.com/icons/all — System Outline/Solid, Doodle Color/Motif/Outline/Black, Wired Outline/Flat/Lineal/Gradient, hơn 18,000+ icon cả Free & Pro). Lưu trữ 1 file SVG nhẹ chuẩn A1 kèm hỗ trợ đầy đủ Animation (Hover/Loop/Morph), đổi màu đa lớp và chỉnh độ dày nét (Stroke Light/Regular/Bold).',
      categories: [
        { id: 'all', label: 'Tất cả 10 bộ Lordicon (System, Doodle, Wired — ~18,068 Animated Icons)' },
        { id: 'family-system', label: 'Nhóm System (Outline + Solid — ~1,032 Icons)' },
        { id: 'family-doodle', label: 'Nhóm Doodle (Color + Motif + Outline + Black — ~2,724 Icons)' },
        { id: 'family-wired', label: 'Nhóm Wired (Outline + Flat + Lineal + Gradient — ~14,312 Icons)' },
        ...LORDICON_PACKS.map((p) => ({
          id: p.slug,
          label: `${p.name} (${p.family}/${p.style} — Style: ${p.styleType})`,
        })),
      ],
      defaultOptions: {
        category: 'all',
        startListPage: 1,
        maxListPages: 0,
        maxCollectionsPerPage: 0,
        maxPagesPerCollection: 0,
        skipCompletedCollections: true,
        headless: false,
        postLoadDelayMin: 1500,
        postLoadDelayMax: 3200,
        actionGapMin: 800,
        actionGapMax: 2000,
        downloadGapMin: 20,
        downloadGapMax: 80,
        enableMouseMovement: true,
        enableRandomScroll: true,
        showVisualCursor: true,
      },
    };
  }

  async simulateNaturalPackBrowsing(maxScrollSteps = 5) {
    for (let step = 0; step < maxScrollSteps; step++) {
      await this.checkPauseOrStop();

      if (this.human && this.human.config.enableRandomScroll) {
        const scrollStepPx = naturalRandom(360, 680);
        const reachedBottom = await this.page
          .evaluate((dy) => {
            window.scrollBy({ top: dy, behavior: 'smooth' });
            return window.innerHeight + window.scrollY >= document.body.scrollHeight - 120;
          }, scrollStepPx)
          .catch(() => false);

        await sleep(naturalRandom(300, 600));
        if (reachedBottom) break;
      }

      if (this.human && this.human.config.enableMouseMovement && step % 2 === 0) {
        await this.human.moveMouseSmoothly(
          naturalRandom(260, 1150),
          naturalRandom(200, 680),
          10
        );
      }
    }

    await this.page
      .evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {});
    await sleep(naturalRandom(250, 500));
  }

  async fetchLordiconPackCatalog(pack) {
    const apiUrl = `${BASE_URL}/api/library/icons?family=${encodeURIComponent(pack.family)}&style=${encodeURIComponent(pack.style)}`;

    // 1. Try in-browser fetch first since we are on lordicon.com
    if (this.page) {
      try {
        const data = await this.page.evaluate(async (url) => {
          const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        }, apiUrl);
        if (data && Array.isArray(data.icons)) {
          return parseLordiconApiPayload(data);
        }
      } catch {
        // Fallback below
      }
    }

    // 2. Fallback to Playwright context.request or native fetch
    if (this.context && this.context.request) {
      try {
        const res = await this.context.request.get(apiUrl, {
          headers: { Accept: 'application/json' },
          timeout: 30000,
        });
        if (res.ok()) {
          const data = await res.json();
          if (data && Array.isArray(data.icons)) {
            return parseLordiconApiPayload(data);
          }
        }
      } catch {
        // Fallback below
      }
    }

    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} khi tải danh sách icon từ ${apiUrl}`);
    }
    const data = await res.json();
    return parseLordiconApiPayload(data);
  }

  async runCrawl() {
    const selectedCategory = this.options.category || 'all';
    const maxCollections =
      Number(this.options.maxCollectionsPerPage) || Number(this.options.maxListPages) || 0;
    const skipCompleted = this.options.skipCompletedCollections !== false;

    let targetPacks = LORDICON_PACKS;
    if (selectedCategory === 'family-system') {
      targetPacks = LORDICON_PACKS.filter((p) => p.family === 'system');
    } else if (selectedCategory === 'family-doodle') {
      targetPacks = LORDICON_PACKS.filter((p) => p.family === 'doodle');
    } else if (selectedCategory === 'family-wired') {
      targetPacks = LORDICON_PACKS.filter((p) => p.family === 'wired');
    } else if (selectedCategory !== 'all') {
      const matched = LORDICON_PACKS.filter((p) => p.slug === selectedCategory);
      if (matched.length > 0) targetPacks = matched;
    }

    if (maxCollections > 0) {
      targetPacks = targetPacks.slice(0, maxCollections);
    }

    this.log(
      `🎬 Bắt đầu crawl Lordicon.com (${targetPacks.length} bộ sưu tập Animated Icons — chuẩn Option A1)...`,
      'info'
    );

    for (let idx = 0; idx < targetPacks.length; idx++) {
      await this.checkPauseOrStop();
      const pack = targetPacks[idx];

      const currentSiteState = this.stateManager.getSiteState(this.siteId);
      const existingColMeta = this.stateManager.loadCollectionMetadata(this.siteId, pack.slug);
      const alreadyDownloadedCount = existingColMeta?.icons?.length || 0;
      const expectedTotal = existingColMeta?.collection?.totalIcons || 0;
      const isMarkedCompleted = currentSiteState.completedCollections.includes(pack.slug);

      if (
        skipCompleted &&
        isMarkedCompleted &&
        expectedTotal > 0 &&
        alreadyDownloadedCount >= expectedTotal
      ) {
        this.log(
          `⏭️ Bỏ qua "${pack.name}" (${pack.slug}) vì đã tải hoàn tất (${alreadyDownloadedCount}/${expectedTotal} SVG).`,
          'info'
        );
        continue;
      }

      const targetUrl = `${BASE_URL}${pack.path}`;
      this.updateProgress({
        currentListPage: idx + 1,
        currentUrl: targetUrl,
        currentCollection: pack.name,
        currentAction: `Đang mở bộ sưu tập "${pack.name}" (${targetUrl})...`,
      });

      if (idx > 0) {
        await this.human.waitActionGap(`Chuyển tới bộ sưu tập "${pack.name}"`);
        await this.checkPauseOrStop();
      }

      this.log(`🌐 Mở trang "${pack.name}": ${targetUrl}`, 'info');
      await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await this.human.waitPostPageLoad(pack.name);

      await this.checkPauseOrStop();

      this.updateProgress({
        currentAction: `Đang cuộn trang & đồng bộ danh mục icon trong "${pack.name}"...`,
      });

      const maxScrollSteps = Number(this.options.maxPagesPerCollection)
        ? Math.min(10, Number(this.options.maxPagesPerCollection) * 2)
        : 5;
      await this.simulateNaturalPackBrowsing(maxScrollSteps);

      const iconEntries = await this.fetchLordiconPackCatalog(pack);

      const collectionMeta = {
        id: pack.slug,
        slug: pack.slug,
        name: pack.name,
        href: pack.path,
        url: targetUrl,
        totalIcons: iconEntries.length,
        author: pack.author,
        authorUrl: BASE_URL,
        license: pack.license,
        description: `${pack.name} (${iconEntries.length} interactive animated icons — family: ${pack.family}, style: ${pack.style}) from Lordicon.com`,
        category: 'animation',
        styleType: pack.styleType,
        iconType: 'animated',
        family: pack.family,
        lordiconStyle: pack.style,
        tags: Array.from(
          new Set([
            ...pack.tags,
            ...extractTagsFromText(
              pack.slug,
              pack.name,
              pack.family,
              pack.style,
              'animation animated motion lordicon lottie'
            ),
          ])
        ),
      };

      const savedMeta = this.stateManager.saveCollectionMetadata(this.siteId, collectionMeta);
      this.emit('collection_updated', {
        site: this.siteId,
        ...savedMeta.collection,
        downloadedIconsCount: savedMeta.icons.length,
      });

      this.log(
        `🎨 Bộ "${pack.name}": tổng cộng ${iconEntries.length} Animated Icons (đã lưu ${savedMeta.icons.length} SVG, chuẩn bị tải phần còn thiếu)...`,
        'info'
      );

      this.updateProgress({
        collectionPage: 1,
        collectionTotalPages: 1,
        collectionIconsTotal: iconEntries.length,
        collectionIconsDownloaded: savedMeta.icons.length,
      });

      // Filter pending icons to download
      const pendingItems = [];
      for (let i = 0; i < iconEntries.length; i++) {
        const item = iconEntries[i];
        if (!this.stateManager.isIconDownloaded(this.siteId, pack.slug, item.id, item.slug)) {
          pendingItems.push({ item, index: i });
        }
      }

      // Download in concurrent batches of 8 for high throughput while maintaining smooth progress & human simulation
      const BATCH_SIZE = 8;
      for (let b = 0; b < pendingItems.length; b += BATCH_SIZE) {
        await this.checkPauseOrStop();
        const batch = pendingItems.slice(b, b + BATCH_SIZE);

        if (
          this.human &&
          this.human.config.enableMouseMovement &&
          Math.floor(b / BATCH_SIZE) % 3 === 0
        ) {
          await this.human.moveMouseSmoothly(
            naturalRandom(280, 1120),
            naturalRandom(220, 680),
            8
          );
        }

        const firstInBatch = batch[0];
        this.updateProgress({
          currentAction: `Đang tải cụm SVG [${firstInBatch.index + 1}–${batch[batch.length - 1].index + 1}/${iconEntries.length}] trong "${pack.name}": ${firstInBatch.item.title}...`,
        });

        await Promise.all(
          batch.map(async ({ item, index: i }) => {
            const svgUrl = `${MEDIA_CDN_BASE}/${pack.family}/${pack.style}/${item.slug}.svg`;
            const lottieUrl = `${MEDIA_CDN_BASE}/${pack.family}/${pack.style}/${item.slug}.li`;
            const detailUrl = `${BASE_URL}/icons/${pack.family}/${pack.style}#i:${pack.family}-${pack.style}-${item.slug}`;

            try {
              const rawSvg = await this.fetchSvgInBrowser(svgUrl);
              const svgContent = cleanLordiconSvg(rawSvg);

              const rawCategory = item.subCategory || item.mainCategory || 'animation';
              const iconTags = Array.from(
                new Set([
                  ...pack.tags,
                  item.mainCategory,
                  item.subCategory,
                  item.premium ? 'pro' : 'free',
                  ...extractTagsFromText(
                    item.title,
                    item.name,
                    item.mainCategory,
                    item.subCategory,
                    pack.family,
                    pack.style,
                    'animation animated lordicon'
                  ),
                ].filter(Boolean))
              );

              const iconRecord = this.stateManager.saveIconSvg(
                this.siteId,
                pack.slug,
                {
                  id: item.id,
                  slug: item.slug,
                  title: item.title,
                  sourceUrl: svgUrl,
                  lottieUrl,
                  detailUrl,
                  rawCategory,
                  mainCategory: item.mainCategory,
                  subCategory: item.subCategory,
                  styleType: pack.styleType,
                  iconType: 'animated',
                  family: pack.family,
                  lordiconStyle: pack.style,
                  premium: item.premium,
                  license: pack.license,
                  author: pack.author,
                  tags: iconTags,
                },
                svgContent
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
                collectionSlug: pack.slug,
                collectionName: pack.name,
                icon: iconRecord,
              });

              if ((i + 1) % 25 === 0 || i === iconEntries.length - 1 || b === 0) {
                this.log(
                  `✅ [${i + 1}/${iconEntries.length}] Đã tải: ${iconRecord.fileName} (${pack.family}/${pack.style} | Category: ${iconRecord.category} | Style: ${iconRecord.styleType})`,
                  'success'
                );
              }
            } catch (err) {
              this.log(`⚠️ Lỗi tải "${item.title}" (${svgUrl}): ${err.message}`, 'warn');
            }
          })
        );

        await this.human.waitDownloadGap();
      }

      const finalMeta = this.stateManager.loadCollectionMetadata(this.siteId, pack.slug);
      const finalDownloadedCount = finalMeta?.icons?.length || 0;

      if (finalDownloadedCount >= iconEntries.length && iconEntries.length > 0) {
        this.stateManager.updateSiteState(this.siteId, (st) => {
          if (!st.completedCollections.includes(pack.slug)) {
            st.completedCollections.push(pack.slug);
            st.totalCollectionsCrawled = st.completedCollections.length;
          }
        });
      }

      this.updateProgress({
        sessionCollectionsCrawled: (this.currentProgress.sessionCollectionsCrawled || 0) + 1,
      });

      this.log(
        `🎉 Hoàn tất bộ sưu tập "${pack.name}" (${finalDownloadedCount}/${iconEntries.length} Animated Icons) trên Lordicon.com!`,
        'success'
      );
    }
  }
}

module.exports = {
  LordiconCrawler,
  LORDICON_PACKS,
  BASE_URL,
  MEDIA_CDN_BASE,
  cleanLordiconSvg,
  parseLordiconApiPayload,
};
