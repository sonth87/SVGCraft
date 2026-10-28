/**
 * Taxonomy, Classification & Similarity Engine for SVG Icons
 * Classifies SVGs by:
 * - category (Chủ đề: AI, Cloud, DevTools, Interface, Security, Finance, Social, Design, Hardware, Productivity, Brand...)
 * - styleType (Phong cách: Outlined, Filled, Duotone, Multicolor, Monocolor)
 * - iconType (Loại icon: Brand Logo, UI Icon, Architecture, Badge)
 * - gridSize & colorPalette (Kích thước lưới & Bảng màu trích xuất từ XML)
 */

const CATEGORY_DEFINITIONS = [
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    icon: 'sparkles',
    keywords: [
      'ai', 'openai', 'anthropic', 'claude', 'gemini', 'gpt', 'chatgpt', 'llm',
      'machine-learning', 'deep-learning', 'neural', 'neural-network', 'chatbot',
      'copilot', 'perplexity', 'huggingface', 'mistral', 'xai', 'grok', 'deepmind',
      'midjourney', 'ollama', 'langchain', 'sagemaker', 'codewhisperer', 'codeguru',
      'rekognition', 'textract', 'comprehend', 'bedrock', 'vertex-ai', 'artificial-intelligence'
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & Infrastructure',
    icon: 'cloud',
    keywords: [
      'aws', 'amazon-web-services', 'azure', 'gcp', 'google-cloud', 'kubernetes', 'k8s',
      'docker', 'cloud', 'cloudflare', 'vercel', 'netlify', 'heroku', 'server', 'serverless',
      'hosting', 'terraform', 'digitalocean', 'linode', 'supabase', 'firebase', 'openstack',
      'nginx', 'apache', 'caddy', 'traefik', 'load-balancer', 'cdn', 'vpc', 'ec2', 's3'
    ],
  },
  {
    id: 'devtools',
    label: 'Developer Tools & Code',
    icon: 'code',
    keywords: [
      'devtool', 'devtools', 'developer', 'github', 'gitlab', 'git', 'vscode', 'visual-studio',
      'jetbrains', 'npm', 'pnpm', 'yarn', 'nodejs', 'react', 'vue', 'angular', 'svelte',
      'nextjs', 'nuxt', 'astro', 'python', 'rust', 'golang', 'java', 'kotlin', 'swift',
      'typescript', 'javascript', 'terminal', 'console', 'cli', 'code', 'coding', 'api',
      'sdk', 'graphql', 'database', 'sql', 'postgres', 'postgresql', 'mongodb', 'redis',
      'mysql', 'sqlite', 'prisma', 'linux', 'ubuntu', 'debian', 'arch', 'vim', 'neovim',
      'webpack', 'vite', 'babel', 'eslint', 'prettier', 'postman', 'insomnia', 'raycast'
    ],
  },
  {
    id: 'interface',
    label: 'UI & Interface Controls',
    icon: 'sliders',
    keywords: [
      'interface', 'ui', 'arrow', 'arrows', 'angle', 'align', 'menu', 'hamburger', 'home',
      'search', 'user', 'profile', 'avatar', 'settings', 'gear', 'cog', 'sliders', 'check',
      'checkmark', 'close', 'cancel', 'plus', 'minus', 'chevron', 'caret', 'cursor', 'pointer',
      'button', 'toggle', 'switch', 'layout', 'grid', 'filter', 'funnel', 'sort', 'edit',
      'trash', 'delete', 'remove', 'download', 'upload', 'export', 'import', 'link', 'unlink',
      'external', 'eye', 'visibility', 'bell', 'notification', 'accessibility', 'loader',
      'spinner', 'refresh', 'sync', 'zoom', 'maximize', 'minimize', 'fullscreen', 'sidebar'
    ],
  },
  {
    id: 'design',
    label: 'Design & Creative',
    icon: 'pen-tool',
    keywords: [
      'design', 'figma', 'adobe', 'photoshop', 'illustrator', 'indesign', 'after-effects',
      'premiere', 'sketch', 'canva', 'framer', 'webflow', 'blender', 'dribbble', 'behance',
      'color', 'palette', 'swatch', 'gradient', 'brush', 'paintbrush', 'pen-tool', 'pencil',
      'vector', 'bezier', 'crop', 'canvas', 'artboard', 'aperture', 'camera', 'photography'
    ],
  },
  {
    id: 'security',
    label: 'Security, Auth & Privacy',
    icon: 'shield',
    keywords: [
      'security', 'cybersecurity', 'cyber-security', 'auth', 'authentication', 'authorization',
      'lock', 'padlock', 'unlock', 'shield', 'privacy', 'vpn', 'firewall', 'antivirus',
      'malware', 'spyware', 'phishing', 'encryption', 'password', 'passcode', 'pin-code',
      'oauth', 'passkey', '2fa', 'mfa', 'otp', 'fingerprint', 'biometric', 'face-id',
      '1password', 'bitwarden', 'lastpass', 'okta', 'auth0', 'keyhole', 'vault'
    ],
  },
  {
    id: 'finance',
    label: 'Finance, Payment & Shopping',
    icon: 'wallet',
    keywords: [
      'finance', 'financial', 'payment', 'stripe', 'paypal', 'visa', 'mastercard', 'amex',
      'apple-pay', 'google-pay', 'alipay', 'klarna', 'wise', 'revolut', 'bank', 'banking',
      'wallet', 'crypto', 'cryptocurrency', 'blockchain', 'bitcoin', 'btc', 'ethereum', 'eth',
      'solana', 'binance', 'coinbase', 'metamask', 'coin', 'dollar', 'euro', 'yen', 'pound',
      'currency', 'money', 'cash', 'credit-card', 'debit-card', 'invoice', 'receipt', 'tax',
      'cart', 'shopping-cart', 'shopping-bag', 'basket', 'shop', 'shopping', 'ecommerce',
      'e-commerce', 'store', 'storefront', 'shopify', 'woocommerce', 'magento', 'price-tag',
      'discount', 'coupon', 'barcode', 'qrcode'
    ],
  },
  {
    id: 'social',
    label: 'Social & Communication',
    icon: 'message-square',
    keywords: [
      'social', 'discord', 'slack', 'telegram', 'whatsapp', 'signal', 'wechat', 'line-app',
      'twitter', 'x-twitter', 'bluesky', 'mastodon', 'threads', 'facebook', 'messenger',
      'instagram', 'youtube', 'tiktok', 'linkedin', 'reddit', 'pinterest', 'snapchat',
      'chat', 'message', 'messages', 'messaging', 'comment', 'forum', 'mail', 'email',
      'webmail', 'inbox', 'envelope', 'send', 'voip', 'video-call', 'podcast', 'broadcast'
    ],
  },
  {
    id: 'productivity',
    label: 'Productivity & Workspace',
    icon: 'layers',
    keywords: [
      'productivity', 'workspace', 'notion', 'obsidian', 'linear', 'jira', 'confluence',
      'atlassian', 'trello', 'asana', 'monday', 'clickup', 'airtable', 'miro', 'calendly',
      'calendar', 'schedule', 'clock', 'timer', 'stopwatch', 'alarm', 'document', 'docs',
      'file', 'files', 'folder', 'directory', 'archive', 'binder', 'notebook', 'notes',
      'todo', 'checklist', 'task', 'kanban', 'clipboard', 'chart', 'bar-chart', 'pie-chart',
      'line-chart', 'analytics', 'dashboard', 'presentation', 'spreadsheet', 'table'
    ],
  },
  {
    id: 'hardware',
    label: 'Hardware, OS & Devices',
    icon: 'cpu',
    keywords: [
      'hardware', 'device', 'devices', 'apple', 'mac', 'macos', 'ios', 'iphone', 'ipad',
      'airpods', 'android', 'windows', 'mobile', 'smartphone', 'tablet', 'laptop', 'macbook',
      'desktop', 'imac', 'monitor', 'display', 'screen', 'tv', 'television', 'cpu', 'processor',
      'microchip', 'chip', 'gpu', 'motherboard', 'ram', 'memory-card', 'sd-card', 'ssd',
      'hard-drive', 'hdd', 'usb', 'flash-drive', 'nvidia', 'intel', 'amd', 'qualcomm', 'arm',
      'raspberry-pi', 'arduino', 'sony', 'samsung', 'dell', 'lenovo', 'asus', 'logitech',
      'bluetooth', 'wifi', 'router', 'modem', 'battery', 'charger', 'keyboard', 'mouse',
      'gamepad', 'joystick', 'controller', 'headphone', 'headphones', 'earbuds', 'speaker',
      'microphone', 'webcam', 'printer', 'scanner', 'iot', 'sensor', 'drone', 'watch', 'smartwatch'
    ],
  },
  {
    id: 'brand',
    label: 'Brand & Company Logos',
    icon: 'hexagon',
    keywords: [
      'brand', 'brands', 'logo', 'logos', 'company', 'corporation', 'official',
      'entertainment', 'disney', 'marvel', 'pixar', 'hulu', 'espn', 'netflix', 'spotify',
      'twitch', 'steam', 'ubisoft', 'epic-games', 'playstation', 'xbox', 'nintendo',
      'warner', 'hbo', 'paramount', 'universal', 'plex', 'imdb', 'rottentomatoes'
    ],
  },
  {
    id: 'animation',
    label: 'Animated & Motion Icons',
    icon: 'play-circle',
    keywords: [
      'animation', 'animated', 'motion', 'meteocons', 'line-md', 'svg-spinners',
      'spinners', 'spinner', 'loader', 'loading', 'loop', 'pulse', 'bounce',
      'rotate', 'shuffle', 'wave', 'bars-scale', 'dots-scale', 'dots-rotate', 'ring-with-bg'
    ],
  },
];

