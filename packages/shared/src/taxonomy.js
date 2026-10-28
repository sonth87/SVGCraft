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
    id: 'animals',
    label: 'Animals, Nature & Weather',
    icon: 'sun',
    keywords: [
      'animal', 'animals', 'dog', 'cat', 'bird', 'fish', 'insect', 'wildlife', 'pet', 'pets',
      'paw', 'nature', 'plant', 'plants', 'tree', 'flower', 'leaf', 'garden', 'forest',
      'mountain', 'landscape', 'weather', 'sun', 'moon', 'cloud-rain', 'rain', 'snow',
      'storm', 'wind', 'tornado', 'umbrella', 'thermometer', 'ecology', 'environment'
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture, Places & Home',
    icon: 'home',
    keywords: [
      'architecture', 'building', 'buildings', 'house', 'home', 'apartment', 'office-building',
      'city', 'landmark', 'landmarks', 'castle', 'church', 'mosque', 'temple', 'bridge',
      'tower', 'furniture', 'sofa', 'chair', 'bed', 'lamp', 'interior', 'kitchen-appliance',
      'household', 'bathroom', 'cleaning', 'laundry', 'real-estate', 'property'
    ],
  },
  {
    id: 'food',
    label: 'Food, Drink & Dining',
    icon: 'coffee',
    keywords: [
      'food', 'drink', 'drinks', 'beverage', 'coffee', 'tea', 'wine', 'beer', 'cocktail',
      'restaurant', 'dining', 'kitchen', 'cooking', 'chef', 'utensil', 'fork', 'knife',
      'spoon', 'plate', 'pizza', 'burger', 'cake', 'dessert', 'candy', 'fruit', 'apple-fruit',
      'banana', 'vegetable', 'meat', 'fish-food', 'bread', 'bakery', 'grocery'
    ],
  },
  {
    id: 'health',
    label: 'Health, Sports & Games',
    icon: 'activity',
    keywords: [
      'health', 'medical', 'medicine', 'hospital', 'doctor', 'nurse', 'clinic', 'pharmacy',
      'pill', 'capsule', 'syringe', 'vaccine', 'stethoscope', 'heart-rate', 'ambulance',
      'first-aid', 'dental', 'tooth', 'dna', 'virus', 'bacteria', 'fitness', 'sport',
      'sports', 'gym', 'dumbbell', 'workout', 'running', 'swimming', 'football', 'soccer',
      'basketball', 'tennis', 'golf', 'olympics', 'trophy', 'medal', 'chess', 'board-game', 'toy'
    ],
  },
  {
    id: 'transport',
    label: 'Transport, Maps & Travel',
    icon: 'compass',
    keywords: [
      'transport', 'transportation', 'travel', 'vehicle', 'vehicles', 'car', 'auto', 'bus',
      'truck', 'train', 'subway', 'metro', 'tram', 'bicycle', 'bike', 'motorcycle', 'scooter',
      'airplane', 'plane', 'flight', 'airport', 'helicopter', 'ship', 'boat', 'yacht',
      'rocket', 'spaceship', 'map', 'location', 'pin', 'compass', 'gps', 'navigation',
      'route', 'traffic', 'road', 'highway', 'luggage', 'suitcase', 'passport', 'ticket'
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
      'animation', 'animated', 'motion', 'lordicon', 'lottie', 'meteocons', 'line-md', 'svg-spinners',
      'spinners', 'spinner', 'loader', 'loading', 'loop', 'pulse', 'bounce',
      'rotate', 'shuffle', 'wave', 'bars-scale', 'dots-scale', 'dots-rotate', 'ring-with-bg'
    ],
  },
];

/**
 * Official 28 Lordicon Thematic Categories & their 108 Subcategories
 */
