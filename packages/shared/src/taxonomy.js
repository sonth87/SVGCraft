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
    id: 'popular',
    label: 'Popular',
    labelVi: 'Phổ biến',
    icon: 'sparkles',
    keywords: ['popular', 'trending', 'featured', 'star', 'favorite', 'bookmark', 'essential'],
  },
  {
    id: 'interface',
    label: 'Interface',
    labelVi: 'Giao diện (UI)',
    icon: 'sliders',
    keywords: [
      'interface', 'ui', 'arrow', 'arrows', 'angle', 'align', 'menu', 'hamburger',
      'search', 'settings', 'gear', 'cog', 'sliders', 'check', 'checkmark', 'close',
      'cancel', 'plus', 'minus', 'chevron', 'caret', 'cursor', 'pointer', 'button',
      'toggle', 'switch', 'layout', 'grid', 'filter', 'funnel', 'sort', 'trash',
      'delete', 'remove', 'download', 'upload', 'export', 'import', 'link', 'unlink',
      'external', 'eye', 'visibility', 'bell', 'notification', 'accessibility',
      'loader', 'spinner', 'refresh', 'sync', 'zoom', 'maximize', 'minimize', 'fullscreen', 'sidebar', 'alert', 'alerts'
    ],
  },
  {
    id: 'animals',
    label: 'Animals',
    labelVi: 'Động vật',
    icon: 'sun',
    keywords: [
      'animal', 'animals', 'dog', 'cat', 'bird', 'birds', 'fish', 'insect', 'insects',
      'wildlife', 'pet', 'pets', 'paw', 'mammal', 'mammals', 'reptile', 'amphibian',
      'aquatic', 'sea-life', 'farm-animal', 'lion', 'tiger', 'bear', 'elephant', 'horse',
      'rabbit', 'monkey', 'fox', 'wolf', 'deer', 'owl', 'eagle', 'penguin', 'dolphin',
      'whale', 'shark', 'octopus', 'crab', 'turtle', 'snake', 'frog', 'butterfly', 'bee', 'spider'
    ],
  },
  {
    id: 'architecture-and-places',
    label: 'Architecture & Places',
    labelVi: 'Kiến trúc & Địa điểm',
    icon: 'home',
    keywords: [
      'architecture', 'building', 'buildings', 'apartment', 'office-building', 'skyscraper',
      'city', 'urban', 'landmark', 'landmarks', 'castle', 'church', 'mosque', 'temple',
      'bridge', 'tower', 'monument', 'museum', 'stadium', 'park', 'public-space', 'warehouse',
      'factory-building', 'real-estate', 'property', 'pillar', 'arch', 'dome'
    ],
  },
  {
    id: 'business-and-finance',
    label: 'Business & Finance',
    labelVi: 'Kinh doanh & Tài chính',
    icon: 'wallet',
    keywords: [
      'business', 'finance', 'financial', 'payment', 'stripe', 'paypal', 'visa', 'mastercard',
      'amex', 'apple-pay', 'google-pay', 'alipay', 'klarna', 'wise', 'revolut', 'bank',
      'banking', 'wallet', 'crypto', 'cryptocurrency', 'blockchain', 'bitcoin', 'btc',
      'ethereum', 'eth', 'solana', 'binance', 'coinbase', 'metamask', 'coin', 'coins',
      'dollar', 'euro', 'yen', 'pound', 'currency', 'money', 'cash', 'credit-card',
      'debit-card', 'invoice', 'receipt', 'tax', 'accounting', 'loan', 'mortgage',
      'investment', 'stock', 'dividend', 'profit', 'handshake', 'b2b', 'corporate'
    ],
  },
  {
    id: 'celebrations',
    label: 'Celebrations',
    labelVi: 'Lễ kỷ niệm & Sự kiện',
    icon: 'sparkles',
    keywords: [
      'celebration', 'celebrations', 'party', 'holiday', 'holidays', 'gift', 'present',
      'birthday', 'wedding', 'anniversary', 'christmas', 'halloween', 'easter', 'new-year',
      'valentine', 'fireworks', 'confetti', 'balloon', 'balloons', 'champagne', 'cheers',
      'festival', 'carnival', 'award', 'awards', 'ribbon'
    ],
  },
  {
    id: 'characters-and-symbols',
    label: 'Characters & Symbols',
    labelVi: 'Ký tự & Biểu tượng',
    icon: 'code',
    keywords: [
      'character', 'characters', 'symbol', 'symbols', 'letter', 'letters', 'number',
      'numbers', 'alphabet', 'numeric', 'digit', 'digits', 'typography', 'font',
      'hashtag', 'asterisk', 'ampersand', 'at-sign', 'percent', 'infinity', 'peace',
      'recycle', 'trademark', 'copyright', 'registered', 'zodiac-sign'
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    labelVi: 'Giao tiếp & Liên lạc',
    icon: 'message-square',
    keywords: [
      'communication', 'chat', 'message', 'messages', 'messaging', 'comment', 'comments',
      'forum', 'mail', 'email', 'webmail', 'inbox', 'envelope', 'send', 'voip',
      'phone', 'call', 'telephone', 'video-call', 'podcast', 'broadcast', 'megaphone',
      'discord', 'slack', 'telegram', 'whatsapp', 'signal', 'wechat', 'messenger'
    ],
  },
  {
    id: 'culture',
    label: 'Culture',
    labelVi: 'Văn hóa & Tôn giáo',
    icon: 'hexagon',
    keywords: [
      'culture', 'cultural', 'religion', 'religious', 'spiritual', 'astrology', 'horoscope',
      'mythology', 'fantasy', 'dragon', 'unicorn', 'magic', 'wizard', 'tradition',
      'heritage', 'history', 'ancient', 'tribal', 'zen', 'meditation', 'pray', 'prayer',
      'cross', 'crescent', 'om', 'yin-yang', 'torii', 'menorah', 'buddha'
    ],
  },
  {
    id: 'design-and-editing',
    label: 'Design & Editing',
    labelVi: 'Thiết kế & Chỉnh sửa',
    icon: 'pen-tool',
    keywords: [
      'design', 'editing', 'figma', 'adobe', 'photoshop', 'illustrator', 'indesign',
      'sketch', 'canva', 'framer', 'webflow', 'blender', 'dribbble', 'behance',
      'color', 'palette', 'swatch', 'gradient', 'brush', 'paintbrush', 'pen-tool',
      'pencil', 'vector', 'bezier', 'crop', 'canvas', 'artboard', 'ruler', 'eraser',
      'scissors', 'eyedropper', 'magic-wand', 'layer-mask', 'art', 'drawing', 'painting'
    ],
  },
  {
    id: 'fashion-and-beauty',
    label: 'Fashion & Beauty',
    labelVi: 'Thời trang & Làm đẹp',
    icon: 'sparkles',
    keywords: [
      'fashion', 'beauty', 'clothing', 'clothes', 'apparel', 'shirt', 't-shirt', 'dress',
      'skirt', 'pants', 'jeans', 'jacket', 'coat', 'suit', 'tie', 'hat', 'cap', 'headwear',
      'shoe', 'shoes', 'sneaker', 'boot', 'heels', 'socks', 'glove', 'scarf', 'glasses',
      'sunglasses', 'jewelry', 'ring', 'necklace', 'earring', 'diamond', 'crown', 'cosmetics',
      'makeup', 'lipstick', 'perfume', 'skincare', 'salon', 'barber', 'haircut', 'comb', 'mirror'
    ],
  },
  {
    id: 'files-and-folders',
    label: 'Files & Folders',
    labelVi: 'Tệp tin & Thư mục',
    icon: 'layers',
    keywords: [
      'file', 'files', 'folder', 'folders', 'directory', 'archive', 'zip', 'rar',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'json-file', 'xml-file',
      'binder', 'clipboard', 'attachment', 'paperclip', 'copy-file', 'save-file'
    ],
  },
  {
    id: 'finance-and-stats',
    label: 'Finance & Stats',
    labelVi: 'Tài chính & Thống kê',
    icon: 'activity',
    keywords: [
      'stats', 'statistics', 'analytics', 'chart', 'charts', 'bar-chart', 'pie-chart',
      'line-chart', 'area-chart', 'donut-chart', 'graph', 'diagram', 'infographic',
      'metric', 'kpi', 'report', 'reporting', 'dashboard', 'trend', 'growth', 'forecast'
    ],
  },
  {
    id: 'food-and-drink',
    label: 'Food & Drink',
    labelVi: 'Ẩm thực & Đồ uống',
    icon: 'coffee',
    keywords: [
      'food', 'drink', 'drinks', 'beverage', 'coffee', 'tea', 'wine', 'beer', 'cocktail',
      'juice', 'milk', 'water-bottle', 'restaurant', 'dining', 'cooking', 'chef',
      'utensil', 'fork', 'knife', 'spoon', 'plate', 'bowl', 'cup', 'mug', 'glass',
      'pizza', 'burger', 'sandwich', 'hotdog', 'taco', 'sushi', 'noodle', 'pasta',
      'steak', 'meat', 'chicken', 'seafood', 'salad', 'soup', 'bread', 'croissant',
      'bakery', 'cake', 'pie', 'cookie', 'donut', 'ice-cream', 'dessert', 'candy',
      'chocolate', 'fruit', 'banana', 'strawberry', 'orange', 'lemon', 'grape',
      'watermelon', 'cherry', 'avocado', 'vegetable', 'carrot', 'tomato', 'broccoli',
      'corn', 'mushroom', 'egg', 'cheese', 'grocery'
    ],
  },
  {
    id: 'games-and-toys',
    label: 'Games & Toys',
    labelVi: 'Trò chơi & Giải trí',
    icon: 'cpu',
    keywords: [
      'game', 'games', 'gaming', 'video-game', 'gamepad', 'joystick', 'controller',
      'arcade', 'console', 'board-game', 'chess', 'dice', 'domino', 'puzzle', 'jigsaw',
      'card-game', 'poker', 'casino', 'slot-machine', 'roulette', 'toy', 'toys',
      'teddy-bear', 'doll', 'kite', 'lego', 'rubik', 'pinball', 'esports'
    ],
  },
  {
    id: 'health-and-medical',
    label: 'Health & Medical',
    labelVi: 'Y tế & Sức khỏe',
    icon: 'activity',
    keywords: [
      'health', 'healthcare', 'medical', 'medicine', 'hospital', 'doctor', 'nurse',
      'clinic', 'pharmacy', 'pill', 'pills', 'capsule', 'tablet-medicine', 'syringe',
      'vaccine', 'injection', 'stethoscope', 'heart-rate', 'pulse', 'ecg', 'ambulance',
      'first-aid', 'bandage', 'plaster', 'wheelchair', 'crutch', 'dental', 'dentist',
      'tooth', 'teeth', 'ophthalmology', 'eye-care', 'anatomy', 'organ', 'brain',
      'lungs', 'heart-organ', 'stomach', 'kidney', 'liver', 'bone', 'skull', 'skeleton',
      'dna', 'gene', 'virus', 'bacteria', 'microscope-medical', 'wellness', 'therapy'
    ],
  },
  {
    id: 'household',
    label: 'Household',
    labelVi: 'Gia dụng & Nội thất',
    icon: 'home',
    keywords: [
      'household', 'house', 'home', 'furniture', 'sofa', 'couch', 'armchair', 'chair',
      'table-furniture', 'desk', 'bed', 'mattress', 'pillow', 'wardrobe', 'closet',
      'cabinet', 'shelf', 'bookcase', 'lamp', 'chandelier', 'lightbulb', 'curtain',
      'carpet', 'rug', 'interior', 'decor', 'vase', 'plant-pot', 'bathroom', 'bathtub',
      'shower', 'toilet', 'sink', 'faucet', 'towel', 'soap', 'toothbrush', 'hygiene',
      'cleaning', 'broom', 'mop', 'vacuum', 'bucket', 'sponge', 'detergent', 'laundry',
      'washing-machine', 'iron', 'hanger', 'appliance', 'refrigerator', 'fridge',
      'microwave', 'oven', 'stove', 'toaster', 'blender-kitchen', 'kettle', 'air-conditioner', 'fan'
    ],
  },
  {
    id: 'music-and-audio',
    label: 'Music & Audio',
    labelVi: 'Âm nhạc & Âm thanh',
    icon: 'activity',
    keywords: [
      'music', 'musical', 'audio', 'sound', 'song', 'melody', 'note', 'clef', 'chord',
      'instrument', 'instruments', 'guitar', 'piano', 'keyboard-music', 'violin', 'cello',
      'drum', 'drums', 'trumpet', 'saxophone', 'flute', 'harp', 'accordion', 'ukulele',
      'microphone', 'mic', 'speaker', 'subwoofer', 'amplifier', 'headphone', 'headphones',
      'earbuds', 'earphones', 'equalizer', 'mixer', 'dj', 'turntable', 'vinyl', 'cassette',
      'cd', 'radio', 'playlist', 'waveform', 'volume', 'mute'
    ],
  },
  {
    id: 'nature-and-weather',
    label: 'Nature & Weather',
    labelVi: 'Thiên nhiên & Thời tiết',
    icon: 'sun',
    keywords: [
      'nature', 'natural', 'plant', 'plants', 'tree', 'trees', 'pine', 'palm', 'flower',
      'flowers', 'rose', 'tulip', 'sunflower', 'lotus', 'leaf', 'leaves', 'clover',
      'cactus', 'seed', 'sprout', 'garden', 'gardening', 'agriculture', 'farming',
      'forest', 'jungle', 'mountain', 'mountains', 'volcano', 'island', 'beach', 'ocean',
      'wave', 'river', 'waterfall', 'desert', 'camping', 'tent', 'campfire', 'bonfire',
      'weather', 'sun', 'sunny', 'sunrise', 'sunset', 'moon', 'star-sky', 'cloud-weather',
      'rain', 'rainy', 'raindrop', 'snow', 'snowflake', 'snowy', 'storm', 'thunder',
      'lightning', 'wind', 'windy', 'tornado', 'hurricane', 'rainbow', 'umbrella',
      'thermometer', 'temperature', 'ecology', 'environment', 'earth-nature', 'fire', 'water-drop'
    ],
  },
  {
    id: 'people',
    label: 'People',
    labelVi: 'Con người & Cảm xúc',
    icon: 'sliders',
    keywords: [
      'people', 'person', 'human', 'user', 'users', 'profile', 'avatar', 'avatars',
      'man', 'woman', 'boy', 'girl', 'child', 'children', 'kid', 'kids', 'baby',
      'infant', 'family', 'parents', 'couple', 'team', 'group', 'crowd', 'community',
      'emoji', 'emoticon', 'smile', 'smiley', 'happy', 'sad', 'angry', 'laugh', 'wink',
      'gesture', 'gestures', 'hand', 'hands', 'thumbs-up', 'thumbs-down', 'clap',
      'wave-hand', 'point', 'fist', 'profession', 'worker', 'engineer', 'teacher',
      'student', 'scientist', 'artist', 'astronaut', 'pilot', 'firefighter', 'police'
    ],
  },
  {
    id: 'photo-and-video',
    label: 'Photo & Video',
    labelVi: 'Nhiếp ảnh & Video',
    icon: 'pen-tool',
    keywords: [
      'photo', 'photograph', 'photography', 'camera', 'dslr', 'lens', 'aperture',
      'shutter', 'flash', 'tripod', 'polaroid', 'image', 'picture', 'gallery', 'portrait',
      'panorama', 'selfie', 'filter-photo', 'video', 'film', 'movie', 'cinema', 'clapperboard',
      'camcorder', 'projector', 'reel', 'frame', 'streaming', 'record-video', 'premiere', 'after-effects'
    ],
  },
  {
    id: 'science-and-industry',
    label: 'Science & Industry',
    labelVi: 'Khoa học & Công nghiệp',
    icon: 'cpu',
    keywords: [
      'science', 'scientific', 'laboratory', 'lab', 'chemistry', 'flask', 'beaker',
      'test-tube', 'molecule', 'atom', 'atomic', 'nuclear', 'radiation', 'physics',
      'magnet', 'gravity', 'prism', 'telescope', 'astronomy', 'space', 'planet',
      'saturn', 'mars', 'galaxy', 'meteor', 'comet', 'satellite', 'ufo', 'alien',
      'mathematics', 'math', 'calculator', 'formula', 'geometry', 'compass-math',
      'abacus', 'industry', 'industrial', 'factory', 'manufacturing', 'construction',
      'crane', 'excavator', 'bulldozer', 'forklift', 'hammer', 'wrench', 'screwdriver',
      'drill', 'saw', 'pliers', 'toolbox', 'hard-hat', 'helmet-safety', 'brick',
      'trowel', 'paint-roller', 'welding', 'oil', 'gas', 'mining', 'energy', 'solar-panel',
      'wind-turbine', 'electricity', 'power-plant', 'high-voltage', 'plug', 'socket'
    ],
  },
  {
    id: 'security-and-military',
    label: 'Security & Military',
    labelVi: 'Bảo mật & An ninh',
    icon: 'shield',
    keywords: [
      'security', 'cybersecurity', 'cyber-security', 'auth', 'authentication',
      'authorization', 'lock', 'padlock', 'unlock', 'key', 'keys', 'keyhole', 'shield',
      'privacy', 'vpn', 'firewall', 'antivirus', 'malware', 'spyware', 'phishing',
      'encryption', 'password', 'passcode', 'pin-code', 'oauth', 'passkey', '2fa',
      'mfa', 'otp', 'fingerprint', 'biometric', 'face-id', 'vault', 'safe', 'cctv',
      'surveillance', 'alarm-security', 'siren', 'law', 'justice', 'court', 'gavel',
      'scale-justice', 'handcuffs', 'prison', 'detective', 'crime', 'military', 'army',
      'soldier', 'tank', 'missile', 'bomb', 'grenade', 'weapon', 'sword', 'bow', 'target-aim',
      '1password', 'bitwarden', 'lastpass', 'okta', 'auth0'
    ],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    labelVi: 'Mua sắm & Thương mại',
    icon: 'wallet',
    keywords: [
      'shopping', 'shop', 'store', 'storefront', 'market', 'supermarket', 'mall',
      'boutique', 'ecommerce', 'e-commerce', 'cart', 'shopping-cart', 'trolley',
      'bag', 'shopping-bag', 'basket', 'checkout', 'cashier', 'pos', 'barcode',
      'qrcode', 'price', 'price-tag', 'label-tag', 'discount', 'sale', 'coupon',
      'voucher', 'promo', 'offer', 'loyalty', 'shipping', 'delivery', 'package',
      'parcel', 'box', 'unboxing', 'shopify', 'woocommerce', 'magento'
    ],
  },
  {
    id: 'sports-and-fitness',
    label: 'Sports & Fitness',
    labelVi: 'Thể thao & Thể hình',
    icon: 'activity',
    keywords: [
      'sport', 'sports', 'fitness', 'gym', 'workout', 'exercise', 'training',
      'dumbbell', 'barbell', 'kettlebell', 'treadmill', 'yoga', 'pilates', 'stretching',
      'running', 'jogging', 'marathon', 'sprint', 'athletics', 'swimming', 'diving',
      'surfing', 'kayak', 'rowing', 'football', 'soccer', 'basketball', 'baseball',
      'volleyball', 'tennis', 'badminton', 'table-tennis', 'ping-pong', 'golf',
      'rugby', 'cricket', 'hockey', 'ice-skating', 'skiing', 'snowboard', 'boxing',
      'martial-arts', 'karate', 'fencing', 'archery', 'bowling', 'billiards', 'pool-ball',
      'skateboarding', 'climbing', 'olympics', 'trophy', 'medal', 'championship',
      'podium', 'whistle', 'stopwatch-sport', 'scoreboard', 'stadium-sport'
    ],
  },
  {
    id: 'tech-and-devices',
    label: 'Tech & Devices',
    labelVi: 'Công nghệ & Thiết bị',
    icon: 'cpu',
    keywords: [
      'tech', 'technology', 'hardware', 'device', 'devices', 'computer', 'pc',
      'desktop', 'imac', 'laptop', 'macbook', 'notebook-pc', 'monitor', 'display',
      'screen', 'tv', 'television', 'smart-tv', 'mobile', 'smartphone', 'iphone',
      'android-phone', 'tablet', 'ipad', 'watch-smart', 'smartwatch', 'wearable',
      'vr', 'headset-vr', 'cpu', 'processor', 'microchip', 'chip', 'semiconductor',
      'gpu', 'motherboard', 'circuit', 'ram', 'memory-card', 'sd-card', 'ssd',
      'hard-drive', 'hdd', 'usb', 'flash-drive', 'pendrive', 'cable', 'adapter',
      'charger', 'battery', 'power-bank', 'keyboard', 'mouse', 'trackpad', 'webcam',
      'printer', 'scanner', '3d-printer', 'router', 'modem', 'wifi', 'bluetooth',
      'antenna', 'signal-network', 'iot', 'sensor', 'drone', 'robot', 'robotics'
    ],
  },
  {
    id: 'time-and-date',
    label: 'Time & Date',
    labelVi: 'Thời gian & Lịch',
    icon: 'layers',
    keywords: [
      'time', 'date', 'clock', 'watch-time', 'wrist-watch', 'wall-clock', 'alarm',
      'alarm-clock', 'timer', 'stopwatch', 'hourglass', 'sandglass', 'calendar',
      'schedule', 'agenda', 'appointment', 'deadline', 'reminder', 'history-time',
      'past', 'future', 'day', 'night', 'week', 'month', 'year', 'calendly'
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    labelVi: 'Giao thông & Di chuyển',
    icon: 'compass',
    keywords: [
      'transport', 'transportation', 'travel', 'transit', 'vehicle', 'vehicles',
      'car', 'auto', 'automobile', 'sedan', 'suv', 'taxi', 'cab', 'police-car',
      'bus', 'van', 'minibus', 'truck', 'lorry', 'pickup', 'trailer', 'tractor',
      'train', 'locomotive', 'subway', 'metro', 'tram', 'trolleybus', 'monorail',
      'bicycle', 'bike', 'cycling', 'motorcycle', 'motorbike', 'scooter', 'vespa',
      'skateboard', 'segway', 'airplane', 'plane', 'aircraft', 'jet', 'flight',
      'airport', 'runway', 'helicopter', 'hot-air-balloon', 'airship', 'ship',
      'boat', 'yacht', 'sailboat', 'ferry', 'cruise', 'submarine', 'anchor', 'harbor',
      'rocket', 'spaceship', 'shuttle', 'map', 'location', 'pin', 'marker', 'compass',
      'gps', 'navigation', 'route', 'direction', 'road', 'highway', 'street',
      'intersection', 'roundabout', 'traffic', 'traffic-light', 'road-sign', 'stop-sign',
      'parking', 'garage', 'gas-station', 'fuel', 'ev-charging', 'tire', 'wheel',
      'steering-wheel', 'speedometer', 'luggage', 'suitcase', 'backpack-travel', 'passport', 'ticket-travel'
    ],
  },
  {
    id: 'work-and-education',
    label: 'Work & Education',
    labelVi: 'Công việc & Giáo dục',
    icon: 'layers',
    keywords: [
      'work', 'office', 'workspace', 'productivity', 'job', 'career', 'resume', 'cv',
      'briefcase', 'id-card', 'badge-office', 'meeting', 'conference', 'presentation',
      'whiteboard', 'blackboard', 'project', 'task', 'todo', 'checklist', 'kanban',
      'notes', 'sticky-note', 'notepad', 'notebook', 'stationery', 'pen', 'ballpoint',
      'highlighter', 'marker-pen', 'stapler', 'tape', 'glue', 'calculator-office',
      'education', 'school', 'university', 'college', 'academy', 'learning', 'study',
      'e-learning', 'graduation', 'mortarboard', 'diploma', 'certificate', 'degree',
      'book', 'books', 'library', 'bookmark-book', 'dictionary', 'encyclopedia',
      'globe-school', 'backpack', 'exam', 'test', 'quiz', 'grade', 'lecture',
      'notion', 'obsidian', 'linear', 'jira', 'confluence', 'trello', 'asana', 'clickup', 'airtable', 'miro'
    ],
  },
  {
    id: 'ai',
    label: 'AI & Machine Learning',
    labelVi: 'AI & Trí tuệ nhân tạo',
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
    labelVi: 'Cloud & Hạ tầng mạng',
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
    labelVi: 'Công cụ Lập trình & Code',
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
    id: 'brand',
    label: 'Brand & Company Logos',
    labelVi: 'Logo Thương hiệu',
    icon: 'hexagon',
    keywords: [
      'brand', 'brands', 'logo', 'logos', 'company', 'corporation', 'official',
      'entertainment', 'disney', 'marvel', 'pixar', 'hulu', 'espn', 'netflix', 'spotify',
      'twitch', 'steam', 'ubisoft', 'epic-games', 'playstation', 'xbox', 'nintendo',
      'warner', 'hbo', 'paramount', 'universal', 'plex', 'imdb', 'rottentomatoes'
    ],
  },
];

/**
 * Official 28 Thematic Categories (+ Popular) & their 108 Subcategories
 * Now 100% unified 1-to-1 with CATEGORY_DEFINITIONS (`appCategory: id`).
 */
const LORDICON_CATEGORIES = [
  {
    id: 'popular',
    label: 'Popular',
    labelVi: 'Phổ biến',
    appCategory: 'popular',
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
    appCategory: 'architecture-and-places',
    subcategories: ['architecture-and-places', 'building-elements', 'buildings', 'homes-and-storage', 'landmarks', 'public-spaces', 'urban'],
  },
  {
    id: 'business-and-finance',
    label: 'Business & Finance',
    labelVi: 'Kinh doanh & Tài chính',
    appCategory: 'business-and-finance',
    subcategories: ['business-and-finance', 'banking', 'charts-and-analytics', 'crypto', 'money'],
  },
  {
    id: 'celebrations',
    label: 'Celebrations',
    labelVi: 'Lễ kỷ niệm & Sự kiện',
    appCategory: 'celebrations',
    subcategories: ['celebrations', 'gift', 'holidays', 'party', 'wedding', 'awards'],
  },
  {
    id: 'characters-and-symbols',
    label: 'Characters & Symbols',
    labelVi: 'Ký tự & Biểu tượng',
    appCategory: 'characters-and-symbols',
    subcategories: ['characters-and-symbols', 'letters-and-numbers', 'symbols', 'logos'],
  },
  {
    id: 'communication',
    label: 'Communication',
    labelVi: 'Giao tiếp & Liên lạc',
    appCategory: 'communication',
    subcategories: ['communication', 'mail', 'messages', 'phone-and-calls'],
  },
  {
    id: 'culture',
    label: 'Culture',
    labelVi: 'Văn hóa & Tôn giáo',
    appCategory: 'culture',
    subcategories: ['culture', 'astrology', 'mythology-and-fantasy', 'religion'],
  },
  {
    id: 'design-and-editing',
    label: 'Design & Editing',
    labelVi: 'Thiết kế & Chỉnh sửa',
    appCategory: 'design-and-editing',
    subcategories: ['design-and-editing', 'art-supplies', 'editing-tools', 'shapes', 'art', 'design'],
  },
  {
    id: 'fashion-and-beauty',
    label: 'Fashion & Beauty',
    labelVi: 'Thời trang & Làm đẹp',
    appCategory: 'fashion-and-beauty',
    subcategories: ['fashion-and-beauty', 'beauty', 'clothing-and-accessories', 'hats-and-headwear', 'jewelry', 'shoes', 'looks'],
  },
  {
    id: 'files-and-folders',
    label: 'Files & Folders',
    labelVi: 'Tệp tin & Thư mục',
    appCategory: 'files-and-folders',
    subcategories: ['files-and-folders', 'file-types', 'files', 'folders'],
  },
  {
    id: 'finance-and-stats',
    label: 'Finance & Stats',
    labelVi: 'Tài chính & Thống kê',
    appCategory: 'finance-and-stats',
    subcategories: ['finance-and-stats', 'charts'],
  },
  {
    id: 'food-and-drink',
    label: 'Food & Drink',
    labelVi: 'Ẩm thực & Đồ uống',
    appCategory: 'food-and-drink',
    subcategories: ['food-and-drink', 'candies-and-desserts', 'desserts', 'drinks', 'fruits-and-vegetables', 'kitchen', 'meals', 'meat-and-fish'],
  },
  {
    id: 'games-and-toys',
    label: 'Games & Toys',
    labelVi: 'Trò chơi & Giải trí',
    appCategory: 'games-and-toys',
    subcategories: ['games-and-toys', 'board-games', 'casino-and-gambling', 'chess', 'toys', 'video-games'],
  },
  {
    id: 'health-and-medical',
    label: 'Health & Medical',
    labelVi: 'Y tế & Sức khỏe',
    appCategory: 'health-and-medical',
    subcategories: [
      'health-and-medical', 'ambulance', 'anatomy', 'dentistry', 'first-aid', 'hospital',
      'medical-equipment', 'medical-supplies', 'medicine', 'ophthalmology', 'wellness', 'body',
    ],
  },
  {
    id: 'household',
    label: 'Household',
    labelVi: 'Gia dụng & Nội thất',
    appCategory: 'household',
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
    appCategory: 'music-and-audio',
    subcategories: ['music-and-audio', 'audio-equipment', 'instruments', 'music-symbols'],
  },
  {
    id: 'nature-and-weather',
    label: 'Nature & Weather',
    labelVi: 'Thiên nhiên & Thời tiết',
    appCategory: 'nature-and-weather',
    subcategories: [
      'nature-and-weather', 'agriculture', 'camping', 'disasters', 'ecology',
      'gardening', 'landscapes', 'natural-forces', 'plants', 'weather',
    ],
  },
  {
    id: 'people',
    label: 'People',
    labelVi: 'Con người & Cảm xúc',
    appCategory: 'people',
    subcategories: [
      'people', 'actions', 'avatars', 'childhood', 'emoji', 'family',
      'family-and-kids', 'gestures', 'professions',
    ],
  },
  {
    id: 'photo-and-video',
    label: 'Photo & Video',
    labelVi: 'Nhiếp ảnh & Video',
    appCategory: 'photo-and-video',
    subcategories: ['photo-and-video', 'photography', 'video-and-film'],
  },
  {
    id: 'science-and-industry',
    label: 'Science & Industry',
    labelVi: 'Khoa học & Công nghiệp',
    appCategory: 'science-and-industry',
    subcategories: ['science-and-industry', 'astronomy-and-space', 'chemistry', 'construction', 'electricity', 'industry', 'mathematics', 'physics', 'science'],
  },
  {
    id: 'security-and-military',
    label: 'Security & Military',
    labelVi: 'Bảo mật & An ninh',
    appCategory: 'security-and-military',
    subcategories: ['security-and-military', 'law-and-crime', 'locks-and-shields', 'military', 'security', 'weapons'],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    labelVi: 'Mua sắm & Thương mại',
    appCategory: 'shopping',
    subcategories: ['shopping', 'cart-and-bags', 'payments', 'sales-and-discounts', 'shipping'],
  },
  {
    id: 'sports-and-fitness',
    label: 'Sports & Fitness',
    labelVi: 'Thể thao & Thể hình',
    appCategory: 'sports-and-fitness',
    subcategories: [
      'sports-and-fitness', 'fitness', 'fitness-and-gym', 'olympics', 'outdoor-sports',
      'sports', 'sports-equipment', 'swimming-and-diving', 'team-sports',
    ],
  },
  {
    id: 'tech-and-devices',
    label: 'Tech & Devices',
    labelVi: 'Công nghệ & Thiết bị',
    appCategory: 'tech-and-devices',
    subcategories: [
      'tech-and-devices', 'cloud', 'computers-and-peripherals', 'mobile',
      'network', 'networking', 'programming-and-ai', 'television',
    ],
  },
  {
    id: 'time-and-date',
    label: 'Time & Date',
    labelVi: 'Thời gian & Lịch',
    appCategory: 'time-and-date',
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
    appCategory: 'work-and-education',
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
      appCategory: lCat.id,
    };
  }
  return {
    lordiconCategory: 'interface',
    lordiconCategoryLabel: 'Interface',
    appCategory: 'interface',
  };
}