// Explicit mapping for rawCategory values from theSVG.org, SVGRepo, and AllSVGIcons
const RAW_CATEGORY_MAP = {
  animation: 'animation',
  animated: 'animation',
  motion: 'animation',
  'animated icons': 'animation',
  spinners: 'animation',
  loaders: 'animation',
  weather: 'animation',
  meteocons: 'animation',
  'line-md': 'animation',
  'svg-spinners': 'animation',

  ai: 'ai',
  'ai software': 'ai',
  'google ai': 'ai',
  'machine learning': 'ai',
  'artificial intelligence': 'ai',

  cloud: 'cloud',
  'software cloud': 'cloud',
  compute: 'cloud',
  storage: 'cloud',
  containers: 'cloud',
  serverless: 'cloud',
  'hosting platform': 'cloud',
  hosting: 'cloud',
  networking: 'cloud',
  migration: 'cloud',

  devtool: 'devtools',
  'developer tools': 'devtools',
  'devtool community': 'devtools',
  'devtool software': 'devtools',
  'editor devtool': 'devtools',
  'language devtool': 'devtools',
  'software devtool': 'devtools',
  framework: 'devtools',
  'framework software': 'devtools',
  'framework library': 'devtools',
  'library software': 'devtools',
  'software library': 'devtools',
  language: 'devtools',
  'language software': 'devtools',
  database: 'devtools',
  'database software': 'devtools',
  devops: 'devtools',
  'software linux': 'devtools',
  'cms software': 'devtools',
  integration: 'devtools',

  security: 'security',
  identity: 'security',
  'iot security': 'security',
  cybersecurity: 'security',
  privacy: 'security',

  finance: 'finance',
  'crypto finance': 'finance',
  'finance software': 'finance',
  'payment finance': 'finance',
  blockchain: 'finance',
  'shopping platform': 'finance',
  shopping: 'finance',
  'e-commerce': 'finance',
  ecommerce: 'finance',

  design: 'design',
  'design software': 'design',

  social: 'social',
  'social platform': 'social',
  email: 'social',
  'web email': 'social',
  communication: 'social',

  analytics: 'productivity',
  management: 'productivity',
  business: 'productivity',
  education: 'productivity',
  productivity: 'productivity',
  services: 'productivity',

  hardware: 'hardware',
  'hardware software': 'hardware',
  iot: 'hardware',
  'automotive platform': 'hardware',
  'aviation platform': 'hardware',

  brand: 'brand',
  entertainment: 'brand',
  'entertainment platform': 'brand',
  media: 'brand',
  'media entertainment': 'brand',
  gaming: 'brand',
  'gaming entertainment': 'brand',
  food: 'brand',
  'food platform': 'brand',
};