const LORDICON_CATEGORIES = [
  {
    id: 'popular',
    label: 'Popular',
    labelVi: 'Phổ biến',
    appCategory: 'interface',
    subcategories: ['popular', 'animation', 'loaders'],
  },
  {
    id: 'animals',
    label: 'Animals',
    labelVi: 'Động vật',
    appCategory: 'animals',
    subcategories: [
      'animals', 'birds-and-insects', 'fish-and-aquatic', 'mammals', 'pet-care',
      'reptiles-and-amphibians', 'pets', 'sea-life', 'farm-animals', 'wildlife',
    ],
  },
  {
    id: 'architecture-and-places',
    label: 'Architecture & Places',
    labelVi: 'Kiến trúc & Địa điểm',
    appCategory: 'architecture',
    subcategories: ['architecture-and-places', 'building-elements', 'buildings', 'homes-and-storage', 'landmarks', 'public-spaces', 'urban'],
  },
  {
    id: 'business-and-finance',
    label: 'Business & Finance',
    labelVi: 'Kinh doanh & Tài chính',
    appCategory: 'finance',
    subcategories: ['business-and-finance', 'banking', 'charts-and-analytics', 'crypto', 'money'],
  },
  {
    id: 'celebrations',
    label: 'Celebrations',
    labelVi: 'Lễ kỷ niệm & Sự kiện',
    appCategory: 'social',
    subcategories: ['celebrations', 'gift', 'holidays', 'party', 'wedding', 'awards'],
  },
  {
    id: 'characters-and-symbols',
    label: 'Characters & Symbols',
    labelVi: 'Ký tự & Biểu tượng',
    appCategory: 'interface',
    subcategories: ['characters-and-symbols', 'letters-and-numbers', 'symbols', 'logos'],
  },
  {
    id: 'communication',
    label: 'Communication',
    labelVi: 'Giao tiếp & Liên lạc',
    appCategory: 'social',
    subcategories: ['communication', 'mail', 'messages', 'phone-and-calls'],
  },
  {
    id: 'culture',
    label: 'Culture',
    labelVi: 'Văn hóa & Tôn giáo',
    appCategory: 'social',
    subcategories: ['culture', 'astrology', 'mythology-and-fantasy', 'religion'],
  },
  {
    id: 'design-and-editing',
    label: 'Design & Editing',
    labelVi: 'Thiết kế & Chỉnh sửa',
    appCategory: 'design',
    subcategories: ['design-and-editing', 'art-supplies', 'editing-tools', 'shapes', 'art', 'design'],
  },
  {
    id: 'fashion-and-beauty',
    label: 'Fashion & Beauty',
    labelVi: 'Thời trang & Làm đẹp',
    appCategory: 'design',
    subcategories: ['fashion-and-beauty', 'beauty', 'clothing-and-accessories', 'hats-and-headwear', 'jewelry', 'shoes', 'looks'],
  },
  {
    id: 'files-and-folders',
    label: 'Files & Folders',
    labelVi: 'Tệp tin & Thư mục',
    appCategory: 'productivity',
    subcategories: ['files-and-folders', 'file-types', 'files', 'folders'],
  },
  {
    id: 'finance-and-stats',
    label: 'Finance & Stats',
    labelVi: 'Tài chính & Thống kê',
    appCategory: 'finance',
    subcategories: ['finance-and-stats', 'charts'],
  },
  {
    id: 'food-and-drink',
    label: 'Food & Drink',
    labelVi: 'Ẩm thực & Đồ uống',
    appCategory: 'food',
    subcategories: ['food-and-drink', 'candies-and-desserts', 'desserts', 'drinks', 'fruits-and-vegetables', 'kitchen', 'meals', 'meat-and-fish'],
  },
  {
    id: 'games-and-toys',
    label: 'Games & Toys',
    labelVi: 'Trò chơi & Giải trí',
    appCategory: 'health',
    subcategories: ['games-and-toys', 'board-games', 'casino-and-gambling', 'chess', 'toys', 'video-games'],
  },
  {
    id: 'health-and-medical',
    label: 'Health & Medical',
    labelVi: 'Y tế & Sức khỏe',
    appCategory: 'health',
    subcategories: [
      'health-and-medical', 'ambulance', 'anatomy', 'dentistry', 'first-aid', 'hospital',
      'medical-equipment', 'medical-supplies', 'medicine', 'ophthalmology', 'wellness', 'body',
    ],
  },
  {
    id: 'household',
    label: 'Household',
    labelVi: 'Gia dụng & Nội thất',
    appCategory: 'architecture',
    subcategories: [
      'household', 'bathroom', 'bedroom', 'cleaning', 'decor', 'furniture', 'furniture-and-decor',
      'home-appliances', 'kitchen-and-appliances', 'hygiene', 'interior', 'lighting', 'tools',
    ],
  },
  {
    id: 'interface',
    label: 'Interface',
    labelVi: 'Giao diện (UI)',
    appCategory: 'interface',
    subcategories: ['interface', 'alerts', 'arrows'],
  },
  {
    id: 'music-and-audio',
    label: 'Music & Audio',
    labelVi: 'Âm nhạc & Âm thanh',
    appCategory: 'hardware',
    subcategories: ['music-and-audio', 'audio-equipment', 'instruments', 'music-symbols'],
  },
  {
    id: 'nature-and-weather',
    label: 'Nature & Weather',
    labelVi: 'Thiên nhiên & Thời tiết',
    appCategory: 'animals',
    subcategories: [
      'nature-and-weather', 'agriculture', 'camping', 'disasters', 'ecology',
      'gardening', 'landscapes', 'natural-forces', 'plants', 'weather',
    ],
  },
  {
    id: 'people',
    label: 'People',
    labelVi: 'Con người & Cảm xúc',
    appCategory: 'social',
    subcategories: [
      'people', 'actions', 'avatars', 'childhood', 'emoji', 'family',
      'family-and-kids', 'gestures', 'professions',
    ],
  },
  {
    id: 'photo-and-video',
    label: 'Photo & Video',
    labelVi: 'Nhiếp ảnh & Video',
    appCategory: 'design',
    subcategories: ['photo-and-video', 'photography', 'video-and-film'],
  },
  {
    id: 'science-and-industry',
    label: 'Science & Industry',
    labelVi: 'Khoa học & Công nghiệp',
    appCategory: 'hardware',
    subcategories: ['science-and-industry', 'astronomy-and-space', 'chemistry', 'construction', 'electricity', 'industry', 'mathematics', 'physics', 'science'],
  },
  {
    id: 'security-and-military',
    label: 'Security & Military',
    labelVi: 'Bảo mật & An ninh',
    appCategory: 'security',
    subcategories: ['security-and-military', 'law-and-crime', 'locks-and-shields', 'military', 'security', 'weapons'],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    labelVi: 'Mua sắm & Thương mại',
    appCategory: 'finance',
    subcategories: ['shopping', 'cart-and-bags', 'payments', 'sales-and-discounts', 'shipping'],
  },
  {
    id: 'sports-and-fitness',
    label: 'Sports & Fitness',
    labelVi: 'Thể thao & Thể hình',
    appCategory: 'health',
    subcategories: [
      'sports-and-fitness', 'fitness', 'fitness-and-gym', 'olympics', 'outdoor-sports',
      'sports', 'sports-equipment', 'swimming-and-diving', 'team-sports',
    ],
  },
  {
    id: 'tech-and-devices',
    label: 'Tech & Devices',
    labelVi: 'Công nghệ & Thiết bị',
    appCategory: 'hardware',
    subcategories: [
      'tech-and-devices', 'cloud', 'computers-and-peripherals', 'mobile',
      'network', 'networking', 'programming-and-ai', 'television',
    ],
  },
  {
    id: 'time-and-date',
    label: 'Time & Date',
    labelVi: 'Thời gian & Lịch',
    appCategory: 'productivity',
    subcategories: ['time-and-date', 'calendar', 'clocks'],
  },
  {
    id: 'transport',
    label: 'Transport',
    labelVi: 'Giao thông & Di chuyển',
    appCategory: 'transport',
    subcategories: [
      'transport', 'air-and-sea', 'bicycles', 'car-service', 'navigation-and-maps',
      'public-transport', 'road-signs', 'traffic-and-roads', 'trains', 'travel', 'vehicles',
    ],
  },
  {
    id: 'work-and-education',
    label: 'Work & Education',
    labelVi: 'Công việc & Giáo dục',
    appCategory: 'productivity',
    subcategories: ['work-and-education', 'books', 'education', 'stationery', 'work'],
  },
];