// Explicit mapping for rawCategory values from all sources into unified un-merged categories
const RAW_CATEGORY_MAP = {
  popular: 'popular',
  animation: 'popular',
  animated: 'popular',
  motion: 'popular',
  lordicon: 'popular',
  'animated icons': 'popular',
  spinners: 'interface',
  loaders: 'interface',
  meteocons: 'nature-and-weather',
  'line-md': 'interface',
  'svg-spinners': 'interface',

  // Animals
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

  // Nature & Weather (separated from Animals!)
  'nature-and-weather': 'nature-and-weather',
  agriculture: 'nature-and-weather',
  camping: 'nature-and-weather',
  disasters: 'nature-and-weather',
  ecology: 'nature-and-weather',
  gardening: 'nature-and-weather',
  landscapes: 'nature-and-weather',
  'natural-forces': 'nature-and-weather',
  plants: 'nature-and-weather',
  weather: 'nature-and-weather',
  nature: 'nature-and-weather',

  // Architecture & Places (separated from Household!)
  architecture: 'architecture-and-places',
  'architecture-and-places': 'architecture-and-places',
  'building-elements': 'architecture-and-places',
  buildings: 'architecture-and-places',
  'homes-and-storage': 'architecture-and-places',
  landmarks: 'architecture-and-places',
  'public-spaces': 'architecture-and-places',
  urban: 'architecture-and-places',

  // Household (separated from Architecture!)
  household: 'household',
  bathroom: 'household',
  bedroom: 'household',
  cleaning: 'household',
  decor: 'household',
  furniture: 'household',
  'furniture-and-decor': 'household',
  'home-appliances': 'household',
  'kitchen-and-appliances': 'household',
  hygiene: 'household',
  interior: 'household',
  lighting: 'household',
  tools: 'household',

  // Food & Drink
  food: 'food-and-drink',
  'food-and-drink': 'food-and-drink',
  'food platform': 'food-and-drink',
  'candies-and-desserts': 'food-and-drink',
  desserts: 'food-and-drink',
  drinks: 'food-and-drink',
  'fruits-and-vegetables': 'food-and-drink',
  kitchen: 'food-and-drink',
  meals: 'food-and-drink',
  'meat-and-fish': 'food-and-drink',

  // Health & Medical (separated from Sports & Games!)
  health: 'health-and-medical',
  'health-and-medical': 'health-and-medical',
  ambulance: 'health-and-medical',
  anatomy: 'health-and-medical',
  dentistry: 'health-and-medical',
  'first-aid': 'health-and-medical',
  hospital: 'health-and-medical',
  'medical-equipment': 'health-and-medical',
  'medical-supplies': 'health-and-medical',
  medicine: 'health-and-medical',
  ophthalmology: 'health-and-medical',
  wellness: 'health-and-medical',
  body: 'health-and-medical',

  // Sports & Fitness (separated from Health & Games!)
  'sports-and-fitness': 'sports-and-fitness',
  fitness: 'sports-and-fitness',
  'fitness-and-gym': 'sports-and-fitness',
  olympics: 'sports-and-fitness',
  'outdoor-sports': 'sports-and-fitness',
  sports: 'sports-and-fitness',
  'sports-equipment': 'sports-and-fitness',
  'swimming-and-diving': 'sports-and-fitness',
  'team-sports': 'sports-and-fitness',

  // Games & Toys (separated from Health & Sports!)
  'games-and-toys': 'games-and-toys',
  'board-games': 'games-and-toys',
  'casino-and-gambling': 'games-and-toys',
  chess: 'games-and-toys',
  toys: 'games-and-toys',
  'video-games': 'games-and-toys',
  gaming: 'games-and-toys',
  'gaming entertainment': 'games-and-toys',

  // Transport
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

  // AI
  ai: 'ai',
  'ai software': 'ai',
  'google ai': 'ai',
  'machine learning': 'ai',
  'artificial intelligence': 'ai',
  'programming-and-ai': 'ai',

  // Cloud
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

  // DevTools
  devtool: 'devtools',
  devtools: 'devtools',
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

  // Security & Military
  security: 'security-and-military',
  identity: 'security-and-military',
  'iot security': 'security-and-military',
  cybersecurity: 'security-and-military',
  privacy: 'security-and-military',
  'security-and-military': 'security-and-military',
  'locks-and-shields': 'security-and-military',
  'law-and-crime': 'security-and-military',
  military: 'security-and-military',
  weapons: 'security-and-military',

  // Business & Finance (separated from Shopping & Stats!)
  finance: 'business-and-finance',
  'crypto finance': 'business-and-finance',
  'finance software': 'business-and-finance',
  'payment finance': 'business-and-finance',
  blockchain: 'business-and-finance',
  crypto: 'business-and-finance',
  'business-and-finance': 'business-and-finance',
  business: 'business-and-finance',
  banking: 'business-and-finance',
  money: 'business-and-finance',

  // Finance & Stats
  'finance-and-stats': 'finance-and-stats',
  charts: 'finance-and-stats',
  'charts-and-analytics': 'finance-and-stats',
  analytics: 'finance-and-stats',

  // Shopping (separated from Finance!)
  'shopping platform': 'shopping',
  shopping: 'shopping',
  'cart-and-bags': 'shopping',
  payments: 'shopping',
  'sales-and-discounts': 'shopping',
  shipping: 'shopping',
  'e-commerce': 'shopping',
  ecommerce: 'shopping',

  // Design & Editing (separated from Photo/Video & Fashion!)
  design: 'design-and-editing',
  'design software': 'design-and-editing',
  'design-and-editing': 'design-and-editing',
  'art-supplies': 'design-and-editing',
  'editing-tools': 'design-and-editing',
  shapes: 'design-and-editing',
  art: 'design-and-editing',

  // Photo & Video (separated from Design!)
  'photo-and-video': 'photo-and-video',
  photography: 'photo-and-video',
  'video-and-film': 'photo-and-video',

  // Fashion & Beauty (separated from Design!)
  'fashion-and-beauty': 'fashion-and-beauty',
  beauty: 'fashion-and-beauty',
  'clothing-and-accessories': 'fashion-and-beauty',
  'hats-and-headwear': 'fashion-and-beauty',
  jewelry: 'fashion-and-beauty',
  shoes: 'fashion-and-beauty',
  looks: 'fashion-and-beauty',

  // Communication (separated from People, Celebrations, Culture!)
  social: 'communication',
  'social platform': 'communication',
  email: 'communication',
  'web email': 'communication',
  communication: 'communication',
  mail: 'communication',
  messages: 'communication',
  'phone-and-calls': 'communication',

  // People
  people: 'people',
  avatars: 'people',
  childhood: 'people',
  emoji: 'people',
  family: 'people',
  'family-and-kids': 'people',
  gestures: 'people',
  actions: 'people',
  professions: 'people',

  // Celebrations
  celebrations: 'celebrations',
  awards: 'celebrations',
  party: 'celebrations',
  gift: 'celebrations',
  holidays: 'celebrations',
  wedding: 'celebrations',

  // Culture
  culture: 'culture',
  astrology: 'culture',
  'mythology-and-fantasy': 'culture',
  religion: 'culture',

  // Files & Folders (separated from Time & Work!)
  'files-and-folders': 'files-and-folders',
  files: 'files-and-folders',
  'file-types': 'files-and-folders',
  folders: 'files-and-folders',

  // Time & Date
  'time-and-date': 'time-and-date',
  calendar: 'time-and-date',
  clocks: 'time-and-date',

  // Work & Education
  productivity: 'work-and-education',
  management: 'work-and-education',
  education: 'work-and-education',
  services: 'work-and-education',
  'work-and-education': 'work-and-education',
  books: 'work-and-education',
  stationery: 'work-and-education',
  work: 'work-and-education',

  // Tech & Devices (separated from Music & Science!)
  hardware: 'tech-and-devices',
  'hardware software': 'tech-and-devices',
  iot: 'tech-and-devices',
  'tech-and-devices': 'tech-and-devices',
  'computers-and-peripherals': 'tech-and-devices',
  mobile: 'tech-and-devices',
  television: 'tech-and-devices',

  // Music & Audio
  'music-and-audio': 'music-and-audio',
  'audio-equipment': 'music-and-audio',
  instruments: 'music-and-audio',
  'music-symbols': 'music-and-audio',

  // Science & Industry
  'science-and-industry': 'science-and-industry',
  'astronomy-and-space': 'science-and-industry',
  chemistry: 'science-and-industry',
  construction: 'science-and-industry',
  electricity: 'science-and-industry',
  industry: 'science-and-industry',
  mathematics: 'science-and-industry',
  physics: 'science-and-industry',
  science: 'science-and-industry',

  // Interface & Characters
  interface: 'interface',
  alerts: 'interface',
  arrows: 'interface',
  symbols: 'characters-and-symbols',
  'characters-and-symbols': 'characters-and-symbols',
  'letters-and-numbers': 'characters-and-symbols',

  // Brand
  brand: 'brand',
  logos: 'brand',
  entertainment: 'brand',
  'entertainment platform': 'brand',
  media: 'brand',
  'media entertainment': 'brand',
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

  if (isLordicon) {
    matchedCategory = resolveLordiconCategory(normalizedRawCat, slug, title).appCategory;
  } else {
    for (const matcher of COMPILED_CATEGORY_MATCHERS) {
      if (matcher.id === 'popular') {
        continue;
      }
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
  if (isPureAnimatedPack || isLordicon) {
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