// Pre-compile word-boundary regexes per category for fast classification across 224k+ icons
const COMPILED_CATEGORY_MATCHERS = CATEGORY_DEFINITIONS.map((catDef) => ({
  id: catDef.id,
  regexes: catDef.keywords.map((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/-/g, '[\\s\\-_]+');
    return new RegExp(`\\b${escaped}\\b`, 'i');
  }),
}));

const NON_AI_CONTEXT_RE =
  /\b(astrology|zodiac|horoscope|constellation|astronomy|mars-rover|moon-rover|disney|marvel|entertainment|circus|carnival|food|cooking|kitchen|fashion|clothing|medical|hospital|animal|pet|nature|flower|plant|sport|football|basketball)\b/i;

const STYLE_TYPES = [
  { id: 'outlined', label: 'Outlined (Nét viền)' },
  { id: 'filled', label: 'Filled (Đặc / Glyph)' },
  { id: 'duotone', label: 'Duotone (Hai tông màu)' },
  { id: 'multicolor', label: 'Multicolor (Đa sắc / Brand)' },
  { id: 'monocolor', label: 'Monocolor (Đơn sắc)' },
];

const ICON_TYPES = [
  { id: 'ui-icon', label: 'UI / System Icon' },
  { id: 'animated', label: 'Animated / Motion SVG' },
  { id: 'brand-logo', label: 'Brand / Tech Logo' },
  { id: 'architecture', label: 'Cloud Architecture' },
  { id: 'badge', label: 'Badge / Auth Button' },
];