const SUBCATEGORY_TO_LORDICON_CATEGORY = {};
for (const lCat of LORDICON_CATEGORIES) {
  SUBCATEGORY_TO_LORDICON_CATEGORY[lCat.id] = lCat;
  for (const sub of lCat.subcategories) {
    SUBCATEGORY_TO_LORDICON_CATEGORY[sub] = lCat;
  }
}

function resolveLordiconCategory(rawCategory = '', slug = '', title = '') {
  const norm = String(rawCategory || '').trim().toLowerCase();
  if (norm && SUBCATEGORY_TO_LORDICON_CATEGORY[norm]) {
    const lCat = SUBCATEGORY_TO_LORDICON_CATEGORY[norm];
    return {
      lordiconCategory: lCat.id,
      lordiconCategoryLabel: lCat.label,
      appCategory: norm === 'programming-and-ai' ? 'ai' : lCat.appCategory,
    };
  }
  return {
    lordiconCategory: 'interface',
    lordiconCategoryLabel: 'Interface',
    appCategory: 'interface',
  };
}

// Explicit mapping for rawCategory values from theSVG.org, SVGRepo, AllSVGIcons, and Lordicon
const RAW_CATEGORY_MAP = {
  animation: 'animation',
  animated: 'animation',
  motion: 'animation',
  lordicon: 'animation',
  'animated icons': 'animation',
  spinners: 'animation',
  loaders: 'animation',
  meteocons: 'animation',
  'line-md': 'animation',
  'svg-spinners': 'animation',

  // Animals, Nature & Weather
  animals: 'animals',
  'birds-and-insects': 'animals',
  'fish-and-aquatic': 'animals',
  mammals: 'animals',
  'pet-care': 'animals',
  'reptiles-and-amphibians': 'animals',
  pets: 'animals',
  'sea-life': 'animals',
  'farm-animals': 'animals',
  wildlife: 'animals',
  'nature-and-weather': 'animals',
  agriculture: 'animals',
  camping: 'animals',
  disasters: 'animals',
  ecology: 'animals',
  gardening: 'animals',
  landscapes: 'animals',
  'natural-forces': 'animals',
  plants: 'animals',
  weather: 'animals',

  // Architecture, Places & Household
  'architecture-and-places': 'architecture',
  'building-elements': 'architecture',
  buildings: 'architecture',
  'homes-and-storage': 'architecture',
  landmarks: 'architecture',
  'public-spaces': 'architecture',
  urban: 'architecture',
  household: 'architecture',
  bathroom: 'architecture',
  bedroom: 'architecture',
  cleaning: 'architecture',
  decor: 'architecture',
  furniture: 'architecture',
  'furniture-and-decor': 'architecture',
  'home-appliances': 'architecture',
  'kitchen-and-appliances': 'architecture',
  hygiene: 'architecture',
  interior: 'architecture',
  lighting: 'architecture',
  tools: 'architecture',

  // Food & Drink
  food: 'food',
  'food-and-drink': 'food',
  'food platform': 'food',
  'candies-and-desserts': 'food',
  desserts: 'food',
  drinks: 'food',
  'fruits-and-vegetables': 'food',
  kitchen: 'food',
  meals: 'food',
  'meat-and-fish': 'food',

  // Health, Medical, Sports & Games
  'health-and-medical': 'health',
  ambulance: 'health',
  anatomy: 'health',
  dentistry: 'health',
  'first-aid': 'health',
  hospital: 'health',
  'medical-equipment': 'health',
  'medical-supplies': 'health',
  medicine: 'health',
  ophthalmology: 'health',
  wellness: 'health',
  body: 'health',
  'sports-and-fitness': 'health',
  fitness: 'health',
  'fitness-and-gym': 'health',
  olympics: 'health',
  'outdoor-sports': 'health',
  sports: 'health',
  'sports-equipment': 'health',
  'swimming-and-diving': 'health',
  'team-sports': 'health',
  'games-and-toys': 'health',
  'board-games': 'health',
  'casino-and-gambling': 'health',
  chess: 'health',
  toys: 'health',
  'video-games': 'health',

  // Transport, Maps & Travel
  transport: 'transport',
  'air-and-sea': 'transport',
  bicycles: 'transport',
  'car-service': 'transport',
  'navigation-and-maps': 'transport',
  'public-transport': 'transport',
  'road-signs': 'transport',
  'traffic-and-roads': 'transport',
  trains: 'transport',
  travel: 'transport',
  vehicles: 'transport',
  'automotive platform': 'transport',
  'aviation platform': 'transport',

  ai: 'ai',
  'ai software': 'ai',
  'google ai': 'ai',
  'machine learning': 'ai',
  'artificial intelligence': 'ai',
  'programming-and-ai': 'ai',

  cloud: 'cloud',
  'software cloud': 'cloud',
  compute: 'cloud',
  storage: 'cloud',
  containers: 'cloud',
  serverless: 'cloud',
  'hosting platform': 'cloud',
  hosting: 'cloud',
  networking: 'cloud',
  network: 'cloud',
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
  'security-and-military': 'security',
  'locks-and-shields': 'security',
  'law-and-crime': 'security',
  military: 'security',
  weapons: 'security',

  finance: 'finance',
  'crypto finance': 'finance',
  'finance software': 'finance',
  'payment finance': 'finance',
  blockchain: 'finance',
  crypto: 'finance',
  'finance-and-stats': 'finance',
  'business-and-finance': 'finance',
  banking: 'finance',
  money: 'finance',
  'shopping platform': 'finance',
  shopping: 'finance',
  'cart-and-bags': 'finance',
  payments: 'finance',
  'sales-and-discounts': 'finance',
  shipping: 'finance',
  'e-commerce': 'finance',
  ecommerce: 'finance',

  design: 'design',
  'design software': 'design',
  'design-and-editing': 'design',
  'art-supplies': 'design',
  'editing-tools': 'design',
  shapes: 'design',
  art: 'design',
  'photo-and-video': 'design',
  photography: 'design',
  'video-and-film': 'design',
  'fashion-and-beauty': 'design',
  beauty: 'design',
  'clothing-and-accessories': 'design',
  'hats-and-headwear': 'design',
  jewelry: 'design',
  shoes: 'design',
  looks: 'design',

  social: 'social',
  'social platform': 'social',
  email: 'social',
  'web email': 'social',
  communication: 'social',
  mail: 'social',
  messages: 'social',
  'phone-and-calls': 'social',
  people: 'social',
  avatars: 'social',
  childhood: 'social',
  emoji: 'social',
  family: 'social',
  'family-and-kids': 'social',
  gestures: 'social',
  actions: 'social',
  professions: 'social',
  celebrations: 'social',
  awards: 'social',
  party: 'social',
  gift: 'social',
  holidays: 'social',
  wedding: 'social',
  culture: 'social',
  astrology: 'social',
  'mythology-and-fantasy': 'social',
  religion: 'social',

  analytics: 'productivity',
  management: 'productivity',
  business: 'productivity',
  education: 'productivity',
  productivity: 'productivity',
  services: 'productivity',
  'files-and-folders': 'productivity',
  files: 'productivity',
  'file-types': 'productivity',
  folders: 'productivity',
  'time-and-date': 'productivity',
  calendar: 'productivity',
  clocks: 'productivity',
  'work-and-education': 'productivity',
  books: 'productivity',
  stationery: 'productivity',
  work: 'productivity',
  charts: 'productivity',
  'charts-and-analytics': 'productivity',

  hardware: 'hardware',
  'hardware software': 'hardware',
  iot: 'hardware',
  'tech-and-devices': 'hardware',
  'computers-and-peripherals': 'hardware',
  mobile: 'hardware',
  television: 'hardware',
  'music-and-audio': 'hardware',
  'audio-equipment': 'hardware',
  instruments: 'hardware',
  'music-symbols': 'hardware',
  'science-and-industry': 'hardware',
  'astronomy-and-space': 'hardware',
  chemistry: 'hardware',
  construction: 'hardware',
  electricity: 'hardware',
  industry: 'hardware',
  mathematics: 'hardware',
  physics: 'hardware',
  science: 'hardware',

  interface: 'interface',
  popular: 'interface',
  alerts: 'interface',
  arrows: 'interface',
  symbols: 'interface',
  'characters-and-symbols': 'interface',
  'letters-and-numbers': 'interface',

  brand: 'brand',
  logos: 'brand',
  entertainment: 'brand',
  'entertainment platform': 'brand',
  media: 'brand',
  'media entertainment': 'brand',
  gaming: 'brand',
  'gaming entertainment': 'brand',
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

  const isPureAnimatedPack =
    Boolean(hasAnimation) ||
    siteId === 'allsvgicons' ||
    ANIMATED_COLLECTIONS.has(String(collectionSlug).toLowerCase());
  const isLordicon = siteId === 'lordicon' || /^lordicon-/i.test(String(collectionSlug));

  const mappedFromRaw = RAW_CATEGORY_MAP[normalizedRawCat] || null;
  const isNonAiContext = NON_AI_CONTEXT_RE.test(combinedTokens);

  let matchedCategory = null;
  let bestScore = 0;

  if (isPureAnimatedPack && !isLordicon) {
    matchedCategory = 'animation';
  } else {
    for (const matcher of COMPILED_CATEGORY_MATCHERS) {
      if (matcher.id === 'ai' && isNonAiContext && mappedFromRaw !== 'ai') {
        continue;
      }

      let score = 0;
      if (mappedFromRaw === matcher.id) {
        score += isLordicon && normalizedRawCat !== 'popular' ? 24 : 12;
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
  if (/\b(motif|duotone|two-tone|twotone)\b/i.test(combinedTokens)) {
    styleType = 'duotone';
  } else if (/\b(color|colored|flat|lineal|gradient|multicolor)\b/i.test(collectionText)) {
    styleType = 'multicolor';
  } else if (/\b(outlined|outline|line|stroke|thin|light-line)\b/i.test(combinedTokens)) {
    styleType = 'outlined';
  } else if (/\b(multicolor|color|colored|flat)\b/i.test(combinedTokens) && detectedStyle === 'multicolor') {
    styleType = 'multicolor';
  } else if (/\b(filled|solid|black|glyph|thick|bold)\b/i.test(combinedTokens) && detectedStyle !== 'multicolor') {
    styleType = 'filled';
  }

  // 3. Determine Icon Type
  let iconType = 'ui-icon';
  if (isPureAnimatedPack || isLordicon || matchedCategory === 'animation') {
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
  LORDICON_CATEGORIES,
  STYLE_TYPES,
  ICON_TYPES,
  parseSvgMetadata,
  extractTagsFromText,
  classifyIcon,
  resolveLordiconCategory,
  findRelatedIcons,
};
