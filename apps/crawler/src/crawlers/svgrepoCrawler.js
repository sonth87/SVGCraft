const { extractTagsFromText } = require('@svg-hub/shared');
const { BaseCrawler } = require('./baseCrawler');
const { naturalRandom } = require('../utils/humanSimulator');

const BASE_URL = 'https://www.svgrepo.com';

class SvgRepoCrawler extends BaseCrawler {
  constructor(stateManager, options = {}) {
    super(stateManager, options);
    this.interceptedCollectionsMeta = new Map();
  }

  get siteId() {
    return 'svgrepo';
  }

  get siteInfo() {
    return {
      id: 'svgrepo',
      name: 'SVG Repo (svgrepo.com)',
      baseUrl: BASE_URL,
      description:
        'Crawl theo từng trang danh sách Collection -> vào từng Collection -> lấy metadata & tải toàn bộ SVG trên DOM theo từng trang -> quay lại danh sách Collection.',
      categories: [
        { id: 'all', label: 'Tất cả (All Styles)' },
        { id: 'monocolor', label: 'Monocolor (Đơn sắc)' },
        { id: 'multicolor', label: 'Multicolor (Đa sắc)' },
        { id: 'duotone', label: 'Duotone (Hai tông màu)' },
        { id: 'outlined', label: 'Outlined (Nét viền)' },
        { id: 'filled', label: 'Filled (Đặc / Glyph)' },
        { id: 'icon', label: 'Icon' },
        { id: 'glyph', label: 'Glyph' },
        { id: 'rounded', label: 'Rounded' },
        { id: 'sharp', label: 'Sharp' },
        { id: 'flat', label: 'Flat' },
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
        postLoadDelayMax: 4000,
        actionGapMin: 900,
        actionGapMax: 2500,
        downloadGapMin: 120,
        downloadGapMax: 400,
        enableMouseMovement: true,
        enableRandomScroll: true,
        showVisualCursor: true,
      },
    };
  }

  buildCollectionsListUrl(category = 'all', pageNum = 1) {
    const cat = category || 'all';
    if (pageNum <= 1) {
      return cat === 'all'
        ? `${BASE_URL}/collections/`
        : `${BASE_URL}/collections/${cat}/`;
    }
    return `${BASE_URL}/collections/${cat}/${pageNum}`;
  }

  setupNetworkMetadataInterceptor() {
    this.page.on('response', async (response) => {
      try {
        const url = response.url();
        if (url.includes('/_next/data/') && url.includes('collections') && response.status() === 200) {
          const json = await response.json();
          const cols = json?.pageProps?.results?.collections || [];
          if (this.interceptedCollectionsMeta.size > 100) {
            this.interceptedCollectionsMeta.clear();
          }
          for (const c of cols) {
            if (c && c.slug) {
              this.interceptedCollectionsMeta.set(c.slug, c);
            }
          }
        }
      } catch {
        // Ignore non-JSON responses
      }
    });
  }