const ANIMATED_COLLECTIONS = new Set(['meteocons', 'line-md', 'svg-spinners']);

/**
 * Parse raw SVG XML content to extract dimensions, colors, animation status, and structural style
 */
function parseSvgMetadata(svgContent = '') {
  const svgTagMatch = svgContent.match(/<svg\b[^>]*>/i);
  const svgTag = svgTagMatch ? svgTagMatch[0] : '';

  const widthMatch = svgTag.match(/\bwidth=["']([^"']+)["']/i);
  const heightMatch = svgTag.match(/\bheight=["']([^"']+)["']/i);
  const viewBoxMatch = svgTag.match(/\bviewBox=["']([^"']+)["']/i);

  const width = widthMatch ? widthMatch[1] : null;
  const height = heightMatch ? heightMatch[1] : null;
  const viewBox = viewBoxMatch ? viewBoxMatch[1].trim() : null;

  let gridSize = null;
  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(Number);
    if (parts.length === 4 && !Number.isNaN(parts[2]) && !Number.isNaN(parts[3])) {
      gridSize = `${Math.round(parts[2])}x${Math.round(parts[3])}`;
    }
  } else if (width && height) {
    gridSize = `${width.replace('px', '')}x${height.replace('px', '')}`;
  }

  // Extract distinct hex/rgb colors used in the SVG
  const hexMatches = svgContent.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const normalizedColors = Array.from(
    new Set(
      hexMatches
        .map((c) => c.toLowerCase())
        .filter((c) => c !== '#fff' && c !== '#ffffff')
    )
  ).slice(0, 8);

  const hasGradient = /<(linearGradient|radialGradient)\b/i.test(svgContent);
  const hasStroke = /\bstroke=["'](?!none)[^"']+["']/i.test(svgContent) || /\bstroke-width=/i.test(svgContent);
  const hasRootFillNone = /\bfill=["']none["']/i.test(svgTag);
  const hasOpacityLayer = /\b(fill-opacity|opacity)=["']0\.[1-8]/i.test(svgContent);
  const hasAnimation = /<(animate|animateTransform|animateMotion|set)\b|@keyframes\b/i.test(svgContent);

  let detectedStyle = 'monocolor';
  if (hasGradient || normalizedColors.length >= 2) {
    detectedStyle = 'multicolor';
  } else if (hasOpacityLayer) {
    detectedStyle = 'duotone';
  } else if (hasStroke && hasRootFillNone) {
    detectedStyle = 'outlined';
  } else {
    detectedStyle = 'filled';
  }

  const defaultW = gridSize ? gridSize.split('x')[0] : '24';
  const defaultH = gridSize ? gridSize.split('x')[1] : '24';
  const normalizedWidth = width && !/(em|rem|%)$/i.test(width) ? width : defaultW;
  const normalizedHeight = height && !/(em|rem|%)$/i.test(height) ? height : defaultH;

  return {
    width: normalizedWidth,
    height: normalizedHeight,
    viewBox: viewBox || null,
    gridSize: gridSize || '24x24',
    fileSizeBytes: Buffer.byteLength(svgContent, 'utf8'),
    colorPalette: normalizedColors,
    detectedStyle,
    hasAnimation,
  };
}

/**
 * Generate clean, deduplicated tags from slug, title, and collection context
 */
function extractTagsFromText(...texts) {
  const stopWords = new Set([
    'svg', 'icon', 'icons', 'vector', 'vectors', 'collection', 'collections',
    'file', 'free', 'the', 'and', 'for', 'with', 'from', 'in', 'to', 'of', 'default', 'all'
  ]);
  const tags = new Set();

  for (const text of texts) {
    if (!text || typeof text !== 'string') continue;
    const tokens = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-_]/g, ' ')
      .split(/[\s-_]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2 && !stopWords.has(t) && !/^\d+$/.test(t));

    for (const token of tokens) {
      tags.add(token);
    }
  }

  return Array.from(tags);
}

