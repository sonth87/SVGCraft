const { SvgRepoCrawler } = require('./svgrepoCrawler');
const { TheSvgCrawler } = require('./thesvgCrawler');
const { AllSvgIconsCrawler } = require('./allsvgiconsCrawler');
const { LordiconCrawler } = require('./lordiconCrawler');

const CRAWLER_CLASSES = {
  svgrepo: SvgRepoCrawler,
  thesvg: TheSvgCrawler,
  allsvgicons: AllSvgIconsCrawler,
  lordicon: LordiconCrawler,
};

function loadCrawlerClasses() {
  for (const modPath of [
    '../utils/humanSimulator',
    './baseCrawler',
    './svgrepoCrawler',
    './thesvgCrawler',
    './allsvgiconsCrawler',
    './lordiconCrawler',
  ]) {
    try {
      delete require.cache[require.resolve(modPath)];
    } catch {
      // Ignore
    }
  }
  const { SvgRepoCrawler: FreshSvgRepo } = require('./svgrepoCrawler');
  const { TheSvgCrawler: FreshTheSvg } = require('./thesvgCrawler');
  const { AllSvgIconsCrawler: FreshAllSvgIcons } = require('./allsvgiconsCrawler');
  const { LordiconCrawler: FreshLordicon } = require('./lordiconCrawler');
  return {
    svgrepo: FreshSvgRepo,
    thesvg: FreshTheSvg,
    allsvgicons: FreshAllSvgIcons,
    lordicon: FreshLordicon,
  };
}

function getAvailableSites(stateManager) {
  const classes = loadCrawlerClasses();
  return Object.entries(classes).map(([id, CrawlerCls]) => {
    const tempInstance = new CrawlerCls(stateManager);
    const siteState = stateManager.getSiteState(id);
    return {
      ...tempInstance.siteInfo,
      state: siteState,
    };
  });
}

function createCrawler(siteId, stateManager, options = {}) {
  const classes = loadCrawlerClasses();
  const CrawlerCls = classes[siteId];
  if (!CrawlerCls) {
    throw new Error(`Trang crawl "${siteId}" chưa được hỗ trợ.`);
  }
  return new CrawlerCls(stateManager, options);
}

module.exports = {
  CRAWLER_CLASSES,
  getAvailableSites,
  createCrawler,
};
