const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const {
  CATEGORY_DEFINITIONS,
  LORDICON_CATEGORIES,
  STYLE_TYPES,
  ICON_TYPES,
  parseSvgMetadata,
  extractTagsFromText,
  classifyIcon,
  resolveLordiconCategory,
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

function cleanCollectionDisplayName(rawName, slug = '') {
  const raw = String(rawName || slug || '').trim();
  if (slug === 'brands-popular' || /^thesvg\s+brand\s+icons/i.test(raw)) {
    return 'Popular Brand Logos (Full Set)';
  }
  return raw
    .replace(/\s+PAGE\s*\d+\b/gi, '')
    .replace(/\btheSVG\b/gi, 'Brand')
    .replace(/^(?:Lordicon|Animated)\s+(?=(?:System|Doodle|Wired)\b)/i, '')
    .replace(/\bLordicon\b\s*[—-]?\s*/gi, '')
    .replace(/\bAll\s*SVG\s*Icons\b\s*[—-]?\s*/gi, '')
    .replace(/\bSVG\s*Repo\b\s*[—-]?\s*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanAuthorName(rawAuthor) {
  const a = String(rawAuthor || '').trim();
  if (!a || /^(lordicon|thesvg|svg\s*repo|all\s*svg\s*icons)$/i.test(a)) {
    return 'Open Source';
  }
  return a.replace(/\bLordicon\b/gi, 'Animated Studio').trim();
}

function cleanLicenseName(rawLicense) {
  const l = String(rawLicense || '').trim();
  if (!l || /lordicon/i.test(l)) {
    return 'MIT / CC0';
  }
  return l;
}

const LEGACY_CATEGORY_MAP = {
  animation: 'popular',
  architecture: 'architecture-and-places',
  finance: 'business-and-finance',
  design: 'design-and-editing',
  security: 'security-and-military',
  social: 'communication',
  productivity: 'work-and-education',
  hardware: 'tech-and-devices',
  food: 'food-and-drink',
  health: 'health-and-medical',
  dev: 'devtools',
};

function normalizeCategoryId(cat) {
  if (!cat) return '';
  const clean = String(cat).trim().toLowerCase().replace(/^lordicon:/, '');
  return LEGACY_CATEGORY_MAP[clean] || clean;
}

const BRAND_ECOSYSTEM_DEFINITIONS = [
  // Tier 1: Flagship Tech Corporations & AI Ecosystems
  {
    slug: 'family-google',
    name: 'Google (Gmail, YouTube, Android, Chrome, Gemini)',
    primaryCategory: 'brand',
    tier: 1,
    regex:
      /\b(google|gmail|youtube|android|chrome|chromium|firebase|flutter|golang|angular|tensorflow|gemini|bard|waymo|waze|fitbit|nest|chromecast|adsense|adwords|playstore|google-play|google-drive|google-maps|google-meet|google-photos|google-cloud)\b/i,
  },
  {
    slug: 'family-microsoft',
    name: 'Microsoft (Windows, VS Code, Office, Xbox, GitHub)',
    primaryCategory: 'brand',
    tier: 1,
    regex:
      /\b(microsoft|windows|xbox|vscode|visual-studio|github|linkedin|skype|bing|office|outlook|onedrive|sharepoint|teams|powerbi|dotnet|typescript|npm|nuget|hololens|edge)\b/i,
  },
  {
    slug: 'family-apple',
    name: 'Apple (macOS, iOS, iPhone, Safari, Xcode, Swift)',
    primaryCategory: 'brand',
    tier: 1,
    regex:
      /\b(apple|ios|macos|mac|iphone|ipad|ipod|itunes|icloud|safari|swift|xcode|app-store|appstore|airplay|airpods|apple-pay|apple-music|apple-tv|siri|testflight|watchos|homekit|finder)\b/i,
  },
  {
    slug: 'family-amazon',
    name: 'Amazon (Prime, Twitch, Alexa, Kindle, Audible)',
    primaryCategory: 'brand',
    tier: 1,
    regex: /\b(amazon|prime|twitch|audible|kindle|alexa|goodreads|imdb|whole-foods|ring|zappos)\b/i,
  },
  {
    slug: 'family-meta',
    name: 'Meta (Facebook, Instagram, WhatsApp, Threads, React)',
    primaryCategory: 'brand',
    tier: 1,
    regex: /\b(meta|facebook|instagram|whatsapp|messenger|threads|oculus|pytorch|react|graphql)\b/i,
  },
  {
    slug: 'family-adobe',
    name: 'Adobe (Photoshop, Illustrator, Premiere, Lightroom)',
    primaryCategory: 'design-and-editing',
    tier: 1,
    regex:
      /\b(adobe|photoshop|illustrator|indesign|premiere|after-effects|lightroom|xd|acrobat|creative-cloud|behance|dreamweaver|audition|animate|magento|frame-io)\b/i,
  },
  {
    slug: 'brand-openai',
    name: 'OpenAI (ChatGPT, GPT-4, Sora, Whisper, DALL·E)',
    primaryCategory: 'ai',
    tier: 1,
    regex: /\b(openai|chatgpt|gpt|dall-e|whisper|sora)\b/i,
  },
  {
    slug: 'family-anthropic',
    name: 'Anthropic & Claude AI',
    primaryCategory: 'ai',
    tier: 1,
    regex: /\b(anthropic|claude)\b/i,
  },
  {
    slug: 'family-xai',
    name: 'xAI, Grok & X (Twitter)',
    primaryCategory: 'ai',
    tier: 1,
    regex: /\b(xai|grok|twitter|x-corp|periscope|tweetdeck)\b/i,
  },
  {
    slug: 'family-vercel',
    name: 'Vercel, Next.js & Turborepo',
    primaryCategory: 'devtools',
    tier: 1,
    regex: /\b(vercel|nextjs|next-js|turborepo|turbo|v0|swr|zeit)\b/i,
  },
  {
    slug: 'family-jetbrains',
    name: 'JetBrains (IntelliJ, WebStorm, PyCharm, Kotlin)',
    primaryCategory: 'devtools',
    tier: 1,
    regex:
      /\b(jetbrains|intellij|pycharm|webstorm|phpstorm|goland|rider|clion|rubymine|datagrip|kotlin|resharper|youtrack|teamcity|fleet)\b/i,
  },
  {
    slug: 'family-ibm',
    name: 'IBM, Red Hat & HashiCorp (Terraform, Vault, Consul)',
    primaryCategory: 'cloud',
    tier: 1,
    regex:
      /\b(ibm|redhat|red-hat|hashicorp|terraform|vagrant|vault|consul|nomad|packer|openshift|watson|fedora|ansible)\b/i,
  },
  {
    slug: 'family-atlassian',
    name: 'Atlassian (Jira, Confluence, Trello, Bitbucket)',
    primaryCategory: 'devtools',
    tier: 1,
    regex: /\b(atlassian|jira|confluence|trello|bitbucket|sourcetree|bamboo|opsgenie|statuspage|loom)\b/i,
  },
  {
    slug: 'family-salesforce',
    name: 'Salesforce (Slack, Heroku, Tableau, MuleSoft)',
    primaryCategory: 'cloud',
    tier: 1,
    regex: /\b(salesforce|slack|heroku|tableau|mulesoft)\b/i,
  },
  {
    slug: 'family-oracle',
    name: 'Oracle (Java, MySQL, VirtualBox, NetSuite)',
    primaryCategory: 'cloud',
    tier: 1,
    regex: /\b(oracle|mysql|java|virtualbox|netsuite)\b/i,
  },
  {
    slug: 'family-cisco',
    name: 'Cisco (Webex, Splunk, Meraki, AppDynamics)',
    primaryCategory: 'security-and-military',
    tier: 1,
    regex: /\b(cisco|webex|splunk|meraki|appdynamics)\b/i,
  },
  {
    slug: 'family-elastic',
    name: 'Elastic (Elasticsearch, Kibana, Logstash)',
    primaryCategory: 'cloud',
    tier: 1,
    regex: /\b(elastic|elasticsearch|kibana|logstash|beats)\b/i,
  },
  {
    slug: 'family-bytedance',
    name: 'ByteDance (TikTok, CapCut, Lark, Douyin)',
    primaryCategory: 'communication',
    tier: 1,
    regex: /\b(bytedance|tiktok|douyin|capcut|lark|pico)\b/i,
  },
  {
    slug: 'family-tencent',
    name: 'Tencent (WeChat, Riot Games, Valorant, Epic)',
    primaryCategory: 'communication',
    tier: 1,
    regex: /\b(tencent|wechat|weixin|qq|riot|valorant|league-of-legends|pubg|epic-games)\b/i,
  },
  {
    slug: 'family-alibaba',
    name: 'Alibaba (AliExpress, Alipay, Taobao, DingTalk)',
    primaryCategory: 'business-and-finance',
    tier: 1,
    regex: /\b(alibaba|aliexpress|alipay|taobao|tmall|dingtalk|ant-design)\b/i,
  },
  {
    slug: 'family-sony',
    name: 'Sony & PlayStation',
    primaryCategory: 'brand',
    tier: 1,
    regex: /\b(sony|playstation|ps4|ps5|vaio|walkman|crunchyroll)\b/i,
  },
  {
    slug: 'family-disney',
    name: 'Disney (Pixar, Marvel, Star Wars, Hulu, ESPN)',
    primaryCategory: 'brand',
    tier: 1,
    regex: /\b(disney|pixar|marvel|star-wars|starwars|hulu|espn|national-geographic)\b/i,
  },

  // Tier 1.5: Cloud Infrastructure & Architecture Brand Suites
  { slug: 'aws', name: 'AWS (Amazon Web Services)', primaryCategory: 'cloud', tier: 1, exactCol: 'aws' },
  { slug: 'azure', name: 'Microsoft Azure Cloud', primaryCategory: 'cloud', tier: 1, exactCol: 'azure' },
  { slug: 'gcp', name: 'Google Cloud Platform (GCP)', primaryCategory: 'cloud', tier: 1, exactCol: 'gcp' },
  { slug: 'k8s', name: 'Kubernetes (K8s) & CNCF', primaryCategory: 'cloud', tier: 1, exactCol: 'k8s' },

  // Tier 2: Developer, Design, Finance, Hardware & Consumer Brand Ecosystems
  {
    slug: 'brand-github',
    name: 'GitHub, GitLab & Git Ecosystem',
    primaryCategory: 'devtools',
    tier: 2,
    regex: /\b(github|gitlab|git|bitbucket|octocat|dependabot|codespaces|gitea|sourcetree)\b/i,
  },
  {
    slug: 'brand-docker',
    name: 'Docker, Podman & Container Tools',
    primaryCategory: 'cloud',
    tier: 2,
    regex: /\b(docker|podman|containerd|portainer|rancher|helm)\b/i,
  },
  {
    slug: 'brand-cloudflare',
    name: 'Cloudflare, Netlify, DigitalOcean & Edge',
    primaryCategory: 'cloud',
    tier: 2,
    regex: /\b(cloudflare|netlify|heroku|digitalocean|linode|vultr|render|railway|fly-io|fastly|akamai)\b/i,
  },
  {
    slug: 'brand-firebase',
    name: 'Firebase, Supabase, Auth0 & BaaS',
    primaryCategory: 'cloud',
    tier: 2,
    regex: /\b(firebase|supabase|appwrite|pocketbase|amplify|auth0|clerk)\b/i,
  },
  {
    slug: 'brand-linux',
    name: 'Linux (Ubuntu, Debian, Arch, Kali, RedHat)',
    primaryCategory: 'devtools',
    tier: 2,
    regex:
      /\b(linux|ubuntu|debian|fedora|arch-linux|centos|redhat|kali|alpine|nixos|suse|manjaro|raspbian|freebsd|tux|gnome|kde)\b/i,
  },
  {
    slug: 'brand-react',
    name: 'React, Next.js, Tailwind & Modern Web',
    primaryCategory: 'devtools',
    tier: 2,
    regex:
      /\b(react|nextjs|next-js|redux|remix|gatsby|preact|react-router|tailwind|tailwindcss|vite|astro|solidjs)\b/i,
  },
  {
    slug: 'brand-vue',
    name: 'Vue.js, Nuxt, Angular & Svelte',
    primaryCategory: 'devtools',
    tier: 2,
    regex: /\b(vue|vuejs|nuxt|nuxtjs|pinia|vuetify|vitepress|angular|svelte)\b/i,
  },
  {
    slug: 'brand-js-ts',
    name: 'JavaScript, TypeScript, Node.js, Bun & Deno',
    primaryCategory: 'devtools',
    tier: 2,
    regex: /\b(javascript|typescript|nodejs|node-js|npm|pnpm|yarn|bun|deno|webpack|babel|eslint|prettier)\b/i,
  },
  {
    slug: 'brand-python',
    name: 'Python, PyTorch, TensorFlow & HuggingFace',
    primaryCategory: 'ai',
    tier: 2,
    regex:
      /\b(python|django|flask|fastapi|pytorch|tensorflow|pandas|numpy|jupyter|anaconda|scikit|keras|huggingface|opencv)\b/i,
  },
  {
    slug: 'brand-backend-langs',
    name: 'Go, Rust, PHP, Laravel & Ruby',
    primaryCategory: 'devtools',
    tier: 2,
    regex: /\b(golang|rust|cargo|php|laravel|symfony|wordpress|ruby|rails|elixir|phoenix|scala|clojure|haskell|erlang)\b/i,
  },
  {
    slug: 'brand-database',
    name: 'PostgreSQL, MongoDB, Redis & Databases',
    primaryCategory: 'cloud',
    tier: 2,
    regex:
      /\b(postgresql|postgres|mysql|mariadb|mongodb|redis|sqlite|cassandra|neo4j|dynamodb|cockroachdb|clickhouse|prisma|drizzle|elasticsearch)\b/i,
  },
  {
    slug: 'brand-figma',
    name: 'Figma, Canva, Sketch, Framer & Dribbble',
    primaryCategory: 'design-and-editing',
    tier: 2,
    regex: /\b(figma|sketch|canva|framer|invision|zeplin|dribbble|behance)\b/i,
  },
  {
    slug: 'brand-3d-engines',
    name: 'Blender, Unity, Unreal Engine & Autodesk',
    primaryCategory: 'design-and-editing',
    tier: 2,
    regex: /\b(blender|unity|unreal|godot|autodesk|maya|3ds-max|cinema4d|houdini|zbrush)\b/i,
  },
  {
    slug: 'brand-payments',
    name: 'Stripe, PayPal, Visa, Mastercard & FinTech',
    primaryCategory: 'business-and-finance',
    tier: 2,
    regex:
      /\b(stripe|paypal|visa|mastercard|amex|american-express|apple-pay|google-pay|alipay|wechat-pay|wise|revolut|klarna|adyen|braintree)\b/i,
  },
  {
    slug: 'brand-ecommerce',
    name: 'Shopify, WooCommerce, Magento & E-Commerce',
    primaryCategory: 'shopping',
    tier: 2,
    regex: /\b(shopify|woocommerce|magento|prestashop|bigcommerce|opencart|squarespace|wix|webflow|etsy|ebay)\b/i,
  },
  {
    slug: 'brand-crypto',
    name: 'Bitcoin, Ethereum, Solana, Binance & Web3',
    primaryCategory: 'business-and-finance',
    tier: 2,
    regex:
      /\b(bitcoin|btc|ethereum|eth|solana|binance|polygon|tether|usdt|cardano|ripple|xrp|dogecoin|polkadot|litecoin|avalanche|chainlink|uniswap|metamask|coinbase)\b/i,
  },
  {
    slug: 'brand-social',
    name: 'YouTube, Discord, Telegram, LinkedIn & Social',
    primaryCategory: 'communication',
    tier: 2,
    regex:
      /\b(youtube|tiktok|discord|telegram|whatsapp|instagram|facebook|twitter|linkedin|reddit|pinterest|snapchat|twitch|threads|mastodon|bluesky)\b/i,
  },
  {
    slug: 'brand-music',
    name: 'Spotify, SoundCloud, Apple Music & Audio',
    primaryCategory: 'music-and-audio',
    tier: 2,
    regex: /\b(spotify|soundcloud|shazam|deezer|tidal|pandora|audible|lastfm|bandcamp|audacity)\b/i,
  },
  {
    slug: 'brand-gaming',
    name: 'Steam, Xbox, Nintendo, PlayStation & Gaming',
    primaryCategory: 'games-and-toys',
    tier: 2,
    regex:
      /\b(steam|playstation|xbox|nintendo|epic-games|riot|blizzard|ubisoft|activision|itch-io|roblox|minecraft|valorant|origin|gog)\b/i,
  },
  {
    slug: 'brand-hardware',
    name: 'NVIDIA, Intel, AMD, Samsung & Hardware',
    primaryCategory: 'tech-and-devices',
    tier: 2,
    regex:
      /\b(nvidia|intel|amd|arm|qualcomm|samsung|lg|dell|hp|lenovo|asus|acer|msi|raspberry-pi|arduino|logitech|razer|corsair)\b/i,
  },
  {
    slug: 'brand-productivity',
    name: 'Notion, Slack, Linear, Zoom & Workspace',
    primaryCategory: 'work-and-education',
    tier: 2,
    regex:
      /\b(notion|slack|linear|asana|trello|monday|clickup|airtable|obsidian|evernote|zoom|miro|loom|calendly|intercom|zendesk|hubspot)\b/i,
  },
  {
    slug: 'brand-browsers',
    name: 'Chrome, Firefox, Safari, Arc, Brave & Opera',
    primaryCategory: 'interface',
    tier: 2,
    regex: /\b(chrome|firefox|safari|edge|opera|brave|vivaldi|arc|tor-browser|chromium|duckduckgo)\b/i,
  },
  {
    slug: 'brand-automotive',
    name: 'Tesla, BMW, Mercedes, Porsche & Automotive',
    primaryCategory: 'transport',
    tier: 2,
    regex:
      /\b(tesla|bmw|mercedes|audi|porsche|ferrari|lamborghini|toyota|honda|ford|chevrolet|volkswagen|volvo|hyundai|kia|nissan|mazda|subaru|jaguar|bentley|bugatti|rolls-royce|maserati|aston-martin|mclaren|lexus|jeep|peugeot|renault|fiat)\b/i,
  },
];

const STRICT_BRAND_COLLECTIONS = new Set([
  'brands-popular',
  'brand-icons',
  'popular-company-logo-icons',
  'tech-brand-logos',
  'colored-svg-logos',
  'lawnicons-line-brand-icons',
  'colored-brand-icons',
  'cryptocurrency-vector-logos',
  'cryptocurrency-colored-icon-logos',
  'car-labels-flat-logos',
  'browser-logo-vectors',
  'social-media-brand-icons',
  'google-app-logos',
]);

function isBrandPoolIcon(ic) {
  return (
    ic.site === 'thesvg' ||
    ic.iconType === 'brand-logo' ||
    STRICT_BRAND_COLLECTIONS.has(ic.collectionSlug)
  );
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
    if (r2Public && !/\.r2\.cloudflarestorage\.com/i.test(r2Public)) {
      return `${r2Public}/${encodeURIComponent(siteId)}/${encodeURIComponent(colSlug)}/${relativePath}`;
    }
    const rawFile = path.basename(String(relativePath || ''));
    // Strip duplicated slug-id pattern (e.g. "zoom-badge-zoom-badge.svg" -> "zoom-badge.svg")
    const cleanFile = rawFile.replace(/^([a-zA-Z0-9-_]+?)-\1(\.[a-zA-Z0-9-_]+)?\.svg$/, '$1$2.svg');
    return `/svg/${encodeURIComponent(colSlug)}/${encodeURIComponent(cleanFile)}`;
  }

  resolveCollectionSite(collectionSlug) {
    if (!this._collectionSiteCache) {
      this._collectionSiteCache = new Map();
    }
    if (this._collectionSiteCache.has(collectionSlug)) {
      return this._collectionSiteCache.get(collectionSlug);
    }

    if (String(collectionSlug).startsWith('lordicon-')) {
      this._collectionSiteCache.set(collectionSlug, 'lordicon');
      return 'lordicon';
    }

    // 1. Fast O(1) lookup if catalog snapshot is already in memory
    if (this._catalogSnapshot && this._catalogSnapshot.colSiteMap) {
      const site = this._catalogSnapshot.colSiteMap.get(collectionSlug) || null;
      if (site) {
        this._collectionSiteCache.set(collectionSlug, site);
        return site;
      }
    }

    // 2. Fast local directory check (4 stat/exists checks instead of loading 242k icons)
    const safeSlug = String(collectionSlug).replace(/[^a-zA-Z0-9-_]/g, '_');
    for (const siteId of ['lordicon', 'allsvgicons', 'thesvg', 'svgrepo']) {
      if (runtimeFs['existsSync'](path.join(OUTPUT_DIR, siteId, safeSlug))) {
        this._collectionSiteCache.set(collectionSlug, siteId);
        return siteId;
      }
    }

    // 3. Fallback to compact index if loaded
    const { collections } = this.loadAllEnrichedIcons();
    const found = collections.find((c) => c.slug === collectionSlug);
    const resolved = found ? found.site : null;
    if (resolved) {
      this._collectionSiteCache.set(collectionSlug, resolved);
    }
    return resolved;
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
        allsvgicons: {
          currentCategory: 'all',
          currentListPage: 1,
          completedCollections: [],
          collectionProgress: {},
          totalCollectionsCrawled: 0,
          totalIconsDownloaded: 0,
          lastUpdatedAt: null,
        },
        lordicon: {
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

    const rawCat = iconData.rawCategory || meta.collection?.category || '';
    const classification = classifyIcon({
      siteId,
      collectionSlug,
      collectionName: meta.collection?.name || collectionSlug,
      rawCategory: rawCat,
      title: iconData.title || iconData.slug || '',
      slug: iconData.slug || '',
      detectedStyle: dimensions.detectedStyle,
      hasAnimation: dimensions.hasAnimation,
    });

    const lordiconMeta =
      siteId === 'lordicon' ? resolveLordiconCategory(rawCat, iconData.slug, iconData.title) : null;

    const isAnimated =
      dimensions.hasAnimation ||
      classification.category === 'animation' ||
      classification.iconType === 'animated' ||
      siteId === 'allsvgicons' ||
      siteId === 'lordicon';

    const iconTags = Array.from(
      new Set([
        ...(isAnimated ? ['animation', 'animated'] : []),
        ...(siteId === 'lordicon' ? ['lordicon', 'lottie'] : []),
        ...(lordiconMeta ? [lordiconMeta.lordiconCategory] : []),
        ...(iconData.tags || []),
        ...extractTagsFromText(iconData.slug, iconData.title, rawCat, collectionSlug),
      ])
    );

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
      category: siteId === 'lordicon' ? classification.category : iconData.category || classification.category,
      rawCategory: rawCat,
      ...(lordiconMeta ? { lordiconCategory: lordiconMeta.lordiconCategory } : {}),
      styleType: iconData.styleType || classification.styleType,
      iconType: iconData.iconType || classification.iconType,
      license: cleanLicenseName(iconData.license || meta.collection?.license || 'MIT / CC0'),
      author: cleanAuthorName(iconData.author || meta.collection?.author || 'Open Source'),
      tags: iconTags.filter((t) => !/^(lordicon|thesvg|svgrepo|allsvgicons)$/i.test(t)),
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
    const colSlug = collection?.slug || '';
    const colName = collection?.name || colSlug;
    const rawCat = icon.rawCategory || collection?.category || '';

    const classification = classifyIcon({
      siteId,
      collectionSlug: colSlug,
      collectionName: colName,
      rawCategory: rawCat,
      title: icon.title || icon.slug || '',
      slug: icon.slug || '',
      detectedStyle: icon.styleType || 'filled',
      hasAnimation:
        siteId === 'allsvgicons' ||
        siteId === 'lordicon' ||
        icon.category === 'animation' ||
        icon.iconType === 'animated',
    });

    const category = classification.category;
    const styleType = icon.styleType || classification.styleType;
    const iconType = siteId === 'lordicon' ? 'animated' : icon.iconType || classification.iconType;

    const lordiconMeta =
      siteId === 'lordicon' ? resolveLordiconCategory(rawCat, icon.slug, icon.title) : null;

    const baseTags = Array.isArray(icon.tags)
      ? icon.tags.filter((t) => !/^(lordicon|thesvg|svgrepo|allsvgicons)$/i.test(t))
      : [];
    const tags =
      iconType === 'animated' ||
      siteId === 'allsvgicons' ||
      siteId === 'lordicon'
        ? Array.from(
            new Set([
              'animation',
              'animated',
              ...(siteId === 'lordicon' ? ['motion', 'lottie'] : []),
              ...(lordiconMeta ? [lordiconMeta.lordiconCategory] : []),
              ...baseTags,
            ])
          )
        : baseTags;

    return {
      id: icon.id,
      title: icon.title,
      slug: icon.slug,
      fileName: icon.fileName,
      relativePath: icon.relativePath,
      variants: icon.variants || { default: icon.relativePath },
      gridSize: icon.gridSize,
      category: normalizeCategoryId(category),
      rawCategory: rawCat,
      lordiconCategory: lordiconMeta ? lordiconMeta.lordiconCategory : icon.lordiconCategory || '',
      styleType,
      iconType,
      author: cleanAuthorName(icon.author || collection?.author),
      license: cleanLicenseName(icon.license || collection?.license),
      tags,
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

    const resolvedSlug = meta.collection?.slug || cSlug;
    const colInfo = {
      site: sId,
      ...meta.collection,
      slug: resolvedSlug,
      name: cleanCollectionDisplayName(meta.collection?.name || cSlug, resolvedSlug),
      author: cleanAuthorName(meta.collection?.author),
      license: cleanLicenseName(meta.collection?.license),
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

    const resolvedSlug = meta.collection?.slug || cSlug;
    const colInfo = {
      site: sId,
      ...meta.collection,
      slug: resolvedSlug,
      name: cleanCollectionDisplayName(meta.collection?.name || cSlug, resolvedSlug),
      author: cleanAuthorName(meta.collection?.author),
      license: cleanLicenseName(meta.collection?.license),
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
   * Hydrate catalog from compressed data/catalog-index.json.gz (used both on Vercel and locally for instant ~120ms cold start)
   */
  _loadFromCompactIndex() {
    if (!fs.existsSync(CATALOG_INDEX_GZ_FILE)) {
      return { allIcons: [], collections: [] };
    }

    const stat = fs.statSync(CATALOG_INDEX_GZ_FILE);
    const r2Key = process.env.R2_PUBLIC_URL || '';
    const signature = `gz:${stat.mtimeMs}:${stat.size}:${r2Key}`;
    if (this._catalogSnapshot && this._catalogSnapshot.signature === signature) {
      this._catalogSnapshot.lastCheckedAt = Date.now();
      return {
        allIcons: this._catalogSnapshot.allIcons,
        collections: this._catalogSnapshot.collections,
      };
    }

    const rawGz = fs.readFileSync(CATALOG_INDEX_GZ_FILE);
    const parsed = JSON.parse(zlib.gunzipSync(rawGz).toString('utf8'));

    const colMap = new Map();
    const colSiteMap = new Map();
    const collections = (parsed.collections || []).map((row) => {
      const [site, slug, name, author, license, count] = row;
      const colObj = {
        site,
        slug,
        name: cleanCollectionDisplayName(name || slug, slug),
        author: cleanAuthorName(author),
        license: cleanLicenseName(license),
        downloadedIconsCount: count || 0,
        totalIcons: count || 0,
      };
      colMap.set(`${site}:${slug}`, colObj);
      if (!colSiteMap.has(slug)) {
        colSiteMap.set(slug, site);
      }
      return colObj;
    });

    const allIcons = (parsed.icons || []).map((row, idx) => {
      const [siteCode, colSlug, id, slug, title, category, styleType, iconType, gridSize, varKeys, rawCatFromIdx] = row;
      const siteId =
        siteCode === 3
          ? 'lordicon'
          : siteCode === 2
            ? 'allsvgicons'
            : siteCode === 1
              ? 'thesvg'
              : 'svgrepo';
      const colObj = colMap.get(`${siteId}:${colSlug}`);
      const safeIconSlug = String(slug || 'icon').replace(/[^a-zA-Z0-9-_]/g, '-');
      const fileName = id ? `${safeIconSlug}-${id}.svg` : `${safeIconSlug}.svg`;
      const relativePath = `icons/${fileName}`;

      const variants = { default: relativePath };
      if (Array.isArray(varKeys)) {
        for (const vk of varKeys) {
          if (vk === 'default') continue;
          const vFile = id ? `${safeIconSlug}-${id}.${vk}.svg` : `${safeIconSlug}.${vk}.svg`;
          variants[vk] = `icons/${vFile}`;
        }
      }

      const rawCategory = rawCatFromIdx || '';
      const lordiconMeta =
        siteId === 'lordicon' ? resolveLordiconCategory(rawCategory, slug, title) : null;

      const resolvedCategory = normalizeCategoryId(
        lordiconMeta
          ? lordiconMeta.appCategory
          : category || (siteId === 'allsvgicons' ? 'popular' : 'interface')
      );
      const resolvedIconType =
        iconType || (siteId === 'allsvgicons' || siteId === 'lordicon' ? 'animated' : 'ui-icon');
      const isAnim =
        resolvedIconType === 'animated' ||
        siteId === 'allsvgicons' ||
        siteId === 'lordicon';

      return {
        id: String(id || slug),
        title: title || slug,
        slug,
        fileName,
        relativePath,
        variants,
        gridSize: gridSize || '24x24',
        category: resolvedCategory,
        rawCategory,
        lordiconCategory: lordiconMeta ? lordiconMeta.lordiconCategory : isAnim ? resolvedCategory : '',
        styleType: styleType || 'filled',
        iconType: resolvedIconType,
        author: colObj?.author || 'Open Source',
        license: colObj?.license || 'MIT / CC0',
        tags: isAnim
          ? [
              'animation',
              'animated',
              ...(siteId === 'lordicon' ? ['motion', 'lottie'] : []),
              ...(lordiconMeta ? [lordiconMeta.lordiconCategory] : []),
              ...(rawCategory ? [rawCategory] : []),
            ]
          : [],
        _ts: 1700000000000 - idx,
        site: siteId,
        collectionSlug: colSlug,
        collectionName: colObj?.name || cleanCollectionDisplayName(colSlug, colSlug),
        assetUrl: this.buildAssetUrl(siteId, colSlug, relativePath),
      };
    });

    this._catalogSnapshot = {
      signature,
      lastCheckedAt: Date.now(),
      allIcons,
      collections,
      colSiteMap,
      summary: null,
    };

    return { allIcons, collections };
  }

  /**
   * Load all icons across all collections with full taxonomy enrichment.
   * Uses compressed catalog-index.json.gz whenever up-to-date (~120ms cold start instead of ~10s disk scan)
   * and only merges newer collections from output/ if any were crawled after the index was built.
   */
  loadAllEnrichedIcons({ forceDiskScan = false } = {}) {
    const now = Date.now();
    if (!forceDiskScan && this._catalogSnapshot && now - (this._catalogSnapshot.lastCheckedAt || 0) < 5000) {
      return {
        allIcons: this._catalogSnapshot.allIcons,
        collections: this._catalogSnapshot.collections,
      };
    }

    // Fast path: Use pre-built compressed index if present and up-to-date with crawl-state.json
    if (!forceDiskScan && fs.existsSync(CATALOG_INDEX_GZ_FILE)) {
      const gzStat = fs.statSync(CATALOG_INDEX_GZ_FILE);
      const stateMtime = runtimeFs['existsSync'](STATE_FILE)
        ? runtimeFs['statSync'](STATE_FILE).mtimeMs
        : 0;

      // If catalog-index.json.gz was built at or after the last crawl state update, use it directly!
      if (gzStat.mtimeMs >= stateMtime - 1000) {
        return this._loadFromCompactIndex();
      }
    }

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
      this._catalogSnapshot.lastCheckedAt = now;
      return {
        allIcons: this._catalogSnapshot.allIcons,
        collections: this._catalogSnapshot.collections,
      };
    }

    const allIcons = [];
    const collections = [];
    const colSiteMap = new Map();
    for (const entry of entries) {
      collections.push(entry.colInfo);
      if (entry.colInfo?.slug && !colSiteMap.has(entry.colInfo.slug)) {
        colSiteMap.set(entry.colInfo.slug, entry.colInfo.site);
      }
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
      lastCheckedAt: now,
      allIcons,
      collections,
      colSiteMap,
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
    const lordiconCategoryCounts = {};
    const styleCounts = {};
    const typeCounts = {};
    const siteCounts = {};
    const gridCounts = {};

    for (const ic of allIcons) {
      categoryCounts[ic.category] = (categoryCounts[ic.category] || 0) + 1;
      if (ic.iconType === 'animated' || ic.site === 'allsvgicons' || ic.site === 'lordicon') {
        const animCat = ic.lordiconCategory || ic.category;
        if (animCat) {
          lordiconCategoryCounts[animCat] = (lordiconCategoryCounts[animCat] || 0) + 1;
        }
      }
      styleCounts[ic.styleType] = (styleCounts[ic.styleType] || 0) + 1;
      typeCounts[ic.iconType] = (typeCounts[ic.iconType] || 0) + 1;
      siteCounts[ic.site] = (siteCounts[ic.site] || 0) + 1;
      if (ic.gridSize) {
        gridCounts[ic.gridSize] = (gridCounts[ic.gridSize] || 0) + 1;
      }
    }

    const totalBrands =
      this._catalogSnapshot && this._catalogSnapshot.brandsDirectory
        ? this._catalogSnapshot.brandsDirectory.length
        : BRAND_ECOSYSTEM_DEFINITIONS.length;

    const brandCatCounts = {};
    for (const bDef of BRAND_ECOSYSTEM_DEFINITIONS) {
      if (bDef.primaryCategory) {
        brandCatCounts[bDef.primaryCategory] = (brandCatCounts[bDef.primaryCategory] || 0) + 1;
      }
    }

    const summary = {
      totalIcons: allIcons.length,
      totalCollections: collections.length,
      totalBrands,
      categories: CATEGORY_DEFINITIONS.map((c) => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        count: categoryCounts[c.id] || 0,
        animatedCount: lordiconCategoryCounts[c.id] || 0,
        brandCount: brandCatCounts[c.id] || 0,
      })),
      lordiconCategories: LORDICON_CATEGORIES.map((lc) => ({
        id: lc.id,
        label: lc.label,
        labelVi: lc.labelVi,
        appCategory: lc.appCategory,
        count: lordiconCategoryCounts[lc.id] || 0,
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
        { id: 'svgrepo', label: 'Vector Pack', count: siteCounts.svgrepo || 0 },
        { id: 'thesvg', label: 'Brand Pack', count: siteCounts.thesvg || 0 },
        { id: 'allsvgicons', label: 'Motion Pack', count: siteCounts.allsvgicons || 0 },
        { id: 'lordicon', label: 'Interactive Motion', count: siteCounts.lordicon || 0 },
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
    const safeOffset = Number(offset) || 0;
    const safeLimit = Number(limit) || 120;

    // Fast O(1) slice when no filter is active and sort is default 'recent'
    if (
      !site &&
      !category &&
      !styleType &&
      !iconType &&
      !collection &&
      !gridSize &&
      !letter &&
      !query &&
      sort === 'recent'
    ) {
      return {
        total: allIcons.length,
        offset: safeOffset,
        limit: safeLimit,
        items: allIcons.slice(safeOffset, safeOffset + safeLimit),
      };
    }

    const isLordiconCatPrefix = category.startsWith('lordicon:');
    const normalizedCat = normalizeCategoryId(category);
    const isLordiconVirtualCol = collection.startsWith('lordicon-cat-');
    const virtualLordiconCatId = isLordiconVirtualCol ? collection.replace(/^lordicon-cat-/, '') : '';

    let filtered = allIcons.filter((ic) => {
      if (site && ic.site !== site) return false;
      if (category) {
        if (category === 'animation') {
          const isAnimIcon =
            ic.iconType === 'animated' ||
            ic.site === 'allsvgicons' ||
            ic.site === 'lordicon';
          if (!isAnimIcon) return false;
        } else if (isLordiconCatPrefix) {
          if (
            (ic.site !== 'lordicon' && ic.site !== 'allsvgicons' && ic.iconType !== 'animated') ||
            (ic.lordiconCategory !== normalizedCat && ic.category !== normalizedCat)
          ) {
            return false;
          }
        } else if (
          ic.category !== normalizedCat &&
          ic.lordiconCategory !== normalizedCat &&
          ic.rawCategory !== normalizedCat
        ) {
          return false;
        }
      }
      if (styleType && ic.styleType !== styleType) return false;
      if (iconType && ic.iconType !== iconType) return false;
      if (collection) {
        if (isLordiconVirtualCol) {
          if (ic.site !== 'lordicon' || ic.lordiconCategory !== virtualLordiconCatId) return false;
        } else if (ic.collectionSlug !== collection) {
          return false;
        }
      }
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
          ic.lordiconCategory,
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
    const items = filtered.slice(safeOffset, safeOffset + safeLimit);

    return {
      total,
      offset: safeOffset,
      limit: safeLimit,
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

    const isLordiconVirtualCol = String(collectionSlug).startsWith('lordicon-cat-');
    if (!isLordiconVirtualCol && targetSite && targetSite !== 'any') {
      entry = this._getCachedCollectionEntry(targetSite, collectionSlug);
    }

    const { allIcons, collections } = this.loadAllEnrichedIcons();
    const brandDef = BRAND_ECOSYSTEM_DEFINITIONS.find((b) => b.slug === collectionSlug && b.regex);

    let colInfo = null;
    let allColIcons = [];

    if (isLordiconVirtualCol) {
      targetSite = 'lordicon';
      const lordiconCatId = String(collectionSlug).replace(/^lordicon-cat-/, '');
      const lCatDef = LORDICON_CATEGORIES.find((c) => c.id === lordiconCatId);
      allColIcons = allIcons.filter(
        (ic) => ic.site === 'lordicon' && ic.lordiconCategory === lordiconCatId
      );
      if (allColIcons.length === 0) return null;
      colInfo = {
        site: 'lordicon',
        slug: collectionSlug,
        name: `Animated — ${lCatDef ? lCatDef.label : lordiconCatId}`,
        author: 'Open Source',
        license: 'MIT / CC0',
        downloadedIconsCount: allColIcons.length,
        totalIcons: allColIcons.length,
      };
    } else if (brandDef) {
      targetSite = 'any';
      const primaryFamilyIcons = allIcons.filter((ic) => ic.collectionSlug === brandDef.slug);
      const primaryKeys = new Set(primaryFamilyIcons.map((ic) => `${ic.collectionSlug}:${ic.id || ic.slug}`));
      const extraBrandIcons = allIcons.filter(
        (ic) =>
          !primaryKeys.has(`${ic.collectionSlug}:${ic.id || ic.slug}`) &&
          isBrandPoolIcon(ic) &&
          brandDef.regex.test(`${ic.slug} ${ic.title}`)
      );
      allColIcons = [...primaryFamilyIcons, ...extraBrandIcons];
      colInfo = {
        site: 'any',
        slug: brandDef.slug,
        name: brandDef.name,
        author: 'Open Source',
        license: 'Brand Trademarks / MIT',
        downloadedIconsCount: allColIcons.length,
        totalIcons: allColIcons.length,
      };
    } else {
      const foundCol =
        collections.find(
          (c) => c.slug === collectionSlug && (!targetSite || targetSite === 'any' || c.site === targetSite)
        ) || collections.find((c) => c.slug === collectionSlug);

      if (!entry && foundCol) {
        targetSite = foundCol.site;
        entry = this._getCachedCollectionEntry(targetSite, collectionSlug);
      }

      if (!entry && !foundCol) return null;

      colInfo = entry ? entry.colInfo : foundCol;
      allColIcons = entry
        ? entry.enrichedIcons || []
        : allIcons.filter((ic) => ic.site === targetSite && ic.collectionSlug === collectionSlug);
    }

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
      if (
        category &&
        ic.category !== category &&
        ic.lordiconCategory !== category &&
        ic.rawCategory !== category
      ) {
        return false;
      }
      if (query) {
        const haystack = [
          ic.title,
          ic.slug,
          ic.category,
          ic.lordiconCategory,
          ic.rawCategory,
          ic.styleType,
          ...(ic.tags || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sort === 'az' && !brandDef) {
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
   * Build and cache enriched Collections Directory for SVGRepo-style Category/Collection view mode
   */
  getCollectionsDirectory() {
    const { allIcons, collections } = this.loadAllEnrichedIcons();
    if (this._catalogSnapshot && this._catalogSnapshot.collectionsDirectory) {
      return this._catalogSnapshot.collectionsDirectory;
    }

    const colAggMap = new Map();
    for (const c of collections) {
      const cleanName = cleanCollectionDisplayName(c.name || c.slug, c.slug);
      colAggMap.set(`${c.site}:${c.slug}`, {
        slug: c.slug,
        name: cleanName,
        license: c.license || 'MIT / CC0',
        author: c.author || 'Open Source',
        count: 0,
        categoryCounts: {},
        styleCounts: {},
        typeCounts: {},
        sampleIcons: [],
        keywordSet: new Set([String(cleanName).toLowerCase(), String(c.slug || '').toLowerCase()]),
      });
    }

    for (const ic of allIcons) {
      const key = `${ic.site}:${ic.collectionSlug}`;
      let agg = colAggMap.get(key);
      if (!agg) {
        const cleanName = cleanCollectionDisplayName(ic.collectionName || ic.collectionSlug, ic.collectionSlug);
        agg = {
          slug: ic.collectionSlug,
          name: cleanName,
          license: ic.license || 'MIT / CC0',
          author: ic.author || 'Open Source',
          count: 0,
          categoryCounts: {},
          styleCounts: {},
          typeCounts: {},
          sampleIcons: [],
          keywordSet: new Set([String(cleanName).toLowerCase(), String(ic.collectionSlug || '').toLowerCase()]),
        };
        colAggMap.set(key, agg);
      }

      agg.count += 1;
      if (ic.category) agg.categoryCounts[ic.category] = (agg.categoryCounts[ic.category] || 0) + 1;
      if (ic.styleType) agg.styleCounts[ic.styleType] = (agg.styleCounts[ic.styleType] || 0) + 1;
      if (ic.iconType) agg.typeCounts[ic.iconType] = (agg.typeCounts[ic.iconType] || 0) + 1;

      if (agg.sampleIcons.length < 8) {
        agg.sampleIcons.push({
          id: ic.id,
          slug: ic.slug,
          title: ic.title,
          assetUrl: ic.assetUrl,
          styleType: ic.styleType,
          category: ic.category,
        });
      }
      if (agg.keywordSet.size < 45) {
        if (ic.title) agg.keywordSet.add(String(ic.title).toLowerCase());
        if (ic.category) agg.keywordSet.add(String(ic.category).toLowerCase());
        if (ic.lordiconCategory) agg.keywordSet.add(String(ic.lordiconCategory).toLowerCase());
      }
    }

    const directory = [];
    for (const agg of colAggMap.values()) {
      if (agg.count === 0) continue;

      const sortedCats = Object.entries(agg.categoryCounts).sort((a, b) => b[1] - a[1]);
      const sortedStyles = Object.entries(agg.styleCounts).sort((a, b) => b[1] - a[1]);
      const sortedTypes = Object.entries(agg.typeCounts).sort((a, b) => b[1] - a[1]);

      const primaryCategory = sortedCats[0]?.[0] || 'interface';
      const primaryStyle = sortedStyles[0]?.[0] || 'outlined';
      const primaryIconType = sortedTypes[0]?.[0] || 'ui-icon';

      directory.push({
        slug: agg.slug,
        name: agg.name,
        license: agg.license,
        count: agg.count,
        primaryCategory,
        primaryStyle,
        primaryIconType,
        categories: sortedCats.map(([id, count]) => ({ id, count })),
        styles: sortedStyles.map(([id, count]) => ({ id, count })),
        categoryCounts: agg.categoryCounts,
        styleCounts: agg.styleCounts,
        typeCounts: agg.typeCounts,
        sampleIcons: agg.sampleIcons,
        _searchText: Array.from(agg.keywordSet).join(' '),
      });
    }

    // Default order: rich multi-icon collections first
    directory.sort((a, b) => b.count - a.count);

    if (this._catalogSnapshot) {
      this._catalogSnapshot.collectionsDirectory = directory;
    }

    return directory;
  }

  /**
   * Build and cache Curated Brand Ecosystems Directory for 'brands' view mode
   * Contains strictly real Brands & Tech Ecosystems (no generic UI or illustration collections)
   */
  getBrandsDirectory() {
    const { allIcons } = this.loadAllEnrichedIcons();
    if (this._catalogSnapshot && this._catalogSnapshot.brandsDirectory) {
      return this._catalogSnapshot.brandsDirectory;
    }

    const allCollectionsDir = this.getCollectionsDirectory();
    const brandPool = allIcons.filter(isBrandPoolIcon);
    const brandsList = [];

    for (const bDef of BRAND_ECOSYSTEM_DEFINITIONS) {
      if (bDef.exactCol) {
        const col = allCollectionsDir.find((c) => c.slug === bDef.exactCol);
        if (col) {
          brandsList.push({
            ...col,
            name: bDef.name || col.name,
            primaryCategory: bDef.primaryCategory || col.primaryCategory,
            isBrandGroup: true,
            brandTier: bDef.tier || 1,
          });
        }
        continue;
      }

      const primaryFamilyIcons = allIcons.filter((ic) => ic.collectionSlug === bDef.slug);
      const primaryKeys = new Set(primaryFamilyIcons.map((ic) => `${ic.collectionSlug}:${ic.id || ic.slug}`));
      const extraMatched = brandPool.filter(
        (ic) =>
          !primaryKeys.has(`${ic.collectionSlug}:${ic.id || ic.slug}`) &&
          bDef.regex.test(`${ic.slug} ${ic.title}`)
      );
      const matched = [...primaryFamilyIcons, ...extraMatched];
      if (matched.length === 0) continue;

      const categoryCounts = {};
      const styleCounts = {};
      const typeCounts = {};
      const sampleIcons = [];
      const keywordSet = new Set([bDef.name.toLowerCase(), bDef.slug.toLowerCase()]);

      for (const ic of matched) {
        if (ic.category) categoryCounts[ic.category] = (categoryCounts[ic.category] || 0) + 1;
        if (ic.styleType) styleCounts[ic.styleType] = (styleCounts[ic.styleType] || 0) + 1;
        if (ic.iconType) typeCounts[ic.iconType] = (typeCounts[ic.iconType] || 0) + 1;
        if (sampleIcons.length < 8) {
          sampleIcons.push({
            id: ic.id,
            slug: ic.slug,
            title: ic.title,
            assetUrl: ic.assetUrl,
            styleType: ic.styleType,
            category: ic.category,
          });
        }
        if (keywordSet.size < 45 && ic.title) {
          keywordSet.add(String(ic.title).toLowerCase());
        }
      }

      const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
      const sortedStyles = Object.entries(styleCounts).sort((a, b) => b[1] - a[1]);

      brandsList.push({
        slug: bDef.slug,
        name: bDef.name,
        license: 'Brand Trademarks / MIT',
        count: matched.length,
        primaryCategory: bDef.primaryCategory || sortedCats[0]?.[0] || 'brand',
        primaryStyle: sortedStyles[0]?.[0] || 'multicolor',
        primaryIconType: 'brand-logo',
        categories: sortedCats.map(([id, count]) => ({ id, count })),
        styles: sortedStyles.map(([id, count]) => ({ id, count })),
        categoryCounts,
        styleCounts,
        typeCounts,
        sampleIcons,
        isBrandGroup: true,
        brandTier: bDef.tier || 1,
        _searchText: Array.from(keywordSet).join(' '),
      });
    }

    if (this._catalogSnapshot) {
      this._catalogSnapshot.brandsDirectory = brandsList;
    }

    return brandsList;
  }

  /**
   * Filter, search, sort, and paginate collections or brands
   */
  queryCollections({
    mode = 'collections',
    q = '',
    category = '',
    styleType = '',
    iconType = '',
    letter = '',
    sort = 'popular',
    offset = 0,
    limit = 24,
  } = {}) {
    const isBrandsMode = mode === 'brands';
    const directory = isBrandsMode ? this.getBrandsDirectory() : this.getCollectionsDirectory();
    const query = String(q || '').trim().toLowerCase();

    let effectiveCat = normalizeCategoryId(category);
    if (
      isBrandsMode &&
      effectiveCat &&
      !directory.some((col) => col.primaryCategory === effectiveCat || col.categoryCounts[effectiveCat])
    ) {
      effectiveCat = '';
    }
    const effectiveType = isBrandsMode ? '' : iconType;
    const effectiveStyle = isBrandsMode ? '' : styleType;

    const filtered = directory.filter((col) => {
      if (effectiveCat && col.primaryCategory !== effectiveCat && !col.categoryCounts[effectiveCat]) return false;
      if (effectiveStyle && col.primaryStyle !== effectiveStyle && !col.styleCounts[effectiveStyle]) return false;
      if (effectiveType && !col.typeCounts[effectiveType]) return false;
      if (letter) {
        const firstChar = (col.name || col.slug || '').charAt(0).toUpperCase();
        if (letter === '#') {
          if (/[A-Z]/.test(firstChar)) return false;
        } else if (firstChar !== letter.toUpperCase()) {
          return false;
        }
      }
      if (query && !col._searchText.includes(query)) return false;
      return true;
    });

    if (sort === 'az') {
      filtered.sort((a, b) => (a.name || a.slug).localeCompare(b.name || b.slug));
    } else if (sort === 'za') {
      filtered.sort((a, b) => (b.name || b.slug).localeCompare(a.name || a.slug));
    } else if (effectiveCat) {
      filtered.sort((a, b) => {
        const aPrimary = a.primaryCategory === effectiveCat ? 1 : 0;
        const bPrimary = b.primaryCategory === effectiveCat ? 1 : 0;
        if (aPrimary !== bPrimary) return bPrimary - aPrimary;
        return (b.categoryCounts[effectiveCat] || 0) - (a.categoryCounts[effectiveCat] || 0);
      });
    } else if (isBrandsMode) {
      filtered.sort((a, b) => {
        if ((a.brandTier || 3) !== (b.brandTier || 3)) {
          return (a.brandTier || 3) - (b.brandTier || 3);
        }
        return b.count - a.count;
      });
    } else {
      filtered.sort((a, b) => b.count - a.count);
    }

    const total = filtered.length;
    const safeOffset = Number(offset) || 0;
    const safeLimit = Number(limit) || 24;
    const items = filtered
      .slice(safeOffset, safeOffset + safeLimit)
      .map(({ _searchText, categoryCounts, styleCounts, typeCounts, ...publicCol }) => publicCol);

    return {
      total,
      offset: safeOffset,
      limit: safeLimit,
      items,
    };
  }

  /**
   * Get single icon details + raw SVG XML + React/JSX code + Recommendations (similar, sameStyle, sameCollection)
   */
  getIconWithRecommendations(siteId, collectionSlug, iconIdOrSlug) {
    const { allIcons } = this.loadAllEnrichedIcons();
    const target =
      allIcons.find(
        (ic) =>
          (!siteId || siteId === 'any' || ic.site === siteId) &&
          ic.collectionSlug === collectionSlug &&
          (String(ic.id) === String(iconIdOrSlug) || ic.slug === iconIdOrSlug)
      ) ||
      allIcons.find(
        (ic) =>
          ic.collectionSlug === collectionSlug &&
          (String(ic.id) === String(iconIdOrSlug) || ic.slug === iconIdOrSlug)
      );

    if (!target) return null;

    const resolvedSite = target.site;
    const colMeta = this.loadCollectionMetadata(resolvedSite, collectionSlug);
    const fullDiskIcon = (colMeta?.icons || []).find(
      (ic) => String(ic.id) === String(iconIdOrSlug) || ic.slug === iconIdOrSlug
    );
    const mergedTarget = fullDiskIcon ? { ...fullDiskIcon, ...target } : { ...target };

    const colDir = this.getCollectionDir(resolvedSite, collectionSlug);
    const svgVariantsContent = {};
    const variantAssetUrls = {};

    for (const [varName, relPath] of Object.entries(mergedTarget.variants || { default: mergedTarget.relativePath })) {
      const fullPath = path.join(colDir, relPath);
      variantAssetUrls[varName] = this.buildAssetUrl(resolvedSite, collectionSlug, relPath);
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

    let lordiconStyles = null;
    if (resolvedSite === 'lordicon' || /^lordicon-/i.test(collectionSlug)) {
      const styleDefs = [
        { colSlug: 'lordicon-system-outline', family: 'system', style: 'outline', label: 'System Outline' },
        { colSlug: 'lordicon-system-solid', family: 'system', style: 'solid', label: 'System Solid' },
        { colSlug: 'lordicon-doodle-color', family: 'doodle', style: 'color', label: 'Doodle Color' },
        { colSlug: 'lordicon-doodle-motif', family: 'doodle', style: 'motif', label: 'Doodle Motif' },
        { colSlug: 'lordicon-doodle-outline', family: 'doodle', style: 'outline', label: 'Doodle Outline' },
        { colSlug: 'lordicon-doodle-black', family: 'doodle', style: 'black', label: 'Doodle Black' },
        { colSlug: 'lordicon-wired-outline', family: 'wired', style: 'outline', label: 'Wired Outline' },
        { colSlug: 'lordicon-wired-flat', family: 'wired', style: 'flat', label: 'Wired Flat' },
        { colSlug: 'lordicon-wired-lineal', family: 'wired', style: 'lineal', label: 'Wired Lineal' },
        { colSlug: 'lordicon-wired-gradient', family: 'wired', style: 'gradient', label: 'Wired Gradient' },
      ];
      const iconSlug = mergedTarget.slug;
      lordiconStyles = styleDefs.map((sd) => {
        const crawledSibling = allIcons.find(
          (ic) => ic.collectionSlug === sd.colSlug && ic.slug === iconSlug
        );
        return {
          ...sd,
          iconSlug,
          isCurrent: sd.colSlug === collectionSlug,
          isCrawled: Boolean(crawledSibling),
          assetUrl: crawledSibling
            ? crawledSibling.assetUrl
            : `https://media.lordicon.com/icons/${sd.family}/${sd.style}/${iconSlug}.svg`,
          cdnSvgUrl: `https://media.lordicon.com/icons/${sd.family}/${sd.style}/${iconSlug}.svg`,
          cdnLiUrl: `https://media.lordicon.com/icons/${sd.family}/${sd.style}/${iconSlug}.li`,
        };
      });
    }

    return {
      icon: mergedTarget,
      rawSvg,
      svgVariantsContent,
      variantAssetUrls,
      lordiconStyles,
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