  async extractCollectionsOnListPage(category) {
    const rawData = await this.page.evaluate(() => {
      const nextDataMap = {};
      const nextScript = document.querySelector('#__NEXT_DATA__');
      if (nextScript) {
        try {
          const parsed = JSON.parse(nextScript.textContent);
          const cols = parsed?.props?.pageProps?.results?.collections || [];
          for (const c of cols) {
            if (c && c.slug) {
              nextDataMap[c.slug] = c;
            }
          }
        } catch {
          // Ignore
        }
      }

      const cardAnchors = Array.from(document.querySelectorAll('a[href^="/collection/"]'));
      const seenSlugs = new Set();
      const domCollections = [];

      for (const a of cardAnchors) {
        const href = a.getAttribute('href') || '';
        const match = href.match(/^\/collection\/([^/]+)\/?$/);
        if (!match) continue;
        const slug = match[1];
        if (seenSlugs.has(slug)) continue;
        seenSlugs.add(slug);

        const titleEl = a.querySelector('[class*="title"]');
        const countSpan = titleEl ? titleEl.querySelector('span') : null;
        const countText = countSpan ? countSpan.innerText.trim() : '';

        let rawTitle = titleEl ? titleEl.innerText.trim() : a.getAttribute('title') || slug;
        if (countText && rawTitle.endsWith(countText)) {
          rawTitle = rawTitle.slice(0, -countText.length).trim();
        }
        rawTitle = rawTitle.replace(/\s*Collection$/i, '').trim();

        const previewAlts = Array.from(a.querySelectorAll('img[alt]'))
          .map((img) => img.getAttribute('alt'))
          .filter(Boolean);

        domCollections.push({
          slug,
          href,
          title: rawTitle || slug,
          countFromDom: Number(countText.replace(/[^0-9]/g, '')) || 0,
          previewAlts,
        });
      }

      const nextBtn = document.querySelector('a[title="Next Page"][href*="/collections/"]');
      return {
        domCollections,
        nextDataMap,
        nextListPageHref: nextBtn ? nextBtn.getAttribute('href') : null,
      };
    });

    const collections = rawData.domCollections.map((item) => {
      const fromNext =
        rawData.nextDataMap[item.slug] ||
        this.interceptedCollectionsMeta.get(item.slug) ||
        {};

      const totalIcons = Number(fromNext.count || item.countFromDom || 0);
      const author = fromNext.license_owner || 'SVG Repo';
      const authorUrl = fromNext.license_link || '';
      const license = fromNext.license || 'Open License';
      const description = fromNext.description || '';

      const tags = extractTagsFromText(
        item.slug,
        item.title,
        category !== 'all' ? category : '',
        ...(item.previewAlts || []).slice(0, 6)
      );

      return {
        id: String(fromNext.id || ''),
        slug: item.slug,
        name: item.title,
        href: item.href,
        url: `${BASE_URL}${item.href}`,
        totalIcons,
        author,
        authorUrl,
        license,
        description,
        category,
        tags,
      };
    });

    return {
      collections,
      nextListPageHref: rawData.nextListPageHref,
    };
  }

