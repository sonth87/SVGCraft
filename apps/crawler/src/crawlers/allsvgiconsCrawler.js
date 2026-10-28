const { extractTagsFromText } = require('@svg-hub/shared');
const { BaseCrawler } = require('./baseCrawler');
const { naturalRandom, sleep } = require('../utils/humanSimulator');

const BASE_URL = 'https://allsvgicons.com';
const ICON_CDN_BASE = 'https://i.allsvgicons.com';

const ALLSVGICONS_PACKS = [
  {
    slug: 'meteocons',
    name: 'Meteocons Animated Weather Icons',
    path: '/pack/meteocons/',
    category: 'animation',
    author: 'Bas Milius',
    license: 'MIT',
    tags: ['animation', 'animated', 'motion', 'meteocons', 'weather', 'climate', 'forecast'],
  },
  {
    slug: 'line-md',
    name: 'Material Line Animated Icons (Line-MD)',
    path: '/pack/line-md/',
    category: 'animation',
    author: 'Vjacheslav Trushkin',
    license: 'MIT',
    tags: ['animation', 'animated', 'motion', 'line-md', 'material', 'line', 'stroke', 'ui'],
  },
  {
    slug: 'svg-spinners',
    name: 'SVG Spinners & Animated Loaders',
    path: '/pack/svg-spinners/',
    category: 'animation',
    author: 'Utkarsh Verma',
    license: 'MIT',
    tags: ['animation', 'animated', 'motion', 'svg-spinners', 'spinner', 'loader', 'loading', 'progress'],
  },
];