/**
 * Determine standardized category, styleType, and iconType for an icon
 * Uses a multi-tier weighted scoring system:
 * 1. Explicit rawCategory mapping (+12)
 * 2. Icon's own title & slug word-boundary matches (+6 per match)
 * 3. Collection slug & name word-boundary matches (+3 per match)
 * Never uses substring .includes(catDef.id) or sibling-polluted collection tags.
 */
function classifyIcon({
  siteId = '',
  collectionSlug = '',
  collectionName = '',
  rawCategory = '',
  title = '',
  slug = '',
  detectedStyle = 'filled',
  hasAnimation = false,
}) {
  const normalizedRawCat = String(rawCategory || '').trim().toLowerCase();
  const iconText = `${title} ${slug}`.toLowerCase();
  const collectionText = `${collectionSlug} ${collectionName}`.toLowerCase();
  const combinedTokens = `${normalizedRawCat} ${collectionText} ${iconText}`;

  const isAnimatedPack =
    Boolean(hasAnimation) ||
    siteId === 'allsvgicons' ||
    ANIMATED_COLLECTIONS.has(String(collectionSlug).toLowerCase());

  const mappedFromRaw = RAW_CATEGORY_MAP[normalizedRawCat] || null;
  const isNonAiContext = NON_AI_CONTEXT_RE.test(combinedTokens);

  let matchedCategory = null;
  let bestScore = 0;

  if (isAnimatedPack) {
    matchedCategory = 'animation';
  } else {
    for (const matcher of COMPILED_CATEGORY_MATCHERS) {
      if (matcher.id === 'ai' && isNonAiContext && mappedFromRaw !== 'ai') {
        continue;
      }

      let score = 0;
      if (mappedFromRaw === matcher.id) {
        score += 12;
      }

      for (const regex of matcher.regexes) {
        if (regex.test(iconText)) {
          score += 6;
        } else if (regex.test(collectionText)) {
          score += 3;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        matchedCategory = matcher.id;
      }
    }

    if (!matchedCategory) {
      if (mappedFromRaw) {
        matchedCategory = mappedFromRaw;
      } else if (siteId === 'thesvg' || /\b(brand|brands|logo|logos|company)\b/i.test(collectionText)) {
        matchedCategory = 'brand';
      } else {
        matchedCategory = 'interface';
      }
    }
  }

  // 2. Determine Style Type
  let styleType = detectedStyle || 'filled';
  if (/\b(outlined|outline|line|stroke|thin|light-line)\b/i.test(combinedTokens)) {
    styleType = 'outlined';
  } else if (/\b(duotone|two-tone|twotone)\b/i.test(combinedTokens)) {
    styleType = 'duotone';
  } else if (/\b(multicolor|color|colored|flat)\b/i.test(combinedTokens) && detectedStyle === 'multicolor') {
    styleType = 'multicolor';
  } else if (/\b(filled|solid|glyph|thick|bold)\b/i.test(combinedTokens) && detectedStyle !== 'multicolor') {
    styleType = 'filled';
  }

  // 3. Determine Icon Type
  let iconType = 'ui-icon';
  if (isAnimatedPack || matchedCategory === 'animation') {
    iconType = 'animated';
  } else if (/\b(aws|azure|gcp|google-cloud|kubernetes|k8s|architecture)\b/i.test(`${collectionSlug} ${normalizedRawCat}`)) {
    iconType = 'architecture';
  } else if (/\b(auth|badge|badges)\b/i.test(`${collectionSlug} ${normalizedRawCat}`)) {
    iconType = 'badge';
  } else if (siteId === 'thesvg' || matchedCategory === 'brand') {
    iconType = 'brand-logo';
  }

  return {
    category: matchedCategory,
    styleType,
    iconType,
  };
}

/**
 * Compute similar / related icons across the library
 */
function findRelatedIcons(targetIcon, allIcons, limit = 12) {
  if (!targetIcon || !Array.isArray(allIcons)) {
    return { similar: [], sameStyle: [], sameCollection: [] };
  }

  const targetKey = `${targetIcon.site}:${targetIcon.collectionSlug}:${targetIcon.id || targetIcon.slug}`;
  const targetTags = new Set((targetIcon.tags || []).map((t) => t.toLowerCase()));

  const scored = [];
  const sameCollection = [];
  const sameStyle = [];

  for (const candidate of allIcons) {
    const candKey = `${candidate.site}:${candidate.collectionSlug}:${candidate.id || candidate.slug}`;
    if (candKey === targetKey) continue;

    let score = 0;
    const candTags = candidate.tags || [];
    let sharedTagCount = 0;

    for (const t of candTags) {
      if (targetTags.has(t.toLowerCase())) {
        sharedTagCount += 1;
      }
    }

    score += sharedTagCount * 12;

    if (candidate.category && candidate.category === targetIcon.category) {
      score += 8;
    }
    if (candidate.styleType && candidate.styleType === targetIcon.styleType) {
      score += 6;
    }
    if (candidate.iconType && candidate.iconType === targetIcon.iconType) {
      score += 4;
    }
    if (candidate.gridSize && candidate.gridSize === targetIcon.gridSize) {
      score += 3;
    }
    if (candidate.collectionSlug === targetIcon.collectionSlug) {
      score += 5;
      if (sameCollection.length < limit) {
        sameCollection.push(candidate);
      }
    } else if (
      candidate.styleType === targetIcon.styleType &&
      candidate.category === targetIcon.category &&
      sameStyle.length < limit
    ) {
      sameStyle.push(candidate);
    }

    if (score > 0) {
      scored.push({ icon: candidate, score, sharedTagCount });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return {
    similar: scored.slice(0, limit).map((s) => s.icon),
    sameStyle: sameStyle.slice(0, limit),
    sameCollection: sameCollection.slice(0, limit),
  };
}

module.exports = {
  CATEGORY_DEFINITIONS,
  STYLE_TYPES,
  ICON_TYPES,
  parseSvgMetadata,
  extractTagsFromText,
  classifyIcon,
  findRelatedIcons,
};