  async extractCollectionPageDetails(fallbackCollectionInfo, currentPageNum) {
    return this.page.evaluate(
      ({ baseUrl, fallback, pageNum }) => {
        const h1Text = document.querySelector('h1')?.innerText?.trim() || '';
        const cleanName = h1Text.replace(/\s*Collection$/i, '').trim() || fallback.name || fallback.slug;
        const metaDesc =
          document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        let nextResults = null;
        const nextScript = document.querySelector('#__NEXT_DATA__');
        if (nextScript) {
          try {
            const parsed = JSON.parse(nextScript.textContent);
            const pp = parsed?.props?.pageProps;
            if (pp?.term === fallback.slug && pp?.results) {
              nextResults = pp.results;
            }
          } catch {
            // Ignore
          }
        }

        let totalPages = 1;
        const bodyText = document.body?.innerText || '';
        const pageMatch = bodyText.match(/Page\s+(\d+)\s*\/\s*(\d+)/i);
        if (pageMatch) {
          totalPages = Number(pageMatch[2]) || 1;
        } else if (nextResults?.count && nextResults?.limit) {
          totalPages = Math.ceil(Number(nextResults.count) / Number(nextResults.limit));
        } else if (fallback.totalIcons) {
          totalPages = Math.max(1, Math.ceil(Number(fallback.totalIcons) / 50));
        }

        let totalIcons = Number(nextResults?.count || fallback.totalIcons || 0);
        if (!totalIcons && metaDesc) {
          const countMatch = metaDesc.match(/Browse\s+([\d,]+)\s+vector/i);
          if (countMatch) {
            totalIcons = Number(countMatch[1].replace(/,/g, '')) || 0;
          }
        }

        const iconNodes = Array.from(
          document.querySelectorAll('div[class*="NodeImage"] a[href^="/svg/"], a[itemtype*="ImageObject"][href^="/svg/"]')
        );

        const seenIds = new Set();
        const icons = [];

        for (const anchor of iconNodes) {
          const detailHref = anchor.getAttribute('href') || '';
          const img = anchor.querySelector('img[src*=".svg"]');
          if (!img) continue;

          const rawSrc = img.getAttribute('src') || '';
          const sourceUrl = rawSrc.startsWith('http') ? rawSrc : `${baseUrl}${rawSrc}`;

          const partsMatch =
            detailHref.match(/\/svg\/(\d+)\/([^/?#]+)/) ||
            sourceUrl.match(/\/show\/(\d+)\/([^/.?#]+)\.svg/);

          const id = partsMatch ? partsMatch[1] : '';
          const slug = partsMatch ? partsMatch[2] : '';
          const uniqueKey = id || sourceUrl;
          if (seenIds.has(uniqueKey)) continue;
          seenIds.add(uniqueKey);

          const metaName = anchor.querySelector('meta[itemprop="name"]')?.getAttribute('content') || '';
          const metaLicense =
            anchor.querySelector('meta[itemprop="copyrightNotice"]')?.getAttribute('content') || '';
          const metaAuthor =
            anchor.querySelector('meta[itemprop="author"]')?.getAttribute('content') || '';

          const rawTitle =
            metaName.replace(/\s*SVG\s*(Icon|File|Vector)$/i, '').trim() ||
            (img.getAttribute('alt') || '').replace(/\s*SVG\s*(Icon|File|Vector)$/i, '').trim() ||
            slug;

          icons.push({
            id,
            slug,
            title: rawTitle,
            sourceUrl,
            detailUrl: detailHref ? `${baseUrl}${detailHref}` : '',
            domWidth: img.getAttribute('width') || null,
            domHeight: img.getAttribute('height') || null,
            metaLicense,
            metaAuthor,
          });
        }

        const nextBtn = document.querySelector(
          `a[title="Next Page"][href*="/collection/${fallback.slug}/"]`
        );

        return {
          name: cleanName,
          description: metaDesc || fallback.description || '',
          totalIcons: totalIcons || icons.length,
          currentPage: pageNum,
          totalPages,
          icons,
          nextPageHref: nextBtn ? nextBtn.getAttribute('href') : null,
        };
      },
      { baseUrl: BASE_URL, fallback: fallbackCollectionInfo, pageNum: currentPageNum }
    );
  }

  async runCrawl() {
    this.setupNetworkMetadataInterceptor();

    const siteState = this.stateManager.getSiteState(this.siteId);
    const category = this.options.category || siteState.currentCategory || 'all';
    let listPageNum = Number(this.options.startListPage) || siteState.currentListPage || 1;
    const maxListPages = Number(this.options.maxListPages) || 0;
    const maxCollectionsPerPage = Number(this.options.maxCollectionsPerPage) || 0;
    const maxPagesPerCollection = Number(this.options.maxPagesPerCollection) || 0;
    const skipCompleted = this.options.skipCompletedCollections !== false;

    let listPagesVisited = 0;

    while (true) {
      await this.checkPauseOrStop();

      if (maxListPages > 0 && listPagesVisited >= maxListPages) {
        this.log(`🏁 Đã đạt giới hạn ${maxListPages} trang danh sách Collection.`, 'info');
        break;
      }

      const listUrl = this.buildCollectionsListUrl(category, listPageNum);
      this.updateProgress({
        currentListPage: listPageNum,
        currentUrl: listUrl,
        currentCollection: null,
        currentAction: `Đang mở trang danh sách Collection #${listPageNum} (${category})...`,
      });

      this.log(`🌐 Mở trang danh sách Collection #${listPageNum}: ${listUrl}`, 'info');

      if (this.page.url() !== listUrl) {
        await this.page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      }

      await this.page.waitForSelector('a[href^="/collection/"]', { timeout: 25000 });

      this.stateManager.updateSiteState(this.siteId, (st) => {
        st.currentCategory = category;
        st.currentListPage = listPageNum;
      });

      await this.human.waitPostPageLoad(`trang danh sách Collection #${listPageNum}`);
      await this.checkPauseOrStop();

      this.updateProgress({
        currentAction: `Đang lướt xem trang danh sách Collection #${listPageNum}...`,
      });
      await this.human.simulatePageExploration({ scrollPasses: 2, hoverCount: 2 });
      await this.checkPauseOrStop();

      const { collections, nextListPageHref } = await this.extractCollectionsOnListPage(category);
      this.log(`📂 Tìm thấy ${collections.length} collections trên trang #${listPageNum}.`, 'info');

      if (collections.length === 0) {
        this.log('⚠️ Không tìm thấy collection nào trên trang này. Kết thúc.', 'warn');
        break;
      }

      const collectionsToProcess =
        maxCollectionsPerPage > 0
          ? collections.slice(0, maxCollectionsPerPage)
          : collections;

      for (let idx = 0; idx < collectionsToProcess.length; idx++) {
        await this.checkPauseOrStop();
        const col = collectionsToProcess[idx];

        const currentSiteState = this.stateManager.getSiteState(this.siteId);
        if (skipCompleted && currentSiteState.completedCollections.includes(col.slug)) {
          this.log(
            `⏭️ Bỏ qua collection "${col.name}" (${col.slug}) vì đã crawl hoàn tất trước đó.`,
            'info'
          );
          continue;
        }

        if (!this.page.url().includes('/collections')) {
          this.log(`🔙 Quay lại trang danh sách Collection #${listPageNum}...`, 'info');
          await this.page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
          await this.page.waitForSelector('a[href^="/collection/"]', { timeout: 20000 });
          await this.human.waitPostPageLoad(`trang danh sách Collection #${listPageNum}`);
        }

        await this.human.waitActionGap(`Chuẩn bị vào collection "${col.name}" (${idx + 1}/${collectionsToProcess.length})`);
        await this.checkPauseOrStop();

        this.updateProgress({
          currentAction: `Đang di chuột và click vào collection "${col.name}"...`,
          currentCollection: col.name,
        });

        const cardLocator = this.page.locator(`a[href="${col.href}"]`).first();
        if ((await cardLocator.count()) > 0) {
          this.log(`🖱️ Click vào collection [${idx + 1}/${collectionsToProcess.length}]: "${col.name}"`, 'info');
          await this.human.humanClickLocator(cardLocator, `collection "${col.name}"`);
          try {
            await this.page.waitForURL((url) => url.pathname.includes(`/collection/${col.slug}`), {
              timeout: 15000,
            });
          } catch {
            await this.page.goto(col.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
          }
        } else {
          await this.page.goto(col.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        }

        await this.page.waitForSelector('img[src*="/show/"]', { timeout: 25000 }).catch(() => {});

        await this.crawlSingleCollection(col, maxPagesPerCollection);

        await this.checkPauseOrStop();
        await this.human.waitActionGap('Chuẩn bị quay lại trang danh sách Collection');

        this.updateProgress({
          currentAction: `Đang quay lại trang danh sách Collection #${listPageNum}...`,
        });
        this.log(`🔙 Quay trở lại trang danh sách Collection #${listPageNum}...`, 'info');

        const breadcrumbLocator = this.page.locator('a[href="/collections/"]').first();
        if (listPageNum === 1 && category === 'all' && (await breadcrumbLocator.count()) > 0) {
          await this.human.humanClickLocator(breadcrumbLocator, 'nút quay lại Collections');
          await this.page
            .waitForURL((u) => u.pathname.startsWith('/collections'), { timeout: 12000 })
            .catch(async () => {
              await this.page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
            });
        } else {
          await this.page.goto(listUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        }

        await this.page.waitForSelector('a[href^="/collection/"]', { timeout: 25000 }).catch(() => {});
        await this.human.waitPostPageLoad(`trang danh sách Collection #${listPageNum}`);
      }

      listPagesVisited += 1;

      if (maxListPages > 0 && listPagesVisited >= maxListPages) {
        this.log(`🏁 Đã hoàn thành ${listPagesVisited} trang danh sách Collection theo cấu hình.`, 'success');
        break;
      }

      const nextListBtn = this.page.locator('a[title="Next Page"][href*="/collections/"]').first();
      if ((await nextListBtn.count()) > 0 || nextListPageHref) {
        await this.human.waitActionGap(`Chuyển sang trang danh sách Collection #${listPageNum + 1}`);
        this.log(`➡️ Chuyển sang trang danh sách Collection tiếp theo (#${listPageNum + 1})...`, 'info');
        this.updateProgress({
          currentAction: `Đang click Next Page sang trang danh sách #${listPageNum + 1}...`,
        });

        if ((await nextListBtn.count()) > 0) {
          await this.human.humanClickLocator(nextListBtn, `Next Page (Trang ${listPageNum + 1})`);
          await this.page
            .waitForURL((u) => u.pathname.includes(`/${listPageNum + 1}`), { timeout: 15000 })
            .catch(() => {});
        }
        listPageNum += 1;
      } else {
        this.log('🏁 Không còn trang danh sách Collection tiếp theo.', 'success');
        break;
      }
    }
  }

  async crawlSingleCollection(colInfo, maxPagesPerCollection = 0) {
    let colPageNum = 1;
    let pagesCrawledInCol = 0;

    const siteState = this.stateManager.getSiteState(this.siteId);
    const savedProgress = siteState.collectionProgress?.[colInfo.slug];
    if (savedProgress?.lastCompletedPage && savedProgress.lastCompletedPage >= 1) {
      colPageNum = savedProgress.lastCompletedPage + 1;
      const resumeUrl = `${BASE_URL}/collection/${colInfo.slug}/${colPageNum}`;
      this.log(`🔄 Tiếp tục collection "${colInfo.name}" từ trang #${colPageNum}: ${resumeUrl}`, 'info');
      await this.page.goto(resumeUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await this.page.waitForSelector('img[src*="/show/"]', { timeout: 20000 }).catch(() => {});
    }

    while (true) {
      await this.checkPauseOrStop();

      await this.human.waitPostPageLoad(`trang #${colPageNum} của collection "${colInfo.name}"`);
      await this.checkPauseOrStop();

      this.updateProgress({
        currentUrl: this.page.url(),
        currentCollection: colInfo.name,
        collectionPage: colPageNum,
        currentAction: `Đang cuộn trang xem danh sách SVG trong "${colInfo.name}" (Trang ${colPageNum})...`,
      });

      await this.human.scrollThroughPageContent(() => this.status !== 'running');
      await this.checkPauseOrStop();

      const pageDetails = await this.extractCollectionPageDetails(colInfo, colPageNum);

      const enrichedCollection = {
        ...colInfo,
        name: pageDetails.name || colInfo.name,
        description: pageDetails.description || colInfo.description,
        totalIcons: pageDetails.totalIcons || colInfo.totalIcons,
        totalPages: pageDetails.totalPages || 1,
        tags: extractTagsFromText(
          colInfo.slug,
          pageDetails.name,
          colInfo.category !== 'all' ? colInfo.category : '',
          ...(pageDetails.icons || []).slice(0, 8).map((ic) => ic.title)
        ),
      };

      const savedMeta = this.stateManager.saveCollectionMetadata(this.siteId, enrichedCollection);
      this.emit('collection_updated', {
        site: this.siteId,
        ...savedMeta.collection,
        downloadedIconsCount: savedMeta.icons.length,
      });

      const iconsOnPage = pageDetails.icons || [];
      this.log(
        `🎨 Collection "${enrichedCollection.name}" [Trang ${colPageNum}/${enrichedCollection.totalPages}]: phát hiện ${iconsOnPage.length} SVG trên DOM (Tác giả: ${enrichedCollection.author} | Giấy phép: ${enrichedCollection.license}).`,
        'info'
      );

      this.updateProgress({
        collectionPage: colPageNum,
        collectionTotalPages: enrichedCollection.totalPages,
        collectionIconsTotal: enrichedCollection.totalIcons,
        collectionIconsDownloaded: savedMeta.icons.length,
      });

      for (let i = 0; i < iconsOnPage.length; i++) {
        await this.checkPauseOrStop();
        const icon = iconsOnPage[i];

        if (this.stateManager.isIconDownloaded(this.siteId, colInfo.slug, icon.id, icon.slug)) {
          continue;
        }

        this.updateProgress({
          currentAction: `Đang tải SVG [${i + 1}/${iconsOnPage.length}] trang ${colPageNum}: ${icon.title} (${icon.slug}.svg)...`,
        });

        if (this.human.config.enableMouseMovement && i % naturalRandom(4, 8) === 0) {
          const iconImgLocator = this.page.locator(`img[src*="/show/${icon.id}/"]`).first();
          const box = await iconImgLocator.boundingBox().catch(() => null);
          if (box && box.y > 0 && box.y < 850) {
            await this.human.moveMouseSmoothly(
              Math.round(box.x + box.width / 2),
              Math.round(box.y + box.height / 2),
              12
            );
          }
        }

        try {
          const svgXml = await this.fetchSvgInBrowser(icon.sourceUrl);
          const iconRecord = this.stateManager.saveIconSvg(
            this.siteId,
            colInfo.slug,
            {
              ...icon,
              rawCategory: colInfo.category !== 'all' ? colInfo.category : '',
              license:
                colInfo.license && colInfo.license !== 'Open License'
                  ? colInfo.license
                  : icon.metaLicense || 'CC0',
              author:
                colInfo.author && colInfo.author !== 'SVG Repo'
                  ? colInfo.author
                  : icon.metaAuthor || 'SVG Repo',
            },
            svgXml
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
            collectionSlug: colInfo.slug,
            collectionName: enrichedCollection.name,
            icon: iconRecord,
          });

          this.log(
            `✅ [${i + 1}/${iconsOnPage.length}] Đã tải: ${iconRecord.fileName} (Category: ${iconRecord.category} | Style: ${iconRecord.styleType} | Grid: ${iconRecord.gridSize})`,
            'success'
          );
        } catch (err) {
          this.log(`⚠️ Lỗi tải icon "${icon.title}": ${err.message}`, 'warn');
        }

        await this.human.waitDownloadGap();
      }

      pagesCrawledInCol += 1;
      this.stateManager.updateSiteState(this.siteId, (st) => {
        if (!st.collectionProgress) st.collectionProgress = {};
        st.collectionProgress[colInfo.slug] = {
          lastCompletedPage: colPageNum,
          totalPages: enrichedCollection.totalPages,
          updatedAt: new Date().toISOString(),
        };
      });

      if (maxPagesPerCollection > 0 && pagesCrawledInCol >= maxPagesPerCollection) {
        this.log(
          `ℹ️ Đạt giới hạn ${maxPagesPerCollection} trang cho collection "${enrichedCollection.name}".`,
          'info'
        );
        break;
      }

      const nextColPageBtn = this.page
        .locator(`a[title="Next Page"][href*="/collection/${colInfo.slug}/"]`)
        .first();

      if ((await nextColPageBtn.count()) > 0 && pageDetails.nextPageHref) {
        await this.human.waitActionGap(
          `Chuyển sang trang ${colPageNum + 1}/${enrichedCollection.totalPages} của collection "${enrichedCollection.name}"`
        );
        await this.checkPauseOrStop();

        const nextTargetUrl = `${BASE_URL}${pageDetails.nextPageHref}`;
        this.log(
          `➡️ Sang trang ${colPageNum + 1}/${enrichedCollection.totalPages} trong collection "${enrichedCollection.name}"...`,
          'info'
        );
        this.updateProgress({
          currentAction: `Đang click Next Page sang trang ${colPageNum + 1} của "${enrichedCollection.name}"...`,
        });

        await this.human.humanClickLocator(
          nextColPageBtn,
          `Next Page (Trang ${colPageNum + 1} - ${enrichedCollection.name})`
        );

        try {
          await this.page.waitForURL(
            (u) => u.pathname.endsWith(`/${colPageNum + 1}`),
            { timeout: 15000 }
          );
        } catch {
          await this.page.goto(nextTargetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        }

        await this.page.waitForSelector('img[src*="/show/"]', { timeout: 25000 }).catch(() => {});
        colPageNum += 1;
      } else {
        this.stateManager.updateSiteState(this.siteId, (st) => {
          if (!st.completedCollections.includes(colInfo.slug)) {
            st.completedCollections.push(colInfo.slug);
            st.totalCollectionsCrawled = (st.totalCollectionsCrawled || 0) + 1;
          }
          if (st.collectionProgress) {
            delete st.collectionProgress[colInfo.slug];
          }
        });

        this.updateProgress({
          sessionCollectionsCrawled: (this.currentProgress.sessionCollectionsCrawled || 0) + 1,
        });

        this.log(`🎉 Hoàn tất toàn bộ collection "${enrichedCollection.name}"!`, 'success');
        break;
      }
    }
  }
}

module.exports = { SvgRepoCrawler };
