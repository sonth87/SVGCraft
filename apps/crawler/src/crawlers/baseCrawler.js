const EventEmitter = require('events');
const path = require('path');
const { chromium } = require('playwright-core');
const { DATA_DIR } = require('@svg-hub/shared');
const { HumanSimulator, sleep } = require('../utils/humanSimulator');

class BaseCrawler extends EventEmitter {
  constructor(stateManager, options = {}) {
    super();
    this.stateManager = stateManager;
    this.options = options;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.human = null;

    this.status = 'idle'; // 'idle' | 'running' | 'paused' | 'stopping' | 'error'
    this.currentProgress = {
      siteId: this.siteId,
      status: 'idle',
      currentAction: 'Sẵn sàng',
      currentUrl: '',
      currentListPage: 1,
      currentCollection: null,
      collectionPage: 1,
      collectionTotalPages: 1,
      collectionIconsDownloaded: 0,
      collectionIconsTotal: 0,
      sessionCollectionsCrawled: 0,
      sessionIconsDownloaded: 0,
    };
  }

  get siteId() {
    return 'base';
  }

  get siteInfo() {
    return {
      id: this.siteId,
      name: 'Base SVG Crawler',
      baseUrl: '',
      description: '',
    };
  }

  log(message, level = 'info', extra = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      siteId: this.siteId,
      level,
      message,
      ...extra,
    };
    this.emit('log', entry);
  }

  updateProgress(patch = {}) {
    this.currentProgress = {
      ...this.currentProgress,
      ...patch,
      status: this.status,
      updatedAt: new Date().toISOString(),
    };
    this.emit('progress', this.currentProgress);
  }

  async launchBrowser() {
    const headless = Boolean(this.options.headless);
    const userDataDir = path.join(DATA_DIR, `browser-profile-${this.siteId}`);

    this.log(
      `🚀 Khởi động trình duyệt Chrome (${headless ? 'Chạy ẩn / Headless' : 'Hiển thị trực tiếp / Headed'})...`,
      'info'
    );

    this.context = await chromium.launchPersistentContext(userDataDir, {
      channel: 'chrome',
      headless,
      viewport: { width: 1440, height: 900 },
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-default-browser-check',
        '--disable-infobars',
      ],
    });

    await this.context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    const pages = this.context.pages();
    this.page = pages.length > 0 ? pages[0] : await this.context.newPage();

    this.human = new HumanSimulator(this.page, this.options, (msg, level) => {
      this.log(msg, level);
    });

    this.page.on('domcontentloaded', () => {
      if (this.human) {
        this.human.ensureVisualCursor().catch(() => {});
      }
    });
  }

  async closeBrowser() {
    try {
      if (this.context) {
        await this.context.close();
      }
    } catch {
      // Ignore close errors
    } finally {
      this.context = null;
      this.page = null;
      this.human = null;
    }
  }

  async checkPauseOrStop() {
    while (this.status === 'paused') {
      await sleep(400);
    }
    if (this.status === 'stopping' || this.status === 'idle') {
      const err = new Error('CRAWL_STOPPED_BY_USER');
      err.isStopSignal = true;
      throw err;
    }
  }

  pause() {
    if (this.status === 'running') {
      this.status = 'paused';
      this.log('⏸️ Đã tạm dừng phiên crawl. Nhấn "Tiếp tục" để chạy tiếp.', 'warn');
      this.updateProgress({ currentAction: 'Đã tạm dừng (Paused)' });
    }
  }

  resume() {
    if (this.status === 'paused') {
      this.status = 'running';
      this.log('▶️ Tiếp tục phiên crawl...', 'info');
      this.updateProgress({ currentAction: 'Đang tiếp tục...' });
    }
  }

  async stop() {
    if (this.status === 'running' || this.status === 'paused') {
      this.status = 'stopping';
      this.log('🛑 Đang dừng phiên crawl và đóng trình duyệt an toàn...', 'warn');
      this.updateProgress({ currentAction: 'Đang dừng...' });
      await this.closeBrowser();
      this.status = 'idle';
      this.updateProgress({ currentAction: 'Đã dừng' });
    }
  }

  async fetchSvgInBrowser(svgUrl) {
    // 1. Try Playwright's browser context APIRequestContext first for cross-origin CDN URLs (bypasses CORS while sharing browser network stack)
    const pageUrl = this.page ? this.page.url() : '';
    let isSameOrigin = false;
    try {
      isSameOrigin = Boolean(pageUrl) && new URL(svgUrl).origin === new URL(pageUrl).origin;
    } catch {
      isSameOrigin = false;
    }

    if (isSameOrigin && this.page) {
      try {
        return await this.page.evaluate(async (url) => {
          const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
              Accept: 'image/svg+xml,text/xml,application/xml,*/*;q=0.8',
            },
          });
          if (!res.ok) {
            throw new Error(`HTTP ${res.status} khi tải ${url}`);
          }
          const text = await res.text();
          if (!text.includes('<svg')) {
            throw new Error('Nội dung tải về không phải là file SVG hợp lệ');
          }
          return text;
        }, svgUrl);
      } catch {
        // Fall through to context.request / Node fetch below if in-page fetch fails
      }
    }

    // 2. Use Playwright BrowserContext request (immune to CORS restrictions on CDN subdomains like i.allsvgicons.com)
    if (this.context && this.context.request) {
      try {
        const response = await this.context.request.get(svgUrl, {
          headers: {
            Accept: 'image/svg+xml,text/xml,application/xml,*/*;q=0.8',
            Referer: pageUrl || undefined,
          },
          timeout: 30000,
        });
        if (response.ok()) {
          const text = await response.text();
          if (text && text.includes('<svg')) {
            return text;
          }
        }
      } catch {
        // Fall through to Node fetch
      }
    }

    // 3. Final fallback: Node native fetch
    const res = await fetch(svgUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept: 'image/svg+xml,text/xml,application/xml,*/*;q=0.8',
        ...(pageUrl ? { Referer: pageUrl } : {}),
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} khi tải ${svgUrl}`);
    }
    const text = await res.text();
    if (!text.includes('<svg')) {
      throw new Error('Nội dung tải về không phải là file SVG hợp lệ');
    }
    return text;
  }

  async start(runtimeOptions = {}) {
    if (this.status === 'running' || this.status === 'paused') {
      throw new Error('Crawler đang chạy!');
    }

    this.options = { ...this.options, ...runtimeOptions };
    this.status = 'running';
    this.updateProgress({
      currentAction: 'Đang khởi tạo trình duyệt...',
      sessionCollectionsCrawled: 0,
      sessionIconsDownloaded: 0,
    });

    try {
      await this.launchBrowser();
      await this.runCrawl();
      if (this.status !== 'stopping') {
        this.status = 'idle';
        this.log('✅ Hoàn tất phiên crawl theo cấu hình!', 'success');
        this.updateProgress({ currentAction: 'Hoàn tất phiên crawl' });
      }
    } catch (err) {
      if (err.isStopSignal) {
        this.log('🛑 Đã dừng phiên crawl theo yêu cầu của người dùng.', 'warn');
      } else {
        this.status = 'error';
        this.log(`❌ Lỗi khi crawl: ${err.message}`, 'error');
        this.updateProgress({ currentAction: `Lỗi: ${err.message}` });
      }
    } finally {
      await this.closeBrowser();
      if (this.status === 'stopping' || this.status === 'running') {
        this.status = 'idle';
      }
      this.updateProgress();
    }
  }

  async runCrawl() {
    throw new Error('runCrawl() must be implemented by subclass');
  }
}

module.exports = { BaseCrawler };