function decodeHtmlEntities(str = '') {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function formatIconTitle(iconName = '') {
  return iconName
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function normalizeAnimatedSvgDimensions(svgContent = '') {
  const viewBoxMatch = svgContent.match(/\bviewBox=["']([^"']+)["']/i);
  if (!viewBoxMatch) return svgContent;
  const parts = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || Number.isNaN(parts[2]) || Number.isNaN(parts[3])) {
    return svgContent;
  }
  const w = Math.round(parts[2]);
  const h = Math.round(parts[3]);
  return svgContent.replace(/<svg\b([^>]*)>/i, (full, attrs) => {
    const updatedAttrs = attrs
      .replace(/\bwidth=["']1em["']/i, `width="${w}"`)
      .replace(/\bheight=["']1em["']/i, `height="${h}"`);
    return `<svg${updatedAttrs}>`;
  });
}

/**
 * Extract icon list and sub-categories from AllSvgIcons pack HTML (<astro-island> props)
 */
function parseAllSvgIconsPackHtml(html = '') {
  const islandMatch = html.match(/component-url="[^"]*IconPackViewer[^"]*"[^>]*\bprops="([^"]+)"/i);
  if (!islandMatch) {
    throw new Error('Không tìm thấy dữ liệu IconPackViewer trong HTML trang pack.');
  }
  const decodedProps = decodeHtmlEntities(islandMatch[1]);
  const parsed = JSON.parse(decodedProps);
  const rawByCategory =
    parsed.iconNamesByCategory && parsed.iconNamesByCategory[1]
      ? parsed.iconNamesByCategory[1]
      : {};

  const icons = [];
  const seen = new Set();

  for (const [subCategory, tuple] of Object.entries(rawByCategory)) {
    const csv = Array.isArray(tuple) ? tuple[1] : String(tuple || '');
    const names = csv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const name of names) {
      if (seen.has(name)) continue;
      seen.add(name);
      icons.push({
        id: name,
        slug: name,
        title: formatIconTitle(name),
        subCategory: subCategory && subCategory !== 'uncategorized' ? subCategory : '',
      });
    }
  }

  return icons;
}

class AllSvgIconsCrawler extends BaseCrawler {
  get siteId() {
    return 'allsvgicons';
  }

  get siteInfo() {
    return {
      id: 'allsvgicons',
      name: 'AllSvgIcons.com (Animated SVG Packs)',
      baseUrl: BASE_URL,
      description:
        'Crawl các bộ icon có hiệu ứng chuyển động (Animated SVG / CSS & SMIL Animation) từ AllSvgIcons.com: Meteocons (447), Material Line Animated / Line-MD (1,218) và SVG Spinners (46). Tự động gắn tag animation & phân loại danh mục Animated & Motion Icons.',
      categories: [
        { id: 'all', label: 'Tất cả 3 bộ Animated SVG (Meteocons, Line-MD, SVG Spinners — 1,711 SVG)' },
        ...ALLSVGICONS_PACKS.map((p) => ({ id: p.slug, label: p.name })),
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
        downloadGapMin: 60,
        downloadGapMax: 200,
        enableMouseMovement: true,
        enableRandomScroll: true,
        showVisualCursor: true,
      },
    };
  }

  async simulateNaturalPackBrowsing(maxScrollSteps = 6) {
    for (let step = 0; step < maxScrollSteps; step++) {
      await this.checkPauseOrStop();

      if (this.human && this.human.config.enableRandomScroll) {
        const scrollStepPx = naturalRandom(360, 680);
        const reachedBottom = await this.page.evaluate((dy) => {
          window.scrollBy({ top: dy, behavior: 'smooth' });
          return window.innerHeight + window.scrollY >= document.body.scrollHeight - 120;
        }, scrollStepPx);

        await sleep(naturalRandom(350, 700));
        if (reachedBottom) break;
      }

      if (this.human && this.human.config.enableMouseMovement && step % 2 === 0) {
        await this.human.moveMouseSmoothly(
          naturalRandom(260, 1150),
          naturalRandom(200, 680),
          12
        );
      }
    }

    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await sleep(naturalRandom(350, 650));
  }

  async runCrawl() {
    const selectedCategory = this.options.category || 'all';
    const maxCollections =
      Number(this.options.maxCollectionsPerPage) || Number(this.options.maxListPages) || 0;
    const skipCompleted = this.options.skipCompletedCollections !== false;

    let targetPacks =
      selectedCategory === 'all'
        ? ALLSVGICONS_PACKS
        : ALLSVGICONS_PACKS.filter((p) => p.slug === selectedCategory);

    if (targetPacks.length === 0) {
      targetPacks = ALLSVGICONS_PACKS;
    }

    if (maxCollections > 0) {
      targetPacks = targetPacks.slice(0, maxCollections);
    }

    this.log(
      `🎬 Bắt đầu crawl AllSvgIcons.com (${targetPacks.length} bộ Animated SVG)...`,
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
        currentAction: `Đang mở bộ icon động "${pack.name}" (${targetUrl})...`,
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
        currentAction: `Đang cuộn trang & trích xuất danh sách SVG trong "${pack.name}"...`,
      });

      const maxScrollSteps = Number(this.options.maxPagesPerCollection)
        ? Number(this.options.maxPagesPerCollection) * 3
        : 6;
      await this.simulateNaturalPackBrowsing(maxScrollSteps);

      const html = await this.page.content();
      const iconEntries = parseAllSvgIconsPackHtml(html);

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
        description: `${pack.name} (${iconEntries.length} animated SVG icons) from AllSvgIcons.com`,
        category: 'animation',
        iconType: 'animated',
        tags: Array.from(
          new Set([
            ...pack.tags,
            ...extractTagsFromText(
              pack.slug,
              pack.name,
              'animation animated motion',
              ...iconEntries.slice(0, 10).map((i) => i.title)
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
        `🎨 Bộ "${pack.name}": tổng cộng ${iconEntries.length} Animated SVG (đã có sẵn ${savedMeta.icons.length} SVG, chuẩn bị tải phần còn thiếu)...`,
        'info'
      );

      this.updateProgress({
        collectionPage: 1,
        collectionTotalPages: 1,
        collectionIconsTotal: iconEntries.length,
        collectionIconsDownloaded: savedMeta.icons.length,
      });

      for (let i = 0; i < iconEntries.length; i++) {
        await this.checkPauseOrStop();
        const item = iconEntries[i];

        if (this.stateManager.isIconDownloaded(this.siteId, pack.slug, null, item.slug)) {
          continue;
        }

        const svgUrl = `${ICON_CDN_BASE}/${pack.slug}/${item.slug}.svg`;
        const detailUrl = `${BASE_URL}/icon/${pack.slug}/${item.slug}/`;

        this.updateProgress({
          currentAction: `Đang tải Animated SVG [${i + 1}/${iconEntries.length}] trong "${pack.name}": ${item.title} (${item.slug})...`,
        });

        if (this.human && this.human.config.enableMouseMovement && i % naturalRandom(10, 18) === 0) {
          await this.human.moveMouseSmoothly(
            naturalRandom(280, 1120),
            naturalRandom(220, 680),
            10
          );
        }

        try {
          const rawSvg = await this.fetchSvgInBrowser(svgUrl);
          const svgContent = normalizeAnimatedSvgDimensions(rawSvg);

          const iconTags = Array.from(
            new Set([
              ...pack.tags,
              ...extractTagsFromText(
                item.title,
                item.slug,
                item.subCategory,
                pack.name,
                'animation animated motion'
              ),
            ])
          );

          const iconRecord = this.stateManager.saveIconSvg(
            this.siteId,
            pack.slug,
            {
              id: null,
              slug: item.slug,
              title: item.title,
              sourceUrl: svgUrl,
              detailUrl,
              rawCategory: item.subCategory || 'animation',
              category: 'animation',
              iconType: 'animated',
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

          this.log(
            `✅ [${i + 1}/${iconEntries.length}] Đã tải: ${iconRecord.fileName} (Category: ${iconRecord.category} | Type: ${iconRecord.iconType})`,
            'success'
          );
        } catch (err) {
          this.log(`⚠️ Lỗi tải "${item.title}" (${svgUrl}): ${err.message}`, 'warn');
        }

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
        `🎉 Hoàn tất bộ sưu tập "${pack.name}" (${finalDownloadedCount}/${iconEntries.length} Animated SVG) trên AllSvgIcons.com!`,
        'success'
      );
    }
  }
}

module.exports = {
  AllSvgIconsCrawler,
  ALLSVGICONS_PACKS,
  ICON_CDN_BASE,
  BASE_URL,
  parseAllSvgIconsPackHtml,
  normalizeAnimatedSvgDimensions,
};
