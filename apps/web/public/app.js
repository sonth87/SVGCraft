(() => {
  if (typeof window !== 'undefined') {
    if (window.__svgcraftInitialized) return;
    window.__svgcraftInitialized = true;
  }
  // ============================================================================
  // SVG & LUCIDE ICON REGISTRY (Zero Emoji Policy)
  // Combines clean Lucide strokes with bespoke multi-layered vector icons
  // ============================================================================
  const ICONS = {
    // Categories
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
    cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
    code: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>`,
    sliders: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>`,
    'pen-tool': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    wallet: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>`,
    'message-square': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>`,
    layers: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
    cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    hexagon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="3"/></svg>`,

    // Bespoke Style Icons (visualizing Outlined, Filled, Duotone, Multicolor, Monocolor)
    'style-outlined': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>`,
    'style-filled': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/></svg>`,
    'style-duotone': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="13" height="13" rx="3.5" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.6"/><rect x="8" y="8" width="13" height="13" rx="3.5" fill="currentColor"/></svg>`,
    'style-multicolor': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="5" fill="#f97316"/><circle cx="16" cy="8" r="5" fill="#6366f1"/><circle cx="8" cy="16" r="5" fill="#10b981"/><circle cx="16" cy="16" r="5" fill="#ec4899"/></svg>`,
    'style-monocolor': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/></svg>`,

    // Bespoke Icon Kind Icons
    'type-ui-icon': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><circle cx="6.5" cy="17.5" r="3.5"/></svg>`,
    'type-brand-logo': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    'type-architecture': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    'type-badge': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><circle cx="8" cy="12" r="2.5" fill="currentColor"/><path d="M13 12h6"/></svg>`,

    // Action & Framework Icons
    copy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    heartFilled: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    chevronLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    share: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    checkerboard: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/><rect x="3" y="3" width="9" height="9" fill="currentColor" fill-opacity="0.35" stroke="none"/><rect x="12" y="12" width="9" height="9" fill="currentColor" fill-opacity="0.35" stroke="none"/></svg>`,
    grid: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
    zoomIn: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
    zoomOut: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
    rotateCcw: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
    react: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="2" fill="currentColor"/><ellipse rx="10" ry="4.2" cx="12" cy="12"/><ellipse rx="10" ry="4.2" cx="12" cy="12" transform="rotate(60 12 12)"/><ellipse rx="10" ry="4.2" cx="12" cy="12" transform="rotate(120 12 12)"/></svg>`,
    vue: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h4l6 10.5L18 4h4L12 21 2 4z"/><path d="M6.5 4 12 13.5 17.5 4"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
    keylineGridOverlay: `<svg viewBox="0 0 24 24" class="stage-keyline-overlay" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" fill="none" stroke="currentColor" stroke-opacity="0.28" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" stroke-opacity="0.16" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" stroke-opacity="0.16" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <line x1="0" y1="0" x2="24" y2="24" stroke="currentColor" stroke-opacity="0.1" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <line x1="24" y1="0" x2="0" y2="24" stroke="currentColor" stroke-opacity="0.1" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <circle cx="12" cy="12" r="10" fill="none" stroke="#3b82f6" stroke-opacity="0.65" stroke-dasharray="2 1.5" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <rect x="3" y="3" width="18" height="18" fill="none" stroke="#f97316" stroke-opacity="0.65" stroke-dasharray="2 1.5" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <rect x="2" y="4" width="20" height="16" fill="none" stroke="#10b981" stroke-opacity="0.55" stroke-dasharray="2 1.5" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <rect x="4" y="2" width="16" height="20" fill="none" stroke="#10b981" stroke-opacity="0.55" stroke-dasharray="2 1.5" stroke-width="1" vector-effect="non-scaling-stroke"/>
    </svg>`,
  };

  // DOM References
  const searchBoxWrap = document.getElementById('searchBoxWrap');
  const searchInlineChips = document.getElementById('searchInlineChips');
  const searchInput = document.getElementById('searchInput');
  const searchFocusPopover = document.getElementById('searchFocusPopover');
  const searchPopoverContent = document.getElementById('searchPopoverContent');
  const sortSelect = document.getElementById('sortSelect');
  const btnReloadCatalog = document.getElementById('btnReloadCatalog');
  const reloadSpinIcon = document.getElementById('reloadSpinIcon');
  const reloadBtnText = document.getElementById('reloadBtnText');
  const btnCycleTone = document.getElementById('btnCycleTone');
  const toneLabel = document.getElementById('toneLabel');
  const btnToggleTheme = document.getElementById('btnToggleTheme');
  const themeIconWrap = document.getElementById('themeIconWrap');
  const themeTextLabel = document.getElementById('themeTextLabel');
  const logoResetBtn = document.getElementById('logoResetBtn');

  const countFavorites = document.getElementById('countFavorites');
  const navAllIcons = document.getElementById('navAllIcons');
  const navCollectionsDirectory = document.getElementById('navCollectionsDirectory');
  const sidebarCountCollections = document.getElementById('sidebarCountCollections');
  const navBrandsDirectory = document.getElementById('navBrandsDirectory');
  const sidebarCountBrands = document.getElementById('sidebarCountBrands');
  const navFavorites = document.getElementById('navFavorites');
  const sidebarCategories = document.getElementById('sidebarCategories');
  const btnResetCategory = document.getElementById('btnResetCategory');

  // Top Filter Dropdowns
  const dropdownStyle = document.getElementById('dropdownStyle');
  const btnTriggerStyle = document.getElementById('btnTriggerStyle');
  const labelTriggerStyle = document.getElementById('labelTriggerStyle');
  const filterStyleOptions = document.getElementById('filterStyleOptions');

  const dropdownIconType = document.getElementById('dropdownIconType');
  const btnTriggerIconType = document.getElementById('btnTriggerIconType');
  const labelTriggerIconType = document.getElementById('labelTriggerIconType');
  const filterIconTypeOptions = document.getElementById('filterIconTypeOptions');

  const dropdownCollections = document.getElementById('dropdownCollections');
  const btnTriggerCollections = document.getElementById('btnTriggerCollections');
  const labelTriggerCollections = document.getElementById('labelTriggerCollections');
  const badgeTotalCollections = document.getElementById('badgeTotalCollections');
  const colFilteredCount = document.getElementById('colFilteredCount');
  const collectionSearchInput = document.getElementById('collectionSearchInput');
  const filterCollectionOptions = document.getElementById('filterCollectionOptions');

  // Views & Grid
  const catalogView = document.getElementById('catalogView');
  const collectionView = document.getElementById('collectionView');
  const detailView = document.getElementById('detailView');
  const brandGlowBackdrop = document.getElementById('brandGlowBackdrop');
  const brandGlowOrb = document.getElementById('brandGlowOrb');

  const viewModeSwitcher = document.getElementById('viewModeSwitcher');
  const btnViewModeIcons = document.getElementById('btnViewModeIcons');
  const btnViewModeCollections = document.getElementById('btnViewModeCollections');
  const btnViewModeBrands = document.getElementById('btnViewModeBrands');
  const resultsUnitLabel = document.getElementById('resultsUnitLabel');

  const alphabetBar = document.getElementById('alphabetBar');
  const activeFiltersBar = document.getElementById('activeFiltersBar');
  const showingCount = document.getElementById('showingCount');
  const totalMatchedCount = document.getElementById('totalMatchedCount');
  const heroHeading = document.getElementById('heroHeading');
  const iconsGrid = document.getElementById('iconsGrid');
  const collectionsDirectoryGrid = document.getElementById('collectionsDirectoryGrid');
  const loadMoreWrap = document.getElementById('loadMoreWrap');
  const btnLoadMore = document.getElementById('btnLoadMore');
  const loadMoreLabel = document.getElementById('loadMoreLabel');
  const toastContainer = document.getElementById('toastContainer');

  const TONES = ['auto', 'dark', 'light', 'checker'];
  let currentToneIdx = 0;

  const PAGE_SIZE = 72;
  const COLLECTIONS_PAGE_SIZE = 36;
  let viewMode = 'icons'; // 'icons' | 'collections' | 'brands'
  let currentOffset = 0;
  let totalMatched = 0;
  let lastScrollFetchTs = 0;
  let activeIconsAbortController = null;
  let currentCollections = [];

  // Client-side in-memory LRU caches to eliminate duplicate API & SVG network requests
  const apiJsonCache = new Map();
  const svgTextCache = new Map();
  const MAX_CACHE_ENTRIES = 60;

  function setCacheEntry(map, key, val) {
    if (map.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = map.keys().next().value;
      map.delete(oldestKey);
    }
    map.set(key, val);
  }

  async function apiFetchJson(url, { signal, bypassCache = false } = {}) {
    if (!bypassCache && apiJsonCache.has(url)) {
      return apiJsonCache.get(url);
    }
    const res = await fetch(url, {
      signal,
      headers: {
        'X-SVGCraft-Client': 'web-v2',
        Accept: 'application/json',
      },
    });
    if (res.status === 429) {
      showToast('Bạn thao tác quá nhanh, vui lòng đợi vài giây...');
      throw new Error('Rate limited (429)');
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    setCacheEntry(apiJsonCache, url, data);
    return data;
  }

  async function fetchSvgTextCached(url) {
    if (!url) return '';
    if (svgTextCache.has(url)) {
      return svgTextCache.get(url);
    }
    const res = await fetch(url);
    if (res.status === 429) {
      showToast('Bạn thao tác quá nhanh, vui lòng đợi vài giây...');
      return '';
    }
    if (!res.ok) return '';
    const text = await res.text();
    if (text && text.includes('<svg')) {
      setCacheEntry(svgTextCache, url, text);
    }
    return text;
  }

  let filters = {
    q: '',
    category: '',
    styleType: '',
    iconType: '',
    site: '',
    collection: '',
    letter: '',
    sort: 'recent',
    onlyFavorites: false,
  };

  let favorites = new Set(JSON.parse(localStorage.getItem('svg_hub_favs') || '[]'));
  let catalogSummary = null;
  let currentItems = [];
  let activeDetailIconKey = null;
  let activeCollectionState = null;

  function saveFavorites() {
    localStorage.setItem('svg_hub_favs', JSON.stringify(Array.from(favorites)));
    countFavorites.textContent = favorites.size;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBytes(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} B`;
    return `${(n / 1024).toFixed(1)} KB`;
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `${ICONS.check}<span>${escapeHtml(msg)}</span>`;
    toastContainer.appendChild(t);
    setTimeout(() => {
      t.remove();
    }, 2200);
  }

  function getCategoryIconSvg(iconKeyOrId) {
    const mapByCatId = {
      ai: ICONS.sparkles,
      cloud: ICONS.cloud,
      devtools: ICONS.code,
      interface: ICONS.sliders,
      design: ICONS['pen-tool'],
      security: ICONS.shield,
      finance: ICONS.wallet,
      social: ICONS['message-square'],
      productivity: ICONS.layers,
      hardware: ICONS.cpu,
      brand: ICONS.hexagon,
    };
    return ICONS[iconKeyOrId] || mapByCatId[iconKeyOrId] || ICONS.hexagon;
  }

  function getStyleIconSvg(styleId) {
    return ICONS[`style-${styleId}`] || ICONS['style-outlined'];
  }

  function getIconTypeSvg(typeId) {
    return ICONS[`type-${typeId}`] || ICONS['type-ui-icon'];
  }

  // Pretty-print single-line or compact SVG/XML into clean indented lines
  function prettyFormatSvgXml(rawXml = '') {
    const cleaned = String(rawXml)
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
    if (!cleaned) return '';
    // Put newlines between adjacent tags while collapsing excessive blank lines
    const normalized = cleaned
      .replace(/>\s+</g, '>\n<')
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let indent = 0;
    const out = [];
    for (const line of normalized) {
      const isClosing = /^<\//.test(line);
      const isSelfClosing = /\/>$/.test(line) || /^<(\?xml|!DOCTYPE|!--)/i.test(line);
      const hasInlineClose = /^<([a-zA-Z0-9:_-]+)\b[^>]*>.*<\/\1>$/.test(line);

      if (isClosing && indent > 0) {
        indent -= 1;
      }
      out.push(`${'  '.repeat(indent)}${line}`);
      if (!isClosing && !isSelfClosing && !hasInlineClose && /^<[a-zA-Z0-9:_-]+/.test(line)) {
        indent += 1;
      }
    }
    return out.join('\n');
  }

  // Syntax Highlighter (thesvg.org / Shiki-style HTML token spans + line numbers)
  function highlightSingleLine(rawLine, tab = 'svg') {
    if (tab === 'datauri') {
      const m = rawLine.match(/^(data:image\/svg\+xml;utf8,)(.*)$/);
      if (m) {
        return `<span class="tok-kw">${escapeHtml(m[1])}</span><span class="tok-str">${escapeHtml(m[2])}</span>`;
      }
      return `<span class="tok-str">${escapeHtml(rawLine)}</span>`;
    }

    const tokenRe =
      /(<!--[\s\S]*?-->)|("[^"]*"|'[^']*')|(<\/?[a-zA-Z0-9:_-]+|\/>|>)|(\b(?:export|function|return|const|let|var|from|import|default|template|script|style)\b)|(\b[a-zA-Z_:][a-zA-Z0-9_:.-]*(?==))|(\{\.\.\.props\})|(\b\d+(?:\.\d+)?\b)/g;

    let result = '';
    let lastIdx = 0;
    let match;
    while ((match = tokenRe.exec(rawLine)) !== null) {
      if (match.index > lastIdx) {
        result += escapeHtml(rawLine.slice(lastIdx, match.index));
      }
      const [full, comment, str, tagBracket, kw, attr, spreadProps, num] = match;
      if (comment) {
        result += `<span class="tok-comm">${escapeHtml(full)}</span>`;
      } else if (str) {
        result += `<span class="tok-str">${escapeHtml(full)}</span>`;
      } else if (tagBracket) {
        if (full === '>' || full === '/>') {
          result += `<span class="tok-punc">${escapeHtml(full)}</span>`;
        } else {
          const isClose = full.startsWith('</');
          const prefix = isClose ? '</' : '<';
          const tagName = full.slice(prefix.length);
          result += `<span class="tok-punc">${escapeHtml(prefix)}</span><span class="tok-tag">${escapeHtml(tagName)}</span>`;
        }
      } else if (kw) {
        result += `<span class="tok-kw">${escapeHtml(full)}</span>`;
      } else if (attr) {
        result += `<span class="tok-attr">${escapeHtml(full)}</span>`;
      } else if (spreadProps) {
        result += `<span class="tok-punc">{</span><span class="tok-kw">...</span><span class="tok-fn">props</span><span class="tok-punc">}</span>`;
      } else if (num) {
        result += `<span class="tok-num">${escapeHtml(full)}</span>`;
      } else {
        result += escapeHtml(full);
      }
      lastIdx = tokenRe.lastIndex;
    }
    if (lastIdx < rawLine.length) {
      result += escapeHtml(rawLine.slice(lastIdx));
    }
    return result;
  }

  function renderHighlightedCodeBlock(codeText = '', tab = 'svg') {
    const lines = String(codeText || '').split('\n');
    return `<div class="code-lines-table">${lines
      .map(
        (line, idx) =>
          `<div class="code-line"><span class="code-ln">${idx + 1}</span><span class="code-lc">${highlightSingleLine(line, tab) || ' '}</span></div>`
      )
      .join('')}</div>`;
  }

  // Code Generators (SVG, React JSX, Vue SFC, HTML <img>, CSS/Data URI)
  function toPascalCaseComponentName(slug = 'Icon') {
    const base = String(slug)
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
    const safe = /^[0-9]/.test(base) ? `Svg${base}` : base || 'Custom';
    return safe.endsWith('Icon') ? safe : `${safe}Icon`;
  }

  function svgToJsx(svgText, componentName = 'SvgIcon') {
    const cleaned = prettyFormatSvgXml(svgText)
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/stroke-dasharray=/g, 'strokeDasharray=')
      .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/clip-path=/g, 'clipPath=')
      .replace(/fill-opacity=/g, 'fillOpacity=')
      .replace(/stroke-opacity=/g, 'strokeOpacity=')
      .replace(/stop-color=/g, 'stopColor=')
      .replace(/stop-opacity=/g, 'stopOpacity=')
      .replace(/xmlns:xlink=/g, 'xmlnsXlink=')
      .replace(/\bclass=/g, 'className=')
      .replace(/<svg\b/, '<svg {...props}')
      .split('\n')
      .map((l) => `    ${l}`)
      .join('\n');
    return `export function ${componentName}(props) {\n  return (\n${cleaned}\n  );\n}`;
  }

  function svgToVue(svgText) {
    const cleaned = prettyFormatSvgXml(svgText)
      .replace(/<svg\b/, '<svg v-bind="$attrs"')
      .split('\n')
      .map((l) => `  ${l}`)
      .join('\n');
    return `<template>\n${cleaned}\n</template>`;
  }

  function svgToHtmlImg(assetUrl, title = 'Icon', width = 24, height = 24) {
    const absUrl = `${window.location.origin}${assetUrl}`;
    return `<img\n  src="${absUrl}"\n  alt="${title}"\n  width="${width}"\n  height="${height}"\n  loading="lazy"\n/>`;
  }

  function svgToDataUri(svgText) {
    const cleaned = svgText
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
    return `data:image/svg+xml;utf8,${encodeURIComponent(cleaned)}`;
  }

  // Export SVG string to PNG via HTML5 Canvas (32px - 512px)
  async function exportSvgToPng(svgText, sizePx = 128, fileNameBase = 'icon', copyToClipboard = false) {
    return new Promise((resolve, reject) => {
      let preparedSvg = svgText.trim();
      if (!/\bxmlns=/.test(preparedSvg)) {
        preparedSvg = preparedSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      // Ensure explicit width/height on root svg for crisp rasterization
      if (/\bwidth=["'][^"']*["']/.test(preparedSvg)) {
        preparedSvg = preparedSvg.replace(/\bwidth=["'][^"']*["']/, `width="${sizePx}"`);
      } else {
        preparedSvg = preparedSvg.replace('<svg', `<svg width="${sizePx}"`);
      }
      if (/\bheight=["'][^"']*["']/.test(preparedSvg)) {
        preparedSvg = preparedSvg.replace(/\bheight=["'][^"']*["']/, `height="${sizePx}"`);
      } else {
        preparedSvg = preparedSvg.replace('<svg', `<svg height="${sizePx}"`);
      }

      const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = sizePx;
          canvas.height = sizePx;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, sizePx, sizePx);
          ctx.drawImage(img, 0, 0, sizePx, sizePx);
          URL.revokeObjectURL(url);

          canvas.toBlob(async (pngBlob) => {
            if (!pngBlob) {
              reject(new Error('Không thể tạo PNG'));
              return;
            }
            if (copyToClipboard && navigator.clipboard && window.ClipboardItem) {
              try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
                showToast(`Đã copy ảnh PNG (${sizePx}×${sizePx}px) vào Clipboard`);
                resolve();
                return;
              } catch {
                // Fallback to download if clipboard image write fails
              }
            }
            const dlUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = dlUrl;
            a.download = `${fileNameBase}-${sizePx}px.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(dlUrl), 1000);
            showToast(`Đã tải xuống ${fileNameBase}-${sizePx}px.png`);
            resolve();
          }, 'image/png');
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    });
  }

  // ============================================================================
  // ALPHABET BAR
  // ============================================================================
  function initAlphabetBar() {
    const chars = ['', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
    alphabetBar.innerHTML = chars
      .map((ch) => {
        const label = ch === '' ? 'All' : ch;
        const isActive = filters.letter === ch;
        return `<button type="button" class="alpha-btn ${isActive ? 'active' : ''}" data-letter="${ch}">${label}</button>`;
      })
      .join('');
  }

  alphabetBar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-letter]');
    if (!btn) return;
    filters.letter = btn.dataset.letter;
    initAlphabetBar();
    syncCatalogUrl(true);
    loadCatalogData(true);
  });

  // ============================================================================
  // DROPDOWN POPOVERS MANAGEMENT
  // ============================================================================
  const allDropdowns = [dropdownStyle, dropdownIconType, dropdownCollections];

  function closeAllDropdowns() {
    allDropdowns.forEach((d) => {
      if (!d) return;
      d.classList.remove('open');
      const trig = d.querySelector('.filter-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleDropdown(targetDropdown) {
    const isOpen = targetDropdown.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      targetDropdown.classList.add('open');
      const trig = targetDropdown.querySelector('.filter-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'true');
      if (targetDropdown === dropdownCollections) {
        setTimeout(() => collectionSearchInput.focus(), 30);
      }
    }
  }

  btnTriggerStyle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(dropdownStyle);
  });

  btnTriggerIconType.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(dropdownIconType);
  });

  btnTriggerCollections.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(dropdownCollections);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-dropdown')) {
      closeAllDropdowns();
    }
  });

  document.querySelectorAll('[data-clear-dropdown]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.clearDropdown;
      filters[key] = '';
      if (key === 'collection') {
        collectionSearchInput.value = '';
        renderCollectionsDropdownList('');
      }
      closeAllDropdowns();
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
    });
  });

  // Render Collections inside the searchable dropdown
  function renderCollectionsDropdownList(searchQuery = '') {
    const allCols = catalogSummary?.collections || [];
    const q = searchQuery.trim().toLowerCase();
    const matched = q
      ? allCols.filter(
          (c) =>
            (c.name && c.name.toLowerCase().includes(q)) ||
            (c.slug && c.slug.toLowerCase().includes(q))
        )
      : allCols;

    colFilteredCount.textContent = matched.length;
    const slice = matched.slice(0, 150);

    if (!slice.length) {
      filterCollectionOptions.innerHTML = `<div style="padding:14px 10px;text-align:center;color:var(--text-dim);font-size:0.78rem">Không tìm thấy bộ sưu tập phù hợp</div>`;
      return;
    }

    filterCollectionOptions.innerHTML = slice
      .map(
        (col) => `
        <button type="button" class="dropdown-option ${(activeCollectionState?.slug || filters.collection) === col.slug ? 'active' : ''}" data-filter-col="${escapeHtml(col.slug)}">
          <span class="dropdown-option-left">
            <span class="nav-icon">${ICONS.folder}</span>
            <span class="dropdown-option-title" title="${escapeHtml(col.name)}">${escapeHtml(col.name)}</span>
          </span>
          <span class="nav-count">${col.count}</span>
        </button>
      `
      )
      .join('');
  }

  collectionSearchInput.addEventListener('input', () => {
    renderCollectionsDropdownList(collectionSearchInput.value);
  });

  // ============================================================================
  // LOAD CATALOG SUMMARY & POPULATE SIDEBAR + FILTER DROPDOWNS
  // ============================================================================
  async function loadSummary(bypassCache = false) {
    catalogSummary = await apiFetchJson('/api/catalog/summary', { bypassCache });

    countFavorites.textContent = favorites.size;
    const totalColsCount = catalogSummary.totalCollections || (catalogSummary.collections || []).length;
    badgeTotalCollections.textContent = totalColsCount;
    if (sidebarCountCollections) {
      sidebarCountCollections.textContent = totalColsCount.toLocaleString();
    }
    if (sidebarCountBrands) {
      sidebarCountBrands.textContent = (catalogSummary.totalBrands || 49).toLocaleString();
    }

    // 1. Left Sidebar: Categories only (with custom SVG icons)
    sidebarCategories.innerHTML = (catalogSummary.categories || [])
      .map(
        (c) => `
        <button type="button" class="nav-item ${filters.category === c.id ? 'active' : ''}" data-filter-cat="${escapeHtml(c.id)}">
          <span class="nav-item-left">
            <span class="nav-icon">${getCategoryIconSvg(c.id || c.icon)}</span>
            <span>${escapeHtml(c.label)}</span>
          </span>
          <span class="nav-count">${(c.count || 0).toLocaleString()}</span>
        </button>
      `
      )
      .join('');

    // 2. Top Dropdown: Styles
    filterStyleOptions.innerHTML = (catalogSummary.styles || [])
      .map(
        (s) => `
        <button type="button" class="dropdown-option ${filters.styleType === s.id ? 'active' : ''}" data-filter-style="${escapeHtml(s.id)}">
          <span class="dropdown-option-left">
            <span class="nav-icon">${getStyleIconSvg(s.id)}</span>
            <span class="dropdown-option-title">${escapeHtml(s.label)}</span>
          </span>
          <span class="nav-count">${(s.count || 0).toLocaleString()}</span>
        </button>
      `
      )
      .join('');

    // 3. Top Dropdown: Icon Types
    filterIconTypeOptions.innerHTML = (catalogSummary.iconTypes || [])
      .map(
        (t) => `
        <button type="button" class="dropdown-option ${filters.iconType === t.id ? 'active' : ''}" data-filter-type="${escapeHtml(t.id)}">
          <span class="dropdown-option-left">
            <span class="nav-icon">${getIconTypeSvg(t.id)}</span>
            <span class="dropdown-option-title">${escapeHtml(t.label)}</span>
          </span>
          <span class="nav-count">${(t.count || 0).toLocaleString()}</span>
        </button>
      `
      )
      .join('');

    // 4. Top Dropdown: Collections
    renderCollectionsDropdownList(collectionSearchInput.value);

    updateNavActiveStates();
  }

  function updateNavActiveStates() {
    const isAllIcons =
      viewMode === 'icons' &&
      !activeCollectionState &&
      !filters.category &&
      !filters.styleType &&
      !filters.iconType &&
      !filters.collection &&
      !filters.onlyFavorites;

    navAllIcons.classList.toggle('active', isAllIcons);
    if (navCollectionsDirectory) {
      navCollectionsDirectory.classList.toggle(
        'active',
        viewMode === 'collections' && !activeCollectionState && !filters.onlyFavorites
      );
    }
    if (navBrandsDirectory) {
      navBrandsDirectory.classList.toggle(
        'active',
        viewMode === 'brands' && !activeCollectionState && !filters.onlyFavorites
      );
    }
    navFavorites.classList.toggle('active', filters.onlyFavorites);
    btnResetCategory.style.display = filters.category ? 'inline-block' : 'none';

    const isDirMode = viewMode === 'collections' || viewMode === 'brands';
    if (btnViewModeIcons) {
      btnViewModeIcons.classList.toggle('active', viewMode === 'icons');
      btnViewModeIcons.setAttribute('aria-selected', String(viewMode === 'icons'));
    }
    if (btnViewModeCollections) {
      btnViewModeCollections.classList.toggle('active', viewMode === 'collections');
      btnViewModeCollections.setAttribute('aria-selected', String(viewMode === 'collections'));
    }
    if (btnViewModeBrands) {
      btnViewModeBrands.classList.toggle('active', viewMode === 'brands');
      btnViewModeBrands.setAttribute('aria-selected', String(viewMode === 'brands'));
    }
    if (resultsUnitLabel) {
      resultsUnitLabel.textContent =
        viewMode === 'brands' ? 'thương hiệu' : viewMode === 'collections' ? 'bộ sưu tập' : 'icons';
    }
    if (iconsGrid && collectionsDirectoryGrid) {
      iconsGrid.style.display = isDirMode ? 'none' : 'grid';
      collectionsDirectoryGrid.style.display = isDirMode ? 'grid' : 'none';
    }

    sidebarCategories.querySelectorAll('[data-filter-cat]').forEach((el) => {
      el.classList.toggle('active', el.dataset.filterCat === filters.category);
    });

    filterStyleOptions.querySelectorAll('[data-filter-style]').forEach((el) => {
      el.classList.toggle('active', el.dataset.filterStyle === filters.styleType);
    });

    filterIconTypeOptions.querySelectorAll('[data-filter-type]').forEach((el) => {
      el.classList.toggle('active', el.dataset.filterType === filters.iconType);
    });

    const activeColSlug = activeCollectionState?.slug || filters.collection;
    filterCollectionOptions.querySelectorAll('[data-filter-col]').forEach((el) => {
      el.classList.toggle('active', el.dataset.filterCol === activeColSlug);
    });

    // Update top filter dropdown button labels & active states
    const selectedStyleObj = (catalogSummary?.styles || []).find((s) => s.id === filters.styleType);
    labelTriggerStyle.textContent = selectedStyleObj ? selectedStyleObj.label.split(' (')[0] : 'Phong cách';
    btnTriggerStyle.classList.toggle('has-value', Boolean(filters.styleType));

    const selectedTypeObj = (catalogSummary?.iconTypes || []).find((t) => t.id === filters.iconType);
    labelTriggerIconType.textContent = selectedTypeObj ? selectedTypeObj.label : 'Loại Icon';
    btnTriggerIconType.classList.toggle('has-value', Boolean(filters.iconType));

    const selectedColObj = (catalogSummary?.collections || []).find((c) => c.slug === activeColSlug);
    labelTriggerCollections.textContent = selectedColObj
      ? selectedColObj.name.length > 20
        ? selectedColObj.name.slice(0, 18) + '…'
        : selectedColObj.name
      : 'Bộ sưu tập';
    btnTriggerCollections.classList.toggle('has-value', Boolean(activeColSlug));

    renderActiveFiltersChips();
  }

  function renderSearchInlineChips() {
    if (!searchInlineChips) return;
    const inlineTags = [];
    if (filters.category) {
      const catObj = (catalogSummary?.categories || []).find((c) => c.id === filters.category);
      inlineTags.push({
        key: 'category',
        label: catObj ? catObj.label.split(' & ')[0] : filters.category,
        icon: getCategoryIconSvg(filters.category),
      });
    }
    if (filters.iconType) {
      const tpObj = (catalogSummary?.iconTypes || []).find((t) => t.id === filters.iconType);
      inlineTags.push({
        key: 'iconType',
        label: tpObj ? tpObj.label : filters.iconType,
        icon: getIconTypeSvg(filters.iconType),
      });
    }
    if (filters.styleType) {
      const stObj = (catalogSummary?.styles || []).find((s) => s.id === filters.styleType);
      inlineTags.push({
        key: 'styleType',
        label: stObj ? stObj.label.split(' (')[0] : filters.styleType,
        icon: getStyleIconSvg(filters.styleType),
      });
    }
    if (filters.collection) {
      const colObj = (catalogSummary?.collections || []).find((c) => c.slug === filters.collection);
      const colName = colObj ? colObj.name : filters.collection;
      inlineTags.push({
        key: 'collection',
        label: colName.length > 16 ? colName.slice(0, 15) + '…' : colName,
        icon: ICONS.folder,
      });
    }

    searchInlineChips.innerHTML = inlineTags
      .map(
        (t) => `
        <span class="search-inline-chip">
          <span class="icon-inline" style="width:12px;height:12px">${t.icon}</span>
          <span>${escapeHtml(t.label)}</span>
          <button type="button" data-remove-inline-tag="${t.key}" title="Gỡ tag lọc">${ICONS.close}</button>
        </span>
      `
      )
      .join('');
  }

  function renderSearchPopoverContent() {
    if (!searchPopoverContent || !catalogSummary) return;

    const categories = catalogSummary.categories || [];
    const iconTypes = catalogSummary.iconTypes || [];
    const styles = catalogSummary.styles || [];
    const topCols = (catalogSummary.collections || []).slice(0, 8);

    searchPopoverContent.innerHTML = `
      <div class="search-pop-group">
        <div class="search-pop-title">
          <span>Loại Icon &amp; Brand (Icon Kind)</span>
          <span style="font-weight:500;text-transform:none">Gắn tag để lọc nhanh</span>
        </div>
        <div class="search-pop-pills">
          ${iconTypes
            .map(
              (t) => `
              <button type="button" class="search-pop-pill ${filters.iconType === t.id ? 'active' : ''}" data-pop-tag-type="iconType" data-pop-tag-val="${escapeHtml(t.id)}">
                <span class="icon-inline">${getIconTypeSvg(t.id)}</span>
                <span>${escapeHtml(t.label)}</span>
                <span class="pill-count">${(t.count || 0).toLocaleString()}</span>
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      <div class="search-pop-group">
        <div class="search-pop-title">
          <span>Chủ đề (Categories)</span>
        </div>
        <div class="search-pop-pills">
          ${categories
            .map(
              (c) => `
              <button type="button" class="search-pop-pill ${filters.category === c.id ? 'active' : ''}" data-pop-tag-type="category" data-pop-tag-val="${escapeHtml(c.id)}">
                <span class="icon-inline">${getCategoryIconSvg(c.id)}</span>
                <span>${escapeHtml(c.label)}</span>
                <span class="pill-count">${(c.count || 0).toLocaleString()}</span>
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      <div class="search-pop-group">
        <div class="search-pop-title">
          <span>Phong cách (Styles)</span>
        </div>
        <div class="search-pop-pills">
          ${styles
            .map(
              (s) => `
              <button type="button" class="search-pop-pill ${filters.styleType === s.id ? 'active' : ''}" data-pop-tag-type="styleType" data-pop-tag-val="${escapeHtml(s.id)}">
                <span class="icon-inline">${getStyleIconSvg(s.id)}</span>
                <span>${escapeHtml(s.label.split(' (')[0])}</span>
                <span class="pill-count">${(s.count || 0).toLocaleString()}</span>
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      ${
        topCols.length
          ? `
        <div class="search-pop-group">
          <div class="search-pop-title">
            <span>Bộ sưu tập nổi bật (Mở màn hình Bộ sưu tập)</span>
          </div>
          <div class="search-pop-pills">
            ${topCols
              .map(
                (col) => `
                <button type="button" class="search-pop-pill" data-pop-open-col="${escapeHtml(col.slug)}">
                  <span class="icon-inline">${ICONS.folder}</span>
                  <span>${escapeHtml(col.name)}</span>
                  <span class="pill-count">${col.count}</span>
                </button>
              `
              )
              .join('')}
          </div>
        </div>
      `
          : ''
      }
    `;
  }

  function renderActiveFiltersChips() {
    renderSearchInlineChips();
    renderSearchPopoverContent();

    const chips = [];
    if (filters.category) {
      const catObj = (catalogSummary?.categories || []).find((c) => c.id === filters.category);
      chips.push({ key: 'category', label: `Chủ đề: ${catObj ? catObj.label : filters.category}` });
    }
    if (filters.styleType) {
      const stObj = (catalogSummary?.styles || []).find((s) => s.id === filters.styleType);
      chips.push({ key: 'styleType', label: `Phong cách: ${stObj ? stObj.label : filters.styleType}` });
    }
    if (filters.iconType) {
      const tpObj = (catalogSummary?.iconTypes || []).find((t) => t.id === filters.iconType);
      chips.push({ key: 'iconType', label: `Loại: ${tpObj ? tpObj.label : filters.iconType}` });
    }
    if (filters.collection) {
      const colObj = (catalogSummary?.collections || []).find((c) => c.slug === filters.collection);
      chips.push({ key: 'collection', label: `Bộ sưu tập: ${colObj ? colObj.name : filters.collection}` });
    }
    if (filters.letter) chips.push({ key: 'letter', label: `Chữ cái: ${filters.letter}` });
    if (filters.q) chips.push({ key: 'q', label: `Từ khóa: "${filters.q}"` });
    if (filters.onlyFavorites) chips.push({ key: 'onlyFavorites', label: 'Đã yêu thích' });

    if (chips.length === 0) {
      activeFiltersBar.style.display = 'none';
      heroHeading.textContent =
        viewMode === 'brands'
          ? 'Khám phá Logo & Hệ sinh thái Thương hiệu.'
          : viewMode === 'collections'
            ? 'Khám phá Bộ sưu tập Vector theo Chủ đề & Phong cách.'
            : '500.000+ Vector Icons. Inspect. Customize. Ship.';
      return;
    }

    activeFiltersBar.style.display = 'flex';
    activeFiltersBar.innerHTML =
      chips
        .map(
          (c) => `
        <span class="filter-tag">
          <span>${escapeHtml(c.label)}</span>
          <button type="button" data-clear-key="${c.key}" title="Bỏ bộ lọc">${ICONS.close}</button>
        </span>
      `
        )
        .join('') +
      `<button type="button" class="pill-btn" id="btnClearAllFilters" style="font-size:0.74rem;padding:4px 10px">Xóa tất cả bộ lọc</button>`;
  }

  // ============================================================================
  // URL SYNCHRONIZATION (CATALOG, COLLECTION, DETAIL) FOR F5 / RELOAD PERSISTENCE
  // ============================================================================
  function buildCatalogUrlFromFilters() {
    const params = new URLSearchParams();
    if (viewMode === 'collections' || viewMode === 'brands') {
      params.set('view', viewMode);
    }
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.styleType) params.set('style', filters.styleType);
    if (filters.iconType) params.set('type', filters.iconType);
    if (filters.collection) params.set('collection', filters.collection);
    if (filters.letter) params.set('letter', filters.letter);
    if (filters.sort && filters.sort !== 'recent') params.set('sort', filters.sort);
    if (filters.onlyFavorites) params.set('fav', '1');
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  }

  function syncCatalogUrl(push = true) {
    const targetUrl = buildCatalogUrlFromFilters();
    const currentFull = `${window.location.pathname}${window.location.search}`;
    if (currentFull === targetUrl) return;
    if (push) {
      window.history.pushState({ view: 'catalog', viewMode, filters: { ...filters } }, '', targetUrl);
    } else {
      window.history.replaceState({ view: 'catalog', viewMode, filters: { ...filters } }, '', targetUrl);
    }
  }

  function syncCollectionUrl(push = false) {
    if (!activeCollectionState) return;
    const basePath = `/collection/${encodeURIComponent(activeCollectionState.slug)}`;
    const params = new URLSearchParams();
    if (activeCollectionState.q) params.set('q', activeCollectionState.q);
    if (activeCollectionState.styleType) params.set('style', activeCollectionState.styleType);
    if (activeCollectionState.sort && activeCollectionState.sort !== 'az') {
      params.set('sort', activeCollectionState.sort);
    }
    const qs = params.toString();
    const targetUrl = qs ? `${basePath}?${qs}` : basePath;
    const currentFull = `${window.location.pathname}${window.location.search}`;
    if (currentFull === targetUrl) return;
    if (push) {
      window.history.pushState(
        { view: 'collection', collectionSlug: activeCollectionState.slug },
        '',
        targetUrl
      );
    } else {
      window.history.replaceState(
        { view: 'collection', collectionSlug: activeCollectionState.slug },
        '',
        targetUrl
      );
    }
  }

  function readCatalogFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const urlView = params.get('view');
    viewMode = urlView === 'collections' || urlView === 'brands' ? urlView : 'icons';
    filters = {
      q: params.get('q') || '',
      category: params.get('category') || '',
      styleType: params.get('style') || '',
      iconType: params.get('type') || '',
      site: params.get('site') || '',
      collection: params.get('collection') || '',
      letter: params.get('letter') || '',
      sort: params.get('sort') || 'recent',
      onlyFavorites: params.get('fav') === '1',
    };
    searchInput.value = filters.q;
    sortSelect.value = filters.sort;
    initAlphabetBar();
    updateNavActiveStates();
  }

  // Search box inline tags & focus popover interactions
  if (searchInput && searchFocusPopover) {
    searchInput.addEventListener('focus', () => {
      renderSearchPopoverContent();
      searchFocusPopover.classList.add('open');
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && searchInput.value === '') {
        // Remove last active filter tag on Backspace when input is empty
        const order = ['collection', 'styleType', 'iconType', 'category'];
        for (const k of order) {
          if (filters[k]) {
            filters[k] = '';
            updateNavActiveStates();
            showCatalogView(true);
            loadCatalogData(true);
            break;
          }
        }
      }
    });

    searchInlineChips.addEventListener('click', (e) => {
      const rmBtn = e.target.closest('[data-remove-inline-tag]');
      if (!rmBtn) return;
      e.stopPropagation();
      const key = rmBtn.dataset.removeInlineTag;
      filters[key] = '';
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
      searchInput.focus();
    });

    searchFocusPopover.addEventListener('click', (e) => {
      e.stopPropagation();
      const tagBtn = e.target.closest('[data-pop-tag-type]');
      if (tagBtn) {
        const type = tagBtn.dataset.popTagType;
        const val = tagBtn.dataset.popTagVal;
        filters[type] = filters[type] === val ? '' : val;
        updateNavActiveStates();
        showCatalogView(true);
        loadCatalogData(true);
        searchInput.focus();
        return;
      }

      const colBtn = e.target.closest('[data-pop-open-col]');
      if (colBtn) {
        const raw = colBtn.dataset.popOpenCol;
        const c = raw.includes(':') ? raw.split(':')[1] : raw;
        searchFocusPopover.classList.remove('open');
        openCollectionPage('any', c, true);
      }
    });

    document.addEventListener('click', (e) => {
      if (searchBoxWrap && !searchBoxWrap.contains(e.target)) {
        searchFocusPopover.classList.remove('open');
      }
    });
  }

  activeFiltersBar.addEventListener('click', (e) => {
    const clearKeyBtn = e.target.closest('[data-clear-key]');
    if (clearKeyBtn) {
      const k = clearKeyBtn.dataset.clearKey;
      if (k === 'onlyFavorites') filters.onlyFavorites = false;
      else filters[k] = '';
      if (k === 'q') searchInput.value = '';
      if (k === 'letter') initAlphabetBar();
      updateNavActiveStates();
      syncCatalogUrl(true);
      loadCatalogData(true);
      return;
    }
    if (e.target.closest('#btnClearAllFilters')) {
      resetAllFilters();
    }
  });

  function resetAllFilters(keepViewMode = false) {
    if (!keepViewMode) {
      viewMode = 'icons';
    }
    filters = {
      q: '',
      category: '',
      styleType: '',
      iconType: '',
      site: '',
      collection: '',
      letter: '',
      sort: 'recent',
      onlyFavorites: false,
    };
    sortSelect.value = 'recent';
    searchInput.value = '';
    collectionSearchInput.value = '';
    initAlphabetBar();
    updateNavActiveStates();
    showCatalogView(true);
    loadCatalogData(true);
  }

  function setCatalogViewMode(nextMode) {
    if (nextMode !== 'icons' && nextMode !== 'collections' && nextMode !== 'brands') return;
    if ((nextMode === 'collections' || nextMode === 'brands') && filters.onlyFavorites) {
      filters.onlyFavorites = false;
    }
    viewMode = nextMode;
    updateNavActiveStates();
    showCatalogView(true);
    loadCatalogData(true);
  }

  if (viewModeSwitcher) {
    viewModeSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-view-mode]');
      if (!btn) return;
      setCatalogViewMode(btn.dataset.viewMode);
    });
  }

  // ============================================================================
  // VIEW SWITCHING (CATALOG VIEW vs COLLECTION VIEW vs DETAIL VIEW)
  // ============================================================================
  function showCatalogView(pushHistory = false) {
    activeDetailIconKey = null;
    activeCollectionState = null;
    detailView.style.display = 'none';
    collectionView.style.display = 'none';
    catalogView.style.display = 'block';
    brandGlowBackdrop.classList.remove('active');
    document.title = 'SVGCraft — Vector Icon Library, Inspector & Code Studio';
    updateNavActiveStates();
    if (pushHistory) {
      syncCatalogUrl(true);
      const isDirMode = viewMode === 'collections' || viewMode === 'brands';
      const activeGrid = isDirMode ? collectionsDirectoryGrid : iconsGrid;
      if (activeGrid && !activeGrid.children.length) {
        loadCatalogData(true);
      }
    }
  }

  let isLoadingMore = false;

  async function loadCatalogData(resetOffset = true, opts = {}) {
    if (viewMode === 'collections' || viewMode === 'brands') {
      return loadCollectionsDirectory(resetOffset, opts);
    }
    return loadIcons(resetOffset, opts);
  }

  // Load SVGRepo-style Collections or Brands Directory from API
  async function loadCollectionsDirectory(resetOffset = true, { bypassCache = false } = {}) {
    if (!resetOffset && isLoadingMore) return;
    const isBrands = viewMode === 'brands';
    const unitNoun = isBrands ? 'thương hiệu' : 'bộ sưu tập';
    if (resetOffset) {
      currentOffset = 0;
      if (activeIconsAbortController) {
        activeIconsAbortController.abort();
      }
      activeIconsAbortController = new AbortController();
    } else {
      isLoadingMore = true;
      loadMoreLabel.textContent = `Đang tự động tải thêm ${unitNoun}...`;
    }

    const signal = resetOffset && activeIconsAbortController ? activeIconsAbortController.signal : undefined;

    try {
      const params = new URLSearchParams({
        mode: isBrands ? 'brands' : 'collections',
        q: filters.q,
        category: filters.category,
        styleType: filters.styleType,
        iconType: filters.iconType,
        letter: filters.letter,
        sort: filters.sort === 'recent' ? 'count' : filters.sort,
        offset: String(currentOffset),
        limit: String(COLLECTIONS_PAGE_SIZE),
      });

      const data = await apiFetchJson(`/api/catalog/collections?${params.toString()}`, { signal, bypassCache });
      const items = data.items || [];
      totalMatched = data.total || items.length;

      if (resetOffset) {
        currentCollections = items;
        renderCollectionsDirectoryGrid(currentCollections, false);
      } else {
        currentCollections = [...currentCollections, ...items];
        renderCollectionsDirectoryGrid(items, true);
      }

      showingCount.textContent = currentCollections.length.toLocaleString();
      totalMatchedCount.textContent = totalMatched.toLocaleString();

      if (currentCollections.length < totalMatched) {
        loadMoreWrap.style.display = 'flex';
        loadMoreLabel.textContent = `Cuộn xuống để tải thêm (${currentCollections.length.toLocaleString()} / ${totalMatched.toLocaleString()} ${unitNoun})`;
      } else {
        loadMoreWrap.style.display = 'none';
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    } finally {
      isLoadingMore = false;
    }
  }

  function buildCollectionDirectoryCardsHtml(cols) {
    return cols
      .map((col) => {
        const catObj = (catalogSummary?.categories || []).find((c) => c.id === col.primaryCategory);
        const catLabel = catObj ? catObj.label.split(' & ')[0] : col.primaryCategory || 'General';
        const samples = (col.sampleIcons || []).slice(0, 8);
        const cellsHtml = [];
        for (let i = 0; i < 8; i += 1) {
          const ic = samples[i];
          if (ic) {
            cellsHtml.push(`
              <div class="col-dir-thumb-cell" title="${escapeHtml(ic.title || ic.slug)}">
                <img src="${escapeHtml(ic.assetUrl)}" alt="${escapeHtml(ic.title || ic.slug)}" loading="lazy" decoding="async" />
              </div>
            `);
          } else {
            cellsHtml.push(`<div class="col-dir-thumb-cell" style="opacity:0.25"></div>`);
          }
        }

        return `
          <article class="col-dir-card" data-dir-open-col="${escapeHtml(col.slug)}">
            <div class="col-dir-preview-grid">
              ${cellsHtml.join('')}
            </div>
            <div class="col-dir-info">
              <div class="col-dir-header-row">
                <div class="col-dir-title" title="${escapeHtml(col.name)}">${escapeHtml(col.name)}</div>
                <span class="col-dir-count-pill">${(col.count || 0).toLocaleString()} icons</span>
              </div>
              <div class="col-dir-badges">
                <span class="col-dir-badge">
                  ${getCategoryIconSvg(col.primaryCategory)}
                  <span>${escapeHtml(catLabel)}</span>
                </span>
                <span class="col-dir-badge">
                  ${getStyleIconSvg(col.primaryStyle)}
                  <span>${escapeHtml(col.primaryStyle || 'outlined')}</span>
                </span>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderCollectionsDirectoryGrid(cols, append = false) {
    if (!collectionsDirectoryGrid) return;
    const isBrands = viewMode === 'brands';
    if (!append && !cols.length) {
      collectionsDirectoryGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:56px 20px;color:var(--text-muted);border:1px dashed var(--border-subtle);border-radius:16px">
          <div style="display:inline-flex;padding:12px;border-radius:12px;background:var(--bg-card);margin-bottom:10px;color:var(--brand-orange)">
            ${isBrands ? ICONS.hexagon : ICONS.folder}
          </div>
          <p style="font-size:1rem;font-weight:600;color:var(--text-main);margin-bottom:6px">Không tìm thấy ${
            isBrands ? 'Thương hiệu' : 'Bộ sưu tập'
          } nào khớp bộ lọc</p>
          <p style="font-size:0.83rem;margin-bottom:16px">Hãy thử chọn chủ đề khác hoặc đặt lại bộ lọc để xem toàn bộ danh sách.</p>
          <button type="button" class="pill-btn active" id="btnEmptyColResetFilters">Đặt lại bộ lọc</button>
        </div>
      `;
      const emptyReset = document.getElementById('btnEmptyColResetFilters');
      if (emptyReset) emptyReset.addEventListener('click', () => resetAllFilters(true));
      return;
    }

    if (append) {
      if (cols.length) {
        collectionsDirectoryGrid.insertAdjacentHTML('beforeend', buildCollectionDirectoryCardsHtml(cols));
      }
      return;
    }

    collectionsDirectoryGrid.innerHTML = buildCollectionDirectoryCardsHtml(cols);
  }

  if (collectionsDirectoryGrid) {
    collectionsDirectoryGrid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-dir-open-col]');
      if (!card) return;
      const slug = card.dataset.dirOpenCol;
      openCollectionPage('any', slug, true);
    });
  }

  // Load icons from API (supports resetOffset=true for new filter or resetOffset=false for infinite scroll append)
  async function loadIcons(resetOffset = true, { bypassCache = false } = {}) {
    if (!resetOffset && isLoadingMore) return;
    if (resetOffset) {
      currentOffset = 0;
      if (activeIconsAbortController) {
        activeIconsAbortController.abort();
      }
      activeIconsAbortController = new AbortController();
    } else {
      isLoadingMore = true;
      loadMoreLabel.textContent = 'Đang tự động tải thêm icon...';
    }

    const signal = resetOffset && activeIconsAbortController ? activeIconsAbortController.signal : undefined;

    try {
      const params = new URLSearchParams({
        q: filters.q,
        category: filters.category,
        styleType: filters.styleType,
        iconType: filters.iconType,
        site: filters.site,
        collection: filters.collection,
        letter: filters.letter,
        sort: filters.sort,
        offset: String(currentOffset),
        limit: String(PAGE_SIZE),
      });

      const data = await apiFetchJson(`/api/catalog/icons?${params.toString()}`, { signal, bypassCache });
      let items = data.items || [];
      totalMatched = data.total || items.length;

      if (filters.onlyFavorites) {
        items = items.filter((ic) => {
          const cleanKey = `${ic.collectionSlug}:${ic.id || ic.slug}`;
          const legacyKey = `${ic.site}:${ic.collectionSlug}:${ic.id || ic.slug}`;
          return favorites.has(cleanKey) || favorites.has(legacyKey);
        });
        totalMatched = items.length;
      }

      if (resetOffset) {
        currentItems = items;
        renderIconsGrid(currentItems, false);
      } else {
        currentItems = [...currentItems, ...items];
        renderIconsGrid(items, true);
      }

      showingCount.textContent = currentItems.length.toLocaleString();
      totalMatchedCount.textContent =
        !filters.category &&
        !filters.styleType &&
        !filters.iconType &&
        !filters.collection &&
        !filters.letter &&
        !filters.q &&
        !filters.onlyFavorites
          ? '500.000+'
          : totalMatched.toLocaleString();

      if (!filters.onlyFavorites && currentItems.length < totalMatched) {
        loadMoreWrap.style.display = 'flex';
        loadMoreLabel.textContent = `Cuộn xuống để tự động tải thêm (${currentItems.length.toLocaleString()} / ${totalMatched.toLocaleString()} icons)`;
      } else {
        loadMoreWrap.style.display = 'none';
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    } finally {
      isLoadingMore = false;
    }
  }

  function triggerLoadNextBatch() {
    const now = Date.now();
    if (
      now - lastScrollFetchTs < 650 ||
      isLoadingMore ||
      activeDetailIconKey !== null ||
      activeCollectionState !== null ||
      filters.onlyFavorites
    ) {
      return;
    }
    if (viewMode === 'collections' || viewMode === 'brands') {
      if (currentCollections.length >= totalMatched) return;
      lastScrollFetchTs = now;
      currentOffset += COLLECTIONS_PAGE_SIZE;
      loadCollectionsDirectory(false);
      return;
    }
    if (currentItems.length >= totalMatched) return;
    lastScrollFetchTs = now;
    currentOffset += PAGE_SIZE;
    loadIcons(false);
  }

  btnLoadMore.addEventListener('click', () => {
    triggerLoadNextBatch();
  });

  // Automatic Infinite Scroll via IntersectionObserver
  if ('IntersectionObserver' in window && loadMoreWrap) {
    const infiniteObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            triggerLoadNextBatch();
          }
        }
      },
      { root: null, rootMargin: '420px 0px', threshold: 0.01 }
    );
    infiniteObserver.observe(loadMoreWrap);
  }

  function buildIconCardsHtml(items) {
    return items
      .map((ic) => {
        const cleanKey = `${ic.collectionSlug}:${ic.id || ic.slug}`;
        const legacyKey = `${ic.site}:${ic.collectionSlug}:${ic.id || ic.slug}`;
        const isFav = favorites.has(cleanKey) || favorites.has(legacyKey);
        const variantCount = Object.keys(ic.variants || {}).length;

        return `
          <article class="icon-card" data-icon-card="${escapeHtml(cleanKey)}">
            <div class="icon-preview-area" data-open-detail="${escapeHtml(cleanKey)}">
              <div class="card-badges-top">
                <span class="micro-badge">${escapeHtml(ic.styleType)}</span>
                ${
                  variantCount > 1
                    ? `<span class="micro-badge" title="Có ${variantCount} biến thể">${variantCount}v</span>`
                    : `<span class="micro-badge">${escapeHtml(ic.gridSize || '24x24')}</span>`
                }
              </div>
              <img src="${escapeHtml(ic.assetUrl)}" alt="${escapeHtml(ic.title)}" loading="lazy" decoding="async" />
            </div>

            <div class="icon-info-area" data-open-detail="${escapeHtml(cleanKey)}">
              <div class="icon-name" title="${escapeHtml(ic.title)}">${escapeHtml(ic.title || ic.slug)}</div>
              <div class="icon-sub">${escapeHtml(ic.category)} · ${escapeHtml(ic.collectionName)}</div>
            </div>

            <div class="icon-actions-bar">
              <button type="button" class="act-btn" data-copy-svg="${escapeHtml(ic.assetUrl)}" title="Copy mã SVG gốc">SVG</button>
              <button type="button" class="act-btn" data-copy-jsx="${escapeHtml(ic.assetUrl)}" data-title="${escapeHtml(ic.slug)}" title="Copy React JSX">JSX</button>
              <a href="${escapeHtml(ic.assetUrl)}" download="${escapeHtml(ic.fileName)}" class="act-btn" title="Tải file .svg">${ICONS.download}</a>
              <button type="button" class="act-btn ${isFav ? 'fav-active' : ''}" data-toggle-fav="${escapeHtml(cleanKey)}" title="Yêu thích">
                ${isFav ? ICONS.heartFilled : ICONS.heart}
              </button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderIconsGrid(items, append = false) {
    if (!append && !items.length) {
      iconsGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:56px 20px;color:var(--text-muted);border:1px dashed var(--border-subtle);border-radius:16px">
          <div style="display:inline-flex;padding:12px;border-radius:12px;background:var(--bg-card);margin-bottom:10px;color:var(--brand-orange)">
            ${ICONS.sparkles}
          </div>
          <p style="font-size:1rem;font-weight:600;color:var(--text-main);margin-bottom:6px">Không tìm thấy icon SVG nào khớp bộ lọc</p>
          <p style="font-size:0.83rem;margin-bottom:16px">Hãy thử xóa bớt từ khóa hoặc đặt lại bộ lọc để xem toàn bộ kho lưu trữ.</p>
          <button type="button" class="pill-btn active" id="btnEmptyResetFilters">Đặt lại bộ lọc</button>
        </div>
      `;
      const emptyReset = document.getElementById('btnEmptyResetFilters');
      if (emptyReset) emptyReset.addEventListener('click', () => resetAllFilters());
      return;
    }

    if (append) {
      if (items.length) {
        iconsGrid.insertAdjacentHTML('beforeend', buildIconCardsHtml(items));
      }
      return;
    }

    iconsGrid.innerHTML = buildIconCardsHtml(items);
  }

  // Shared handler for card actions (Copy SVG, Copy JSX, Fav, Open Detail) inside any grid
  async function handleIconCardGridClick(e) {
    const copySvgBtn = e.target.closest('[data-copy-svg]');
    if (copySvgBtn) {
      e.stopPropagation();
      const url = copySvgBtn.dataset.copySvg;
      const svgText = await fetchSvgTextCached(url);
      if (!svgText) return;
      await navigator.clipboard.writeText(svgText);
      showToast('Đã copy mã SVG vào Clipboard');
      return;
    }

    const copyJsxBtn = e.target.closest('[data-copy-jsx]');
    if (copyJsxBtn) {
      e.stopPropagation();
      const url = copyJsxBtn.dataset.copyJsx;
      const compName = toPascalCaseComponentName(copyJsxBtn.dataset.title || 'Icon');
      const svgText = await fetchSvgTextCached(url);
      if (!svgText) return;
      await navigator.clipboard.writeText(svgToJsx(svgText, compName));
      showToast(`Đã copy component <${compName} /> (JSX)`);
      return;
    }

    const favBtn = e.target.closest('[data-toggle-fav]');
    if (favBtn) {
      e.stopPropagation();
      const key = favBtn.dataset.toggleFav;
      if (favorites.has(key)) {
        favorites.delete(key);
        favBtn.classList.remove('fav-active');
        favBtn.innerHTML = ICONS.heart;
      } else {
        favorites.add(key);
        favBtn.classList.add('fav-active');
        favBtn.innerHTML = ICONS.heartFilled;
      }
      saveFavorites();
      if (filters.onlyFavorites && !activeCollectionState) loadCatalogData(true);
      return;
    }

    const openTrigger = e.target.closest('[data-open-detail]');
    if (openTrigger) {
      const parts = openTrigger.dataset.openDetail.split(':');
      if (parts.length >= 3) {
        openDetailPage(parts[0], parts[1], parts[2], true);
      } else {
        openDetailPage('any', parts[0], parts[1], true);
      }
    }
  }

  iconsGrid.addEventListener('click', handleIconCardGridClick);

  // ============================================================================
  // DEDICATED COLLECTION VIEW SCREEN RENDERER
  // ============================================================================
  async function openCollectionPage(site, collectionSlug, pushHistory = true, initialParams = {}) {
    const safeSite = 'any';
    const initQ = initialParams.q || '';
    const initStyle = initialParams.styleType || '';
    const initSort = initialParams.sort || 'az';

    const queryInit = new URLSearchParams({
      q: initQ,
      styleType: initStyle,
      sort: initSort,
      limit: String(PAGE_SIZE),
      offset: '0',
    });

    let data;
    try {
      data = await apiFetchJson(
        `/api/catalog/collection/${encodeURIComponent(safeSite)}/${encodeURIComponent(collectionSlug)}?${queryInit.toString()}`
      );
    } catch {
      showToast('Không tìm thấy bộ sưu tập này');
      return;
    }
    const col = data.collection;
    activeDetailIconKey = null;
    activeCollectionState = {
      site: 'any',
      slug: col.slug,
      name: col.name,
      q: initQ,
      styleType: initStyle,
      sort: initSort,
      offset: 0,
      total: data.total || 0,
      items: data.items || [],
      isLoading: false,
    };

    syncCollectionUrl(pushHistory);
    updateNavActiveStates();

    document.title = `${col.name} — Bộ sưu tập SVG Icons | SVGCraft`;
    catalogView.style.display = 'none';
    detailView.style.display = 'none';
    collectionView.style.display = 'block';
    brandGlowBackdrop.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const authorLabel =
      !col.author || /^(thesvg|svg\s*repo)$/i.test(String(col.author).trim()) ? 'Open Source' : col.author;

    collectionView.innerHTML = `
      <div class="detail-topbar">
        <div class="detail-breadcrumbs">
          <button type="button" class="btn-back-catalog" id="btnColBackCatalog">
            ${ICONS.arrowLeft}
            <span>Quay lại Kho lưu trữ</span>
          </button>
          <span class="crumb-sep">${ICONS.chevronRight}</span>
          <span style="color:var(--text-muted)">Bộ sưu tập</span>
          <span class="crumb-sep">${ICONS.chevronRight}</span>
          <span class="crumb-current">${escapeHtml(col.name)}</span>
        </div>
        <div class="detail-nav-actions">
          <button type="button" class="icon-btn-square" id="btnColShare" title="Copy liên kết bộ sưu tập">
            ${ICONS.share}
          </button>
        </div>
      </div>

      <div class="collection-hero-banner">
        <div class="collection-hero-top">
          <div class="collection-title-wrap">
            <div class="collection-folder-badge">
              ${ICONS.folder}
            </div>
            <div>
              <h1 class="collection-h1">${escapeHtml(col.name)}</h1>
              <div class="collection-meta-pills">
                <span class="col-stat-pill">Số lượng: <strong>${(col.totalIconsInCollection || data.total || 0).toLocaleString()} icons</strong></span>
                <span class="col-stat-pill">Giấy phép: <strong>${escapeHtml(col.license || 'MIT / CC0')}</strong></span>
                <span class="col-stat-pill">Tác giả: <strong>${escapeHtml(authorLabel)}</strong></span>
                ${
                  col.gridSizes && col.gridSizes.length
                    ? `<span class="col-stat-pill">Grid: <strong>${escapeHtml(col.gridSizes.slice(0, 3).join(', '))}</strong></span>`
                    : ''
                }
              </div>
            </div>
          </div>
        </div>

        <div class="collection-toolbar-bar">
          <div class="col-local-search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
            </svg>
            <input type="search" id="colLocalSearchInput" value="${escapeHtml(initQ)}" placeholder="Tìm icon trong bộ sưu tập ${escapeHtml(col.name)}..." autocomplete="off" />
          </div>

          <div class="col-filter-pills-group" id="colStyleFilterGroup">
            <button type="button" class="pill-btn ${!initStyle ? 'active' : ''}" data-col-style="">
              <span>Tất cả (${(col.totalIconsInCollection || 0).toLocaleString()})</span>
            </button>
            ${(col.stylesBreakdown || [])
              .map(
                (st) => `
                <button type="button" class="pill-btn ${initStyle === st.id ? 'active' : ''}" data-col-style="${escapeHtml(st.id)}">
                  ${getStyleIconSvg(st.id)}
                  <span>${escapeHtml(st.id)} (${st.count})</span>
                </button>
              `
              )
              .join('')}
          </div>

          <div style="display:flex;align-items:center;gap:10px">
            <div class="sort-select-wrap">
              <select id="colSortSelect" aria-label="Sắp xếp trong bộ sưu tập">
                <option value="az" ${initSort === 'az' ? 'selected' : ''}>Tên A → Z</option>
                <option value="za" ${initSort === 'za' ? 'selected' : ''}>Tên Z → A</option>
                <option value="recent" ${initSort === 'recent' ? 'selected' : ''}>Mới cập nhật</option>
              </select>
            </div>
            <div class="results-counter">
              Hiển thị <strong id="colShowingCount">${activeCollectionState.items.length}</strong> / <strong id="colTotalCount">${activeCollectionState.total}</strong>
            </div>
          </div>
        </div>
      </div>

      <div id="colIconsGrid" class="icons-grid">
        ${buildIconCardsHtml(activeCollectionState.items)}
      </div>

      <div id="colLoadMoreWrap" class="load-more-wrap" style="display:${activeCollectionState.items.length < activeCollectionState.total ? 'flex' : 'none'}">
        <button type="button" id="btnColLoadMore" class="btn-load-more">
          <span>Tải thêm icon trong bộ sưu tập (${activeCollectionState.items.length} / ${activeCollectionState.total})</span>
        </button>
      </div>
    `;

    // Keep currentItems synced with collection items so Prev/Next inside Detail works seamlessly
    currentItems = activeCollectionState.items;

    const colIconsGrid = document.getElementById('colIconsGrid');
    const colLocalSearchInput = document.getElementById('colLocalSearchInput');
    const colStyleFilterGroup = document.getElementById('colStyleFilterGroup');
    const colSortSelect = document.getElementById('colSortSelect');
    const colShowingCount = document.getElementById('colShowingCount');
    const colTotalCount = document.getElementById('colTotalCount');
    const colLoadMoreWrap = document.getElementById('colLoadMoreWrap');
    const btnColLoadMore = document.getElementById('btnColLoadMore');

    async function fetchCollectionFiltered(resetOffset = true) {
      if (!activeCollectionState || activeCollectionState.isLoading) return;
      activeCollectionState.isLoading = true;
      if (resetOffset) activeCollectionState.offset = 0;

      syncCollectionUrl(false);

      try {
        const params = new URLSearchParams({
          q: activeCollectionState.q,
          styleType: activeCollectionState.styleType,
          sort: activeCollectionState.sort,
          offset: String(activeCollectionState.offset),
          limit: String(PAGE_SIZE),
        });
        const d = await apiFetchJson(
          `/api/catalog/collection/${encodeURIComponent(activeCollectionState.site)}/${encodeURIComponent(activeCollectionState.slug)}?${params.toString()}`
        );
        const newItems = d.items || [];
        activeCollectionState.total = d.total || 0;

        if (resetOffset) {
          activeCollectionState.items = newItems;
          if (!newItems.length) {
            colIconsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--text-muted);border:1px dashed var(--border-subtle);border-radius:14px">Không tìm thấy icon nào khớp từ khóa trong bộ sưu tập này.</div>`;
          } else {
            colIconsGrid.innerHTML = buildIconCardsHtml(newItems);
          }
        } else {
          activeCollectionState.items = [...activeCollectionState.items, ...newItems];
          colIconsGrid.insertAdjacentHTML('beforeend', buildIconCardsHtml(newItems));
        }

        currentItems = activeCollectionState.items;
        colShowingCount.textContent = activeCollectionState.items.length.toLocaleString();
        colTotalCount.textContent = activeCollectionState.total.toLocaleString();

        if (activeCollectionState.items.length < activeCollectionState.total) {
          colLoadMoreWrap.style.display = 'flex';
          btnColLoadMore.innerHTML = `<span>Tải thêm icon trong bộ sưu tập (${activeCollectionState.items.length} / ${activeCollectionState.total})</span>`;
        } else {
          colLoadMoreWrap.style.display = 'none';
        }
      } finally {
        if (activeCollectionState) activeCollectionState.isLoading = false;
      }
    }

    document.getElementById('btnColBackCatalog').addEventListener('click', () => {
      showCatalogView(true);
    });

    document.getElementById('btnColShare').addEventListener('click', async () => {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Đã copy đường dẫn bộ sưu tập');
    });

    let colSearchTimer = null;
    colLocalSearchInput.addEventListener('input', () => {
      clearTimeout(colSearchTimer);
      colSearchTimer = setTimeout(() => {
        if (!activeCollectionState) return;
        const nextQ = colLocalSearchInput.value.trim();
        if (nextQ === activeCollectionState.q) return;
        activeCollectionState.q = nextQ;
        fetchCollectionFiltered(true);
      }, 280);
    });

    colStyleFilterGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-col-style]');
      if (!btn || !activeCollectionState) return;
      activeCollectionState.styleType = btn.dataset.colStyle;
      colStyleFilterGroup.querySelectorAll('[data-col-style]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      fetchCollectionFiltered(true);
    });

    colSortSelect.addEventListener('change', () => {
      if (!activeCollectionState) return;
      activeCollectionState.sort = colSortSelect.value;
      fetchCollectionFiltered(true);
    });

    btnColLoadMore.addEventListener('click', () => {
      if (!activeCollectionState || activeCollectionState.items.length >= activeCollectionState.total) return;
      activeCollectionState.offset += PAGE_SIZE;
      fetchCollectionFiltered(false);
    });

    colIconsGrid.addEventListener('click', handleIconCardGridClick);
  }

  // ============================================================================
  // THESVG.ORG-STYLE FULL DETAIL PAGE RENDERER
  // ============================================================================
  function updateBrandGlow(hexColor) {
    const color = hexColor && /^#[0-9a-fA-F]{3,8}$/.test(hexColor) ? hexColor : '#f97316';
    brandGlowOrb.style.background = `radial-gradient(ellipse 62% 95% at 55% 0%, ${color}40, transparent 72%)`;
    brandGlowBackdrop.classList.toggle('active', activeDetailIconKey !== null);
  }

  async function openDetailPage(site, collectionSlug, idOrSlug, pushHistory = true) {
    let data;
    try {
      data = await apiFetchJson(
        `/api/catalog/icon/any/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(idOrSlug)}`
      );
    } catch {
      showToast('Không tìm thấy dữ liệu chi tiết cho icon này');
      return;
    }

    const { icon, svgVariantsContent = {}, variantAssetUrls = {}, recommendations = {} } = data;
    const favKey = `${icon.collectionSlug}:${icon.id || icon.slug}`;
    const legacyFavKey = `${icon.site}:${icon.collectionSlug}:${icon.id || icon.slug}`;
    activeDetailIconKey = favKey;

    if (pushHistory) {
      const targetUrl = `/icon/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(idOrSlug)}`;
      if (`${window.location.pathname}${window.location.search}` !== targetUrl) {
        window.history.pushState({ view: 'detail', collectionSlug, idOrSlug }, '', targetUrl);
      }
    }

    document.title = `${icon.title || icon.slug} SVG Icon — SVGCraft`;
    catalogView.style.display = 'none';
    collectionView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const variantKeys = Object.keys(svgVariantsContent).length
      ? Object.keys(svgVariantsContent)
      : Object.keys(variantAssetUrls).length
        ? Object.keys(variantAssetUrls)
        : ['default'];
    let activeVariant = variantKeys[0] || 'default';

    if (!svgVariantsContent[activeVariant] && !data.rawSvg) {
      try {
        const fallbackUrl = variantAssetUrls[activeVariant] || icon.assetUrl;
        if (fallbackUrl) {
          const fetchedSvg = await fetchSvgTextCached(fallbackUrl);
          if (fetchedSvg && fetchedSvg.includes('<svg')) {
            svgVariantsContent[activeVariant] = fetchedSvg;
            data.rawSvg = fetchedSvg;
          }
        }
      } catch {
        // Ignore network error
      }
    }

    let activeCodeTab = 'svg';

    // Initialize stageTone from the global topbar previewTone setting
    const globalTone = document.body.dataset.previewTone || 'auto';
    let stageTone = globalTone === 'auto' ? 'checker' : globalTone;

    let showKeylineGrid = false;
    const BASE_STAGE_SIZE = 180;
    let zoomScale = 1;
    let panX = 0;
    let panY = 0;
    let customColor = null;

    const primaryHex = (icon.colorPalette && icon.colorPalette[0]) || '#f97316';
    updateBrandGlow(primaryHex);

    // Find prev/next icon in currentItems for quick keyboard/button navigation
    const currentIdx = currentItems.findIndex(
      (it) => `${it.collectionSlug}:${it.id || it.slug}` === favKey
    );
    const prevItem = currentIdx > 0 ? currentItems[currentIdx - 1] : null;
    const nextItem = currentIdx >= 0 && currentIdx < currentItems.length - 1 ? currentItems[currentIdx + 1] : null;

    const catObj = (catalogSummary?.categories || []).find((c) => c.id === icon.category);
    const catLabel = catObj ? catObj.label : icon.category;

    function getActiveRawSvg() {
      const baseSvg = svgVariantsContent[activeVariant] || data.rawSvg || '';
      if (!customColor) return baseSvg;
      // Apply custom color override to SVG string
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = baseSvg;
      const svgEl = tempDiv.querySelector('svg');
      if (!svgEl) return baseSvg;
      svgEl.style.color = customColor;
      svgEl.querySelectorAll('path, circle, rect, polygon, polyline, line, ellipse').forEach((shape) => {
        const f = shape.getAttribute('fill');
        const s = shape.getAttribute('stroke');
        if (s && s !== 'none') shape.setAttribute('stroke', customColor);
        if (!s && (!f || f !== 'none')) shape.setAttribute('fill', customColor);
      });
      return tempDiv.innerHTML;
    }

    function getActiveAssetUrl() {
      return variantAssetUrls[activeVariant] || icon.assetUrl;
    }

    function getFormattedCodeForTab(tab) {
      const currentSvg = getActiveRawSvg();
      const compName = toPascalCaseComponentName(icon.slug || icon.title);
      switch (tab) {
        case 'jsx':
          return svgToJsx(currentSvg, compName);
        case 'vue':
          return svgToVue(currentSvg);
        case 'html':
          return svgToHtmlImg(getActiveAssetUrl(), icon.title || icon.slug, icon.width || 24, icon.height || 24);
        case 'datauri':
          return svgToDataUri(currentSvg);
        case 'svg':
        default:
          return prettyFormatSvgXml(currentSvg);
      }
    }

    function getLangBadgeForTab(tab) {
      const map = { svg: 'XML / SVG', jsx: 'JSX / TSX', vue: 'Vue SFC', html: 'HTML', datauri: 'Data URI' };
      return map[tab] || 'CODE';
    }

    function renderMiniCardsSection(list) {
      if (!list || !list.length) {
        return `<div style="color:var(--text-dim);font-size:0.82rem;padding:12px 0">Chưa có thêm icon trong nhóm này.</div>`;
      }
      return `
        <div class="rec-strip">
          ${list
            .map(
              (item) => `
              <div class="rec-mini-card" data-switch-icon="${escapeHtml(item.collectionSlug)}:${escapeHtml(item.id || item.slug)}">
                <img src="${escapeHtml(item.assetUrl)}" alt="${escapeHtml(item.title)}" loading="lazy" />
                <div style="font-size:0.76rem;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-main)">${escapeHtml(item.title || item.slug)}</div>
                <div style="font-size:0.66rem;color:var(--text-dim)">${escapeHtml(item.category)} · ${escapeHtml(item.styleType)}</div>
              </div>
            `
            )
            .join('')}
        </div>
      `;
    }

    const isFav = favorites.has(favKey) || favorites.has(legacyFavKey);
    const paletteColors = icon.colorPalette && icon.colorPalette.length ? icon.colorPalette : [];

    detailView.innerHTML = `
      <!-- Top Breadcrumb & Navigation Bar -->
      <div class="detail-topbar">
        <div class="detail-breadcrumbs">
          <button type="button" class="btn-back-catalog" id="btnBackToCatalog">
            ${ICONS.arrowLeft}
            <span>Quay lại</span>
          </button>
          <button type="button" class="crumb-btn" data-crumb-cat="${escapeHtml(icon.category)}">
            ${escapeHtml(catLabel)}
          </button>
          <span class="crumb-sep">${ICONS.chevronRight}</span>
          <button type="button" class="crumb-btn" data-open-col="${escapeHtml(icon.collectionSlug)}">
            ${escapeHtml(icon.collectionName)}
          </button>
          <span class="crumb-sep">${ICONS.chevronRight}</span>
          <span class="crumb-current">${escapeHtml(icon.title || icon.slug)}</span>
        </div>

        <div class="detail-nav-actions">
          <button type="button" class="icon-btn-square" id="btnDetailPrev" ${prevItem ? '' : 'disabled'} title="Icon trước đó (←)">
            ${ICONS.chevronLeft}
          </button>
          <button type="button" class="icon-btn-square" id="btnDetailNext" ${nextItem ? '' : 'disabled'} title="Icon tiếp theo (→)">
            ${ICONS.chevronRight}
          </button>
          <button type="button" class="icon-btn-square ${isFav ? 'active-fav' : ''}" id="btnDetailFav" title="Lưu vào Yêu thích">
            ${isFav ? ICONS.heartFilled : ICONS.heart}
          </button>
          <button type="button" class="icon-btn-square" id="btnDetailShare" title="Copy liên kết trực tiếp">
            ${ICONS.share}
          </button>
        </div>
      </div>

      <!-- Main Hero Grid (thesvg.org 2-Column Layout) -->
      <div class="detail-hero-grid">
        <!-- Left Column: Interactive Vector Stage, Variants & Palette -->
        <div class="detail-stage-col">
          <div class="stage-card">
            <div class="stage-toolbar-top">
              <!-- Background Switcher -->
              <div class="stage-control-group" role="group" aria-label="Nền khung vẽ">
                <button type="button" class="stage-ctrl-btn ${stageTone === 'checker' ? 'active' : ''}" data-stage-tone="checker" title="Nền trong suốt (Checkerboard)">
                  ${ICONS.checkerboard}
                </button>
                <button type="button" class="stage-ctrl-btn ${stageTone === 'dark' ? 'active' : ''}" data-stage-tone="dark" title="Nền tối (Dark)">
                  ${ICONS.moon}
                </button>
                <button type="button" class="stage-ctrl-btn ${stageTone === 'light' ? 'active' : ''}" data-stage-tone="light" title="Nền sáng (Light)">
                  ${ICONS.sun}
                </button>
                <button type="button" class="stage-ctrl-btn ${stageTone === 'auto' ? 'active' : ''}" data-stage-tone="auto" title="Nền tự động theo giao diện (Auto)">
                  <span>Auto</span>
                </button>
              </div>

              <!-- Keyline Grid & Zoom Inspector -->
              <div style="display:flex;align-items:center;gap:6px">
                <button type="button" class="stage-ctrl-btn" id="btnToggleKeyline" style="border:1px solid var(--border-subtle);background:var(--bg-page);height:30px" title="Bật/Tắt lưới chuẩn thiết kế (Keyline Grid)">
                  ${ICONS.grid}
                  <span>Grid</span>
                </button>
                <div class="stage-control-group">
                  <button type="button" class="stage-ctrl-btn" id="btnZoomOut" title="Thu nhỏ">${ICONS.zoomOut}</button>
                  <button type="button" class="stage-ctrl-btn stage-zoom-readout" id="stageZoomReadout" title="Cuộn chuột để Zoom tại con trỏ · Bấm để đặt lại 100%">${BASE_STAGE_SIZE}px</button>
                  <button type="button" class="stage-ctrl-btn" id="btnZoomIn" title="Phóng to">${ICONS.zoomIn}</button>
                </div>
              </div>
            </div>

            <div class="stage-canvas" id="stageCanvas" data-tone="${stageTone}" title="Cuộn chuột để phóng to/thu nhỏ tại vị trí con trỏ · Kéo giữ chuột để di chuyển trong khung">
              <div class="stage-vector-box" id="stageVectorBox" style="width:${BASE_STAGE_SIZE}px;height:${BASE_STAGE_SIZE}px">
                <div id="stageSvgMount" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center">
                  ${getActiveRawSvg()}
                </div>
                <div id="stageKeylineMount" style="display:none">
                  ${ICONS.keylineGridOverlay}
                </div>
              </div>
            </div>

            <div class="stage-footer-bar">
              <div class="stage-meta-mono">
                <span>viewBox: <strong>${escapeHtml(icon.viewBox || '0 0 24 24')}</strong></span>
                <span> · </span>
                <span id="stageBytesLabel">${formatBytes(icon.fileSizeBytes)}</span>
              </div>
              <div class="color-picker-wrap">
                <label for="detailColorPicker" style="font-size:0.72rem">Đổi màu:</label>
                <input type="color" id="detailColorPicker" class="color-picker-input" value="${escapeHtml(primaryHex)}" />
                <button type="button" class="stage-ctrl-btn" id="btnResetColor" title="Khôi phục màu gốc" style="display:none">
                  ${ICONS.rotateCcw}
                </button>
              </div>
            </div>
          </div>

          <!-- Variant Selector Box -->
          <div class="detail-panel-box">
            <div class="panel-box-label">
              <span>Biến thể (${variantKeys.length} Variants)</span>
              <span style="text-transform:none;font-weight:500" id="activeVariantLabel">${escapeHtml(activeVariant)}</span>
            </div>
            <div class="variants-strip-grid" id="detailVariantStrip">
              ${variantKeys
                .map(
                  (vKey) => `
                  <button type="button" class="variant-mini-btn ${vKey === activeVariant ? 'active' : ''}" data-var-key="${escapeHtml(vKey)}">
                    <span class="variant-mini-thumb">
                      <img src="${escapeHtml(variantAssetUrls[vKey] || icon.assetUrl)}" alt="${escapeHtml(vKey)}" />
                    </span>
                    <span class="variant-mini-name">${escapeHtml(vKey)}</span>
                  </button>
                `
                )
                .join('')}
            </div>
          </div>

          <!-- Color Palette Box -->
          ${
            paletteColors.length > 0
              ? `
            <div class="detail-panel-box">
              <div class="panel-box-label">
                <span>Bảng màu gốc trong SVG (Bấm để copy HEX)</span>
              </div>
              <div class="palette-swatches">
                ${paletteColors
                  .map(
                    (hex) => `
                    <button type="button" class="swatch-pill" data-copy-hex="${escapeHtml(hex)}" title="Copy mã màu ${escapeHtml(hex)}">
                      <span class="swatch-dot" style="background:${escapeHtml(hex)}"></span>
                      <span>${escapeHtml(hex.toUpperCase())}</span>
                    </button>
                  `
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }
        </div>

        <!-- Right Column: Icon Metadata, Quick Copy/Download, PNG Export & Code Studio -->
        <div class="detail-info-col">
          <div>
            <div class="detail-title-row">
              <h1 class="detail-h1">${escapeHtml(icon.title || icon.slug)}</h1>
              <code class="detail-slug-code">${escapeHtml(icon.slug)}</code>
            </div>

            <div class="detail-badges-row" style="margin-top:10px">
              <button type="button" class="pill-btn active" data-crumb-cat="${escapeHtml(icon.category)}">
                ${getCategoryIconSvg(icon.category)}
                <span>${escapeHtml(catLabel)}</span>
              </button>
              <button type="button" class="pill-btn" data-jump-style="${escapeHtml(icon.styleType)}">
                ${getStyleIconSvg(icon.styleType)}
                <span>Phong cách: ${escapeHtml(icon.styleType)}</span>
              </button>
              <button type="button" class="pill-btn" data-jump-type="${escapeHtml(icon.iconType)}">
                ${getIconTypeSvg(icon.iconType)}
                <span>${escapeHtml(icon.iconType)}</span>
              </button>
            </div>
          </div>

          <!-- Primary Copy & Download Row (thesvg.org style) -->
          <div class="detail-actions-row">
            <button type="button" class="btn-action-hero primary" id="btnHeroCopySvg">
              ${ICONS.copy}
              <span>Copy SVG</span>
            </button>
            <button type="button" class="btn-action-hero" id="btnHeroCopyJsx">
              ${ICONS.react}
              <span>Copy JSX</span>
            </button>
            <button type="button" class="btn-action-hero" id="btnHeroCopyVue">
              ${ICONS.vue}
              <span>Copy Vue</span>
            </button>
            <button type="button" class="btn-action-hero" id="btnHeroCopyDataUri">
              ${ICONS.link}
              <span>Data URI</span>
            </button>
            <button type="button" class="btn-action-hero" id="btnHeroDownloadSvg">
              ${ICONS.download}
              <span>Tải .SVG</span>
            </button>
          </div>

          <!-- Export PNG Bar (32px - 512px like thesvg.org) -->
          <div class="png-export-bar">
            <div class="png-export-title">
              ${ICONS.image}
              <span>Xuất ảnh PNG chất lượng cao:</span>
            </div>
            <div class="png-size-buttons">
              ${[32, 64, 128, 256, 512]
                .map(
                  (sz) => `
                  <button type="button" class="btn-png-size" data-export-png="${sz}" title="Tải file PNG ${sz}×${sz}px">
                    ${ICONS.download}
                    <span>${sz}px</span>
                  </button>
                `
                )
                .join('')}
              <button type="button" class="btn-png-size" data-copy-png="256" title="Copy ảnh PNG 256px vào Clipboard">
                ${ICONS.copy}
                <span>Copy PNG</span>
              </button>
            </div>
          </div>

          <!-- Interactive Code Studio Tabs (with Syntax Highlighting & Line Numbers) -->
          <div class="code-studio-card">
            <div class="code-studio-header">
              <div class="code-tabs-group" role="tablist">
                <button type="button" class="code-tab-btn active" data-code-tab="svg">
                  ${ICONS.code}
                  <span>SVG XML</span>
                </button>
                <button type="button" class="code-tab-btn" data-code-tab="jsx">
                  ${ICONS.react}
                  <span>React JSX</span>
                </button>
                <button type="button" class="code-tab-btn" data-code-tab="vue">
                  ${ICONS.vue}
                  <span>Vue</span>
                </button>
                <button type="button" class="code-tab-btn" data-code-tab="html">
                  ${ICONS.code}
                  <span>HTML &lt;img&gt;</span>
                </button>
                <button type="button" class="code-tab-btn" data-code-tab="datauri">
                  ${ICONS.link}
                  <span>Data URI</span>
                </button>
              </div>
              <div class="code-header-actions">
                <span class="code-lang-badge" id="codeLangBadge">XML / SVG</span>
                <button type="button" class="btn-copy-code-snippet" id="btnCopyActiveCode">
                  ${ICONS.copy}
                  <span>Copy Code</span>
                </button>
              </div>
            </div>
            <pre class="code-studio-pre scroller" id="codeStudioPre"><code>${renderHighlightedCodeBlock(getFormattedCodeForTab('svg'), 'svg')}</code></pre>
          </div>

          <!-- Metadata Cards Grid -->
          <div class="detail-meta-grid">
            <div class="meta-stat-card">
              <span class="meta-stat-label">Bộ sưu tập</span>
              <button type="button" class="meta-stat-link" data-open-col="${escapeHtml(icon.collectionSlug)}">
                ${ICONS.folder}
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(icon.collectionName)}</span>
              </button>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">Kích thước lưới</span>
              <span class="meta-stat-val">${escapeHtml(icon.gridSize || '24x24')}</span>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">Dung lượng</span>
              <span class="meta-stat-val">${formatBytes(icon.fileSizeBytes)}</span>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">Giấy phép (License)</span>
              <span class="meta-stat-val">${escapeHtml(icon.license || 'MIT / CC0')}</span>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">Tác giả</span>
              <span class="meta-stat-val">${escapeHtml(
                !icon.author || /^(thesvg|svg\s*repo)$/i.test(String(icon.author).trim())
                  ? 'Open Source'
                  : icon.author
              )}</span>
            </div>
          </div>

          <!-- Tags Row -->
          <div>
            <div class="panel-box-label" style="margin-bottom:6px">
              <span>Từ khóa phân loại (Bấm vào tag để tìm các icon cùng từ khóa)</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${(icon.tags || [])
                .map(
                  (t) =>
                    `<button type="button" class="pill-btn" data-jump-tag="${escapeHtml(t)}" style="font-size:0.75rem;padding:4px 10px">#${escapeHtml(t)}</button>`
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section 1: Similar Icons -->
      <div class="detail-section">
        <div class="detail-section-header">
          <h2 class="detail-section-title">
            <span class="nav-icon" style="color:var(--brand-orange)">${ICONS.sparkles}</span>
            <span>Gợi ý tương đồng (Cùng từ khóa, chủ đề &amp; phong cách)</span>
          </h2>
        </div>
        ${renderMiniCardsSection(recommendations?.similar)}
      </div>

      <!-- Bottom Section 2: Same Style & Category -->
      <div class="detail-section">
        <div class="detail-section-header">
          <h2 class="detail-section-title">
            <span class="nav-icon" style="color:var(--brand-orange)">${getStyleIconSvg(icon.styleType)}</span>
            <span>Cùng phong cách "${escapeHtml(icon.styleType)}" &amp; chủ đề "${escapeHtml(catLabel)}"</span>
          </h2>
        </div>
        ${renderMiniCardsSection(recommendations?.sameStyle)}
      </div>

      <!-- Bottom Section 3: Same Collection -->
      <div class="detail-section">
        <div class="detail-section-header">
          <h2 class="detail-section-title">
            <span class="nav-icon" style="color:var(--brand-orange)">${ICONS.folder}</span>
            <span>Cùng bộ sưu tập "${escapeHtml(icon.collectionName)}"</span>
          </h2>
          <button type="button" class="pill-btn" data-open-col="${escapeHtml(icon.collectionSlug)}">
            <span>Xem toàn bộ bộ sưu tập</span>
            ${ICONS.chevronRight}
          </button>
        </div>
        ${renderMiniCardsSection(recommendations?.sameCollection)}
      </div>
    `;

    // Wire up interactive controls inside Detail Page
    const stageCanvas = document.getElementById('stageCanvas');
    const stageVectorBox = document.getElementById('stageVectorBox');
    const stageSvgMount = document.getElementById('stageSvgMount');
    const stageKeylineMount = document.getElementById('stageKeylineMount');
    const stageZoomReadout = document.getElementById('stageZoomReadout');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnToggleKeyline = document.getElementById('btnToggleKeyline');
    const detailColorPicker = document.getElementById('detailColorPicker');
    const btnResetColor = document.getElementById('btnResetColor');
    const activeVariantLabel = document.getElementById('activeVariantLabel');
    const codeStudioPre = document.getElementById('codeStudioPre');
    const codeLangBadge = document.getElementById('codeLangBadge');

    function mountCrispStageSvg() {
      stageSvgMount.innerHTML = getActiveRawSvg();
      const svgEl = stageSvgMount.querySelector('svg');
      if (svgEl) {
        if (!svgEl.getAttribute('viewBox')) {
          const wAttr = parseFloat(svgEl.getAttribute('width')) || 24;
          const hAttr = parseFloat(svgEl.getAttribute('height')) || 24;
          svgEl.setAttribute('viewBox', icon.viewBox || `0 0 ${wAttr} ${hAttr}`);
        }
        svgEl.setAttribute('width', '100%');
        svgEl.setAttribute('height', '100%');
        if (!svgEl.getAttribute('preserveAspectRatio')) {
          svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }
      }
    }

    function refreshStageAndCode() {
      mountCrispStageSvg();
      codeStudioPre.innerHTML = `<code>${renderHighlightedCodeBlock(getFormattedCodeForTab(activeCodeTab), activeCodeTab)}</code>`;
      if (codeLangBadge) codeLangBadge.textContent = getLangBadgeForTab(activeCodeTab);
      activeVariantLabel.textContent = activeVariant;
    }

    mountCrispStageSvg();

    // Back button: if user came from a Collection View, return to that Collection View; otherwise return to Catalog
    document.getElementById('btnBackToCatalog').addEventListener('click', () => {
      if (activeCollectionState && activeCollectionState.slug === icon.collectionSlug) {
        openCollectionPage('any', activeCollectionState.slug, true);
      } else {
        showCatalogView(true);
      }
    });

    // Prev / Next icon buttons
    const btnDetailPrev = document.getElementById('btnDetailPrev');
    if (btnDetailPrev && prevItem) {
      btnDetailPrev.addEventListener('click', () => {
        openDetailPage('any', prevItem.collectionSlug, prevItem.id || prevItem.slug, true);
      });
    }
    const btnDetailNext = document.getElementById('btnDetailNext');
    if (btnDetailNext && nextItem) {
      btnDetailNext.addEventListener('click', () => {
        openDetailPage('any', nextItem.collectionSlug, nextItem.id || nextItem.slug, true);
      });
    }

    // Favorite Toggle in Detail Page
    const btnDetailFav = document.getElementById('btnDetailFav');
    btnDetailFav.addEventListener('click', () => {
      if (favorites.has(favKey) || favorites.has(legacyFavKey)) {
        favorites.delete(favKey);
        favorites.delete(legacyFavKey);
        btnDetailFav.classList.remove('active-fav');
        btnDetailFav.innerHTML = ICONS.heart;
        showToast('Đã bỏ khỏi danh sách Yêu thích');
      } else {
        favorites.add(favKey);
        btnDetailFav.classList.add('active-fav');
        btnDetailFav.innerHTML = ICONS.heartFilled;
        showToast('Đã lưu vào danh sách Yêu thích');
      }
      saveFavorites();
    });

    // Share Link
    document.getElementById('btnDetailShare').addEventListener('click', async () => {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Đã copy đường dẫn chi tiết icon');
    });

    // Stage Tone Switcher (Checker / Dark / Light / Auto)
    detailView.querySelectorAll('[data-stage-tone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stageTone = btn.dataset.stageTone;
        stageCanvas.dataset.tone = stageTone;
        detailView.querySelectorAll('[data-stage-tone]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Keyline Grid Toggle
    btnToggleKeyline.addEventListener('click', () => {
      showKeylineGrid = !showKeylineGrid;
      stageKeylineMount.style.display = showKeylineGrid ? 'block' : 'none';
      btnToggleKeyline.classList.toggle('active', showKeylineGrid);
    });

    // Cursor-Anchored Wheel Zoom & Bounded Drag-Pan inside Stage Canvas
    const MIN_SCALE = 0.35; // ~63px
    const MAX_SCALE = 4.0;  // ~720px

    function clampStagePan() {
      const cw = stageCanvas.clientWidth || 350;
      const ch = stageCanvas.clientHeight || 310;
      const scaledSize = BASE_STAGE_SIZE * zoomScale;
      const pad = 20;
      const maxX = Math.max(0, (cw + Math.abs(cw - scaledSize)) / 2 - pad);
      const maxY = Math.max(0, (ch + Math.abs(ch - scaledSize)) / 2 - pad);
      // Strict boundary so the icon can never be dragged outside the stage frame
      const boundX = Math.max((cw - scaledSize) / 2 - pad, (scaledSize - cw) / 2 + pad);
      const boundY = Math.max((ch - scaledSize) / 2 - pad, (scaledSize - ch) / 2 + pad);
      const limitX = Math.max(0, Math.min(maxX, boundX));
      const limitY = Math.max(0, Math.min(maxY, boundY));
      panX = Math.max(-limitX, Math.min(limitX, panX));
      panY = Math.max(-limitY, Math.min(limitY, panY));
    }

    function applyStageTransform() {
      clampStagePan();
      const exactPx = BASE_STAGE_SIZE * zoomScale;
      stageVectorBox.style.width = `${exactPx.toFixed(1)}px`;
      stageVectorBox.style.height = `${exactPx.toFixed(1)}px`;
      stageVectorBox.style.transform = `translate(calc(-50% + ${panX.toFixed(1)}px), calc(-50% + ${panY.toFixed(1)}px))`;
      const effectivePx = Math.round(exactPx);
      stageZoomReadout.textContent = `${effectivePx}px`;
      btnZoomOut.disabled = zoomScale <= MIN_SCALE + 0.01;
      btnZoomIn.disabled = zoomScale >= MAX_SCALE - 0.01;
    }

    function zoomAtPoint(nextScale, focalX = 0, focalY = 0) {
      const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      if (Math.abs(clamped - zoomScale) < 0.001) return;
      const ratio = clamped / zoomScale;
      // Keep the point under cursor stationary while zooming
      panX = focalX - (focalX - panX) * ratio;
      panY = focalY - (focalY - panY) * ratio;
      zoomScale = clamped;
      applyStageTransform();
    }

    stageCanvas.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        const rect = stageCanvas.getBoundingClientRect();
        const focalX = e.clientX - (rect.left + rect.width / 2);
        const focalY = e.clientY - (rect.top + rect.height / 2);
        const factor = e.deltaY < 0 ? 1.14 : 1 / 1.14;
        zoomAtPoint(zoomScale * factor, focalX, focalY);
      },
      { passive: false }
    );

    // Drag to pan inside stageCanvas, clamped strictly within stage frame
    let isDraggingStage = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startPanX = 0;
    let startPanY = 0;

    stageCanvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      isDraggingStage = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startPanX = panX;
      startPanY = panY;
      stageCanvas.classList.add('is-panning');
      stageCanvas.setPointerCapture(e.pointerId);
    });

    stageCanvas.addEventListener('pointermove', (e) => {
      if (!isDraggingStage) return;
      panX = startPanX + (e.clientX - dragStartX);
      panY = startPanY + (e.clientY - dragStartY);
      applyStageTransform();
    });

    function endStageDrag(e) {
      if (!isDraggingStage) return;
      isDraggingStage = false;
      stageCanvas.classList.remove('is-panning');
      try {
        stageCanvas.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    stageCanvas.addEventListener('pointerup', endStageDrag);
    stageCanvas.addEventListener('pointercancel', endStageDrag);

    stageCanvas.addEventListener('dblclick', () => {
      zoomScale = 1;
      panX = 0;
      panY = 0;
      applyStageTransform();
    });

    stageZoomReadout.addEventListener('click', () => {
      zoomScale = 1;
      panX = 0;
      panY = 0;
      applyStageTransform();
    });

    btnZoomOut.addEventListener('click', () => {
      zoomAtPoint(zoomScale / 1.25, 0, 0);
    });

    btnZoomIn.addEventListener('click', () => {
      zoomAtPoint(zoomScale * 1.25, 0, 0);
    });

    // Live Color Picker & Reset
    detailColorPicker.addEventListener('input', (e) => {
      customColor = e.target.value;
      btnResetColor.style.display = 'inline-flex';
      updateBrandGlow(customColor);
      refreshStageAndCode();
    });

    btnResetColor.addEventListener('click', () => {
      customColor = null;
      detailColorPicker.value = primaryHex;
      btnResetColor.style.display = 'none';
      updateBrandGlow(primaryHex);
      refreshStageAndCode();
    });

    // Variant Switching
    detailView.querySelectorAll('[data-var-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeVariant = btn.dataset.varKey;
        detailView.querySelectorAll('[data-var-key]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        refreshStageAndCode();
      });
    });

    // Swatch Click -> Copy Hex
    detailView.querySelectorAll('[data-copy-hex]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const hex = btn.dataset.copyHex;
        await navigator.clipboard.writeText(hex);
        showToast(`Đã copy mã màu ${hex.toUpperCase()}`);
      });
    });

    // Primary Copy / Download Actions
    document.getElementById('btnHeroCopySvg').addEventListener('click', async () => {
      await navigator.clipboard.writeText(getActiveRawSvg().trim());
      showToast('Đã copy mã SVG XML');
    });

    document.getElementById('btnHeroCopyJsx').addEventListener('click', async () => {
      const compName = toPascalCaseComponentName(icon.slug || icon.title);
      await navigator.clipboard.writeText(svgToJsx(getActiveRawSvg(), compName));
      showToast(`Đã copy component <${compName} /> (React JSX)`);
    });

    document.getElementById('btnHeroCopyVue').addEventListener('click', async () => {
      await navigator.clipboard.writeText(svgToVue(getActiveRawSvg()));
      showToast('Đã copy mã Vue Template');
    });

    document.getElementById('btnHeroCopyDataUri').addEventListener('click', async () => {
      await navigator.clipboard.writeText(svgToDataUri(getActiveRawSvg()));
      showToast('Đã copy SVG Data URI');
    });

    document.getElementById('btnHeroDownloadSvg').addEventListener('click', () => {
      const svgBlob = new Blob([getActiveRawSvg()], { type: 'image/svg+xml;charset=utf-8' });
      const dlUrl = URL.createObjectURL(svgBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      const suffix = activeVariant !== 'default' ? `-${activeVariant}` : '';
      a.download = `${icon.slug || 'icon'}${suffix}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(dlUrl), 1000);
      showToast(`Đã tải xuống ${a.download}`);
    });

    // PNG Export Buttons (32px, 64px, 128px, 256px, 512px & Copy PNG)
    detailView.querySelectorAll('[data-export-png]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sz = Number(btn.dataset.exportPng) || 128;
        exportSvgToPng(getActiveRawSvg(), sz, icon.slug || 'icon', false);
      });
    });

    detailView.querySelectorAll('[data-copy-png]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sz = Number(btn.dataset.copyPng) || 256;
        exportSvgToPng(getActiveRawSvg(), sz, icon.slug || 'icon', true);
      });
    });

    // Code Studio Tabs
    detailView.querySelectorAll('[data-code-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCodeTab = btn.dataset.codeTab;
        detailView.querySelectorAll('[data-code-tab]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        codeStudioPre.innerHTML = `<code>${renderHighlightedCodeBlock(getFormattedCodeForTab(activeCodeTab), activeCodeTab)}</code>`;
        if (codeLangBadge) codeLangBadge.textContent = getLangBadgeForTab(activeCodeTab);
      });
    });

    const btnCopyActiveCode = document.getElementById('btnCopyActiveCode');
    btnCopyActiveCode.addEventListener('click', async () => {
      await navigator.clipboard.writeText(getFormattedCodeForTab(activeCodeTab));
      btnCopyActiveCode.classList.add('copied');
      btnCopyActiveCode.innerHTML = `${ICONS.check}<span>Đã Copy</span>`;
      showToast(`Đã copy mã ${activeCodeTab.toUpperCase()}`);
      setTimeout(() => {
        btnCopyActiveCode.classList.remove('copied');
        btnCopyActiveCode.innerHTML = `${ICONS.copy}<span>Copy Code</span>`;
      }, 1600);
    });
  }

  // Delegate clicks on breadcrumbs, collection links, tags, style/type badges & recommended mini cards inside Detail View
  detailView.addEventListener('click', (e) => {
    const switchCard = e.target.closest('[data-switch-icon]');
    if (switchCard) {
      const parts = switchCard.dataset.switchIcon.split(':');
      if (parts.length >= 3) {
        openDetailPage(parts[0], parts[1], parts[2], true);
      } else {
        openDetailPage('any', parts[0], parts[1], true);
      }
      return;
    }

    const openColBtn = e.target.closest('[data-open-col]');
    if (openColBtn) {
      const raw = openColBtn.dataset.openCol;
      const c = raw.includes(':') ? raw.split(':')[1] : raw;
      openCollectionPage('any', c, true);
      return;
    }

    const crumbCat = e.target.closest('[data-crumb-cat]');
    if (crumbCat) {
      filters.category = crumbCat.dataset.crumbCat;
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
      return;
    }

    const jumpStyle = e.target.closest('[data-jump-style]');
    if (jumpStyle) {
      filters.styleType = jumpStyle.dataset.jumpStyle;
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
      return;
    }

    const jumpType = e.target.closest('[data-jump-type]');
    if (jumpType) {
      filters.iconType = jumpType.dataset.jumpType;
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
      return;
    }

    const jumpTag = e.target.closest('[data-jump-tag]');
    if (jumpTag) {
      filters.q = jumpTag.dataset.jumpTag;
      searchInput.value = filters.q;
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
    }
  });

  // ============================================================================
  // SIDEBAR & TOP DROPDOWN FILTER EVENTS
  // ============================================================================
  navAllIcons.addEventListener('click', () => {
    viewMode = 'icons';
    resetAllFilters(true);
  });

  if (navCollectionsDirectory) {
    navCollectionsDirectory.addEventListener('click', () => {
      setCatalogViewMode('collections');
    });
  }

  if (navBrandsDirectory) {
    navBrandsDirectory.addEventListener('click', () => {
      setCatalogViewMode('brands');
    });
  }

  navFavorites.addEventListener('click', () => {
    viewMode = 'icons';
    filters.onlyFavorites = !filters.onlyFavorites;
    updateNavActiveStates();
    showCatalogView(true);
    loadCatalogData(true);
  });

  btnResetCategory.addEventListener('click', () => {
    filters.category = '';
    updateNavActiveStates();
    showCatalogView(true);
    loadCatalogData(true);
  });

  sidebarCategories.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter-cat]');
    if (!btn) return;
    const val = btn.dataset.filterCat;
    filters.category = filters.category === val ? '' : val;
    updateNavActiveStates();
    showCatalogView(true);
    loadCatalogData(true);
  });

  filterStyleOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter-style]');
    if (!btn) return;
    const val = btn.dataset.filterStyle;
    filters.styleType = filters.styleType === val ? '' : val;
    closeAllDropdowns();
    updateNavActiveStates();
    showCatalogView(true);
    loadCatalogData(true);
  });

  filterIconTypeOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter-type]');
    if (!btn) return;
    const val = btn.dataset.filterType;
    filters.iconType = filters.iconType === val ? '' : val;
    closeAllDropdowns();
    updateNavActiveStates();
    showCatalogView(true);
    loadCatalogData(true);
  });

  filterCollectionOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter-col]');
    if (!btn) return;
    const val = btn.dataset.filterCol;
    closeAllDropdowns();
    openCollectionPage('any', val, true);
  });

  // Search & Sort
  let searchTimer = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const nextQ = searchInput.value.trim();
      if (nextQ === filters.q) return;
      filters.q = nextQ;
      updateNavActiveStates();
      if (activeDetailIconKey || activeCollectionState) {
        showCatalogView(true);
      } else {
        syncCatalogUrl(false);
      }
      loadCatalogData(true);
    }, 320);
  });

  sortSelect.addEventListener('change', () => {
    filters.sort = sortSelect.value;
    syncCatalogUrl(true);
    loadCatalogData(true);
  });

  let isSyncing = false;
  let lastManualReloadTs = 0;

  btnReloadCatalog.addEventListener('click', async () => {
    const now = Date.now();
    if (isSyncing || now - lastManualReloadTs < 5000) return;
    lastManualReloadTs = now;
    isSyncing = true;
    reloadSpinIcon.classList.add('spin-anim');
    reloadBtnText.textContent = 'Đang đồng bộ...';
    btnReloadCatalog.disabled = true;
    try {
      apiJsonCache.clear();
      await loadSummary(true);
      if (activeCollectionState) {
        await openCollectionPage('any', activeCollectionState.slug, false, {
          q: activeCollectionState.q,
          styleType: activeCollectionState.styleType,
          sort: activeCollectionState.sort,
        });
      } else if (!activeDetailIconKey) {
        await loadCatalogData(true, { bypassCache: true });
      }
      showToast(`Đã đồng bộ kho SVGCraft (${(catalogSummary?.totalIcons || 0).toLocaleString()} icons)`);
    } finally {
      reloadSpinIcon.classList.remove('spin-anim');
      reloadBtnText.textContent = 'Làm mới';
      btnReloadCatalog.disabled = false;
      isSyncing = false;
    }
  });

  logoResetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetAllFilters();
  });

  function restoreSavedThemeAndTone() {
    const savedTheme = localStorage.getItem('svg_hub_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      document.documentElement.dataset.theme = savedTheme;
      themeIconWrap.innerHTML = savedTheme === 'dark' ? ICONS.moon : ICONS.sun;
      themeTextLabel.textContent = savedTheme === 'dark' ? 'Dark' : 'Light';
    }
    const savedTone = localStorage.getItem('svg_hub_tone');
    const savedIdx = TONES.indexOf(savedTone);
    if (savedIdx !== -1) {
      currentToneIdx = savedIdx;
      document.body.dataset.previewTone = savedTone;
      toneLabel.textContent = savedTone.charAt(0).toUpperCase() + savedTone.slice(1);
    }
  }

  // Tone & Theme Toggles (Syncs both Catalog Grid, Collection Grid, and Detail Stage)
  btnCycleTone.addEventListener('click', () => {
    currentToneIdx = (currentToneIdx + 1) % TONES.length;
    const tone = TONES[currentToneIdx];
    document.body.dataset.previewTone = tone;
    toneLabel.textContent = tone.charAt(0).toUpperCase() + tone.slice(1);
    localStorage.setItem('svg_hub_tone', tone);

    // Also update the active Detail View stage canvas if open
    const activeStageCanvas = document.getElementById('stageCanvas');
    if (activeStageCanvas) {
      activeStageCanvas.dataset.tone = tone;
      detailView.querySelectorAll('[data-stage-tone]').forEach((b) => {
        b.classList.toggle('active', b.dataset.stageTone === tone);
      });
    }
  });

  btnToggleTheme.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    themeIconWrap.innerHTML = next === 'dark' ? ICONS.moon : ICONS.sun;
    themeTextLabel.textContent = next === 'dark' ? 'Dark' : 'Light';
    localStorage.setItem('svg_hub_theme', next);
  });

  // Keyboard Shortcuts (Cmd+K search, Escape to close dropdowns or return from Detail view)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }
    if (e.key === 'Escape') {
      if (searchFocusPopover && searchFocusPopover.classList.contains('open')) {
        searchFocusPopover.classList.remove('open');
        searchInput.blur();
        return;
      }
      const anyOpen = allDropdowns.some((d) => d && d.classList.contains('open'));
      if (anyOpen) {
        closeAllDropdowns();
        return;
      }
      if ((activeDetailIconKey || activeCollectionState) && document.activeElement !== searchInput) {
        showCatalogView(true);
        if (currentItems.length === 0 && currentCollections.length === 0) {
          loadCatalogData(true);
        }
      }
    }
  });

  // Browser Back/Forward navigation support
  window.addEventListener('popstate', () => {
    handleInitialOrPopStateRoute();
  });

  async function handleInitialOrPopStateRoute() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    const iconLegacyMatch = path.match(/^\/icon\/([^/]+)\/([^/]+)\/([^/]+)/);
    if (iconLegacyMatch) {
      const [, site, col, idOrSlug] = iconLegacyMatch.map(decodeURIComponent);
      await openDetailPage(site, col, idOrSlug, false);
      return;
    }
    const iconCleanMatch = path.match(/^\/icon\/([^/]+)\/([^/]+)/);
    if (iconCleanMatch) {
      const [, col, idOrSlug] = iconCleanMatch.map(decodeURIComponent);
      await openDetailPage('any', col, idOrSlug, false);
      return;
    }
    const colLegacyMatch = path.match(/^\/collection\/([^/]+)\/([^/]+)/);
    if (colLegacyMatch) {
      const [, site, col] = colLegacyMatch.map(decodeURIComponent);
      await openCollectionPage(site, col, false, {
        q: params.get('q') || '',
        styleType: params.get('style') || '',
        sort: params.get('sort') || 'az',
      });
      return;
    }
    const colShortMatch = path.match(/^\/collection\/([^/]+)/);
    if (colShortMatch) {
      const [, col] = colShortMatch.map(decodeURIComponent);
      await openCollectionPage('any', col, false, {
        q: params.get('q') || '',
        styleType: params.get('style') || '',
        sort: params.get('sort') || 'az',
      });
      return;
    }

    readCatalogFiltersFromUrl();
    showCatalogView(false);
    await loadCatalogData(true);
  }

  async function init() {
    restoreSavedThemeAndTone();
    initAlphabetBar();
    await loadSummary();
    await handleInitialOrPopStateRoute();
  }

  init();
})();

