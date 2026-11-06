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
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
    coffee: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>`,
    activity: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`,
    compass: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/><circle cx="12" cy="12" r="10"/></svg>`,
    hexagon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="3"/></svg>`,
    'play-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
    waveform: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`,

    // Bespoke Style Icons (visualizing Outlined, Filled, Duotone, Multicolor, Monocolor)
    'style-outlined': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/></svg>`,
    'style-filled': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/></svg>`,
    'style-duotone': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="7" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.6"/><circle cx="14.5" cy="14.5" r="6.5" fill="currentColor"/></svg>`,
    'style-multicolor': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 0 1 10 10h-6a4 4 0 0 0-4-4V2Z" fill="#f97316"/><path d="M22 12a10 10 0 0 1-10 10v-6a4 4 0 0 0 4-4h6Z" fill="#6366f1"/><path d="M12 22A10 10 0 0 1 2 12h6a4 4 0 0 0 4 4v6Z" fill="#10b981"/><path d="M2 12A10 10 0 0 1 12 2v6a4 4 0 0 0-4 4H2Z" fill="#ec4899"/></svg>`,
    'style-monocolor': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/></svg>`,

    // Bespoke Icon Kind Icons
    'type-ui-icon': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><circle cx="6.5" cy="17.5" r="3.5"/></svg>`,
    'type-animated': `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>`,
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
  const btnToggleLang = document.getElementById('btnToggleLang');
  const langTextLabel = document.getElementById('langTextLabel');
  const logoResetBtn = document.getElementById('logoResetBtn');

  // ============================================================================
  // INTERNATIONALIZATION (EN default + VI switcher)
  // ============================================================================
  const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('svg_hub_lang') : null;
  let currentLang = savedLang === 'vi' ? 'vi' : 'en';

  const I18N = {
    en: {
      searchPlaceholder: 'Search 500,000+ icons, brands, AI, AWS, UI... (Cmd/Ctrl + K)',
      tonePrefix: 'Bg:',
      toneTitle: 'Switch icon preview background (Auto / Dark / Light / Checkerboard)',
      langTitle: 'Switch Language (English / Tiếng Việt)',
      themeTitle: 'Switch Theme (Dark / Light)',
      exploreHeading: 'Explore',
      navAllIcons: 'All Icons',
      navAnimated: 'Animated Icons',
      navCollections: 'Collections',
      navBrands: 'Brands',
      navFavorites: 'Favorites',
      categoriesHeading: 'Categories',
      resetAll: 'All',
      heroHeadingIcons: '500,000+ Vector Icons. Inspect. Customize. Ship.',
      heroHeadingCollections: 'Explore Vector Collections by Topic & Style.',
      heroHeadingBrands: 'Explore Brand Logos & Tech Ecosystems.',
      heroSubheading:
        'Instant search across <strong>1,500+ collections</strong> · Real-time color customization · Export <strong>SVG, React JSX, Vue, Data URI &amp; PNG</strong>.',
      styleTriggerDefault: 'Style',
      styleHeader: 'Visual Style (Style Type)',
      iconTypeTriggerDefault: 'Icon Type',
      iconTypeHeader: 'Icon Type (Icon Kind)',
      collectionsTriggerDefault: 'Collections',
      collectionsHeader: 'Collections',
      collectionSearchPlaceholder: 'Find collection (e.g. Solar, AWS, Simple Icons...)',
      noCollectionsFound: 'No matching collections found',
      clearSelection: 'Clear selection',
      sortTitle: 'Sort order',
      sortRecent: 'Recently updated',
      sortAz: 'Name A → Z',
      sortZa: 'Name Z → A',
      reloadBtnTitle: 'Refresh catalog',
      reloadBtnText: 'Refresh',
      reloadingText: 'Syncing...',
      tabIcons: 'Individual Icons',
      tabCollections: 'Collections',
      tabBrands: 'Brands (Logos)',
      showingPrefix: 'Showing',
      unitIcons: 'icons',
      unitCollections: 'collections',
      unitBrands: 'brands',
      loadMoreDefault: 'Load more icons',
      loadingMoreIcons: 'Loading more icons...',
      loadingMoreItems: 'Loading more {unit}...',
      scrollLoadMore: 'Scroll down to load more ({shown} / {total} {unit})',
      removeFilterTag: 'Remove filter tag',
      popIconKindTitle: 'Icon & Brand Kind',
      popIconKindHint: 'Click tag to quick filter',
      popCategoriesTitle: 'Categories',
      popStylesTitle: 'Styles',
      popTopColsTitle: 'Featured Collections (Open Collection View)',
      chipCategory: 'Category',
      chipStyle: 'Style',
      chipType: 'Type',
      chipCollection: 'Collection',
      chipLetter: 'Letter',
      chipKeyword: 'Keyword',
      chipFavorites: 'Favorites',
      clearAllFilters: 'Clear all filters',
      emptyColsTitle: 'No matching {unit} found',
      emptyColsDesc: 'Try selecting another category or resetting filters to view the full directory.',
      emptyIconsTitle: 'No SVG icons match your filters',
      emptyIconsDesc: 'Try removing keywords or resetting filters to browse the full catalog.',
      resetFiltersBtn: 'Reset filters',
      variantsTooltip: 'Has {count} variants',
      copySvgTitle: 'Copy raw SVG code',
      copyJsxTitle: 'Copy React JSX',
      downloadSvgTitle: 'Download .svg file',
      favoriteTitle: 'Favorite',
      toastRateLimit: 'Too many requests, please wait a few seconds...',
      toastPngCopied: 'Copied PNG ({size}×{size}px) to Clipboard',
      toastPngDownloaded: 'Downloaded {file}',
      toastSvgCopied: 'Copied SVG code to Clipboard',
      toastJsxCopied: 'Copied <{comp} /> component (JSX)',
      toastVueCopied: 'Copied Vue Template code',
      toastDataUriCopied: 'Copied SVG Data URI',
      toastFileDownloaded: 'Downloaded {file}',
      toastCodeCopied: 'Copied {tab} code',
      toastHexCopied: 'Copied color {hex}',
      toastColNotFound: 'Collection not found',
      toastColLinkCopied: 'Copied collection link',
      toastIconNotFound: 'Icon details not found',
      toastIconLinkCopied: 'Copied icon link',
      toastFavAdded: 'Saved to Favorites',
      toastFavRemoved: 'Removed from Favorites',
      toastSynced: 'Synced SVGCraft catalog ({count} icons)',
      colPageTitleSuffix: 'SVG Icon Collection | SVGCraft',
      colBackCatalog: 'Back to Catalog',
      colBreadcrumb: 'Collection',
      colShareTitle: 'Copy collection link',
      colStatCount: 'Count:',
      colStatLicense: 'License:',
      colStatAuthor: 'Author:',
      colSearchPlaceholder: 'Search icons in {name}...',
      colAllStyles: 'All ({count})',
      colEmptySearch: 'No icons match your search in this collection.',
      colLoadMoreBtn: 'Load more icons in collection ({shown} / {total})',
      detailBack: 'Back',
      detailPrevTitle: 'Previous icon (←)',
      detailNextTitle: 'Next icon (→)',
      detailFavTitle: 'Save to Favorites',
      detailShareTitle: 'Copy direct link',
      stageToneChecker: 'Transparent background (Checkerboard)',
      stageToneDark: 'Dark background',
      stageToneLight: 'Light background',
      stageToneAuto: 'Auto background (follows theme)',
      stageKeylineTitle: 'Toggle Keyline Grid',
      stageZoomOutTitle: 'Zoom out',
      stageZoomInTitle: 'Zoom in',
      stageZoomResetTitle: 'Scroll to zoom at cursor · Click to reset 100%',
      stageCanvasTitle: 'Scroll wheel to zoom at cursor · Drag to pan inside frame',
      stageColorLabel: 'Color:',
      stageResetColorTitle: 'Reset original color',
      detailVariantsTitle: 'Variants ({count} Variants)',
      detailPaletteTitle: 'Original SVG Palette (Click to copy HEX)',
      detailStylePrefix: 'Style:',
      detailDownloadSvgBtn: 'Download .SVG',
      detailPngExportTitle: 'Export high-res PNG:',
      detailPngBtnTitle: 'Download PNG {size}×{size}px',
      detailCopyPngTitle: 'Copy 256px PNG to Clipboard',
      detailCopyCodeBtn: 'Copy Code',
      detailCopiedBtn: 'Copied',
      metaCollection: 'Collection',
      metaGridSize: 'Grid Size',
      metaFileSize: 'File Size',
      metaLicense: 'License',
      metaAuthor: 'Author',
      detailTagsLabel: 'Classification Tags (Click tag to search matching icons)',
      recSimilarTitle: 'Similar Icons (Matching tags, category & style)',
      recSameStyleTitle: 'Same "{style}" style & "{category}" category',
      recSameColTitle: 'More from "{collection}"',
      recViewAllCol: 'View full collection',
      recEmpty: 'No additional icons in this group.',
      customizerTitle: 'Vector Customizer (Colors · Background · Stroke)',
      ctrlColors: 'Colors',
      ctrlBackground: 'Background',
      ctrlTransparent: 'Transparent',
      ctrlStroke: 'Stroke',
      strokeLight: 'light',
      strokeRegular: 'regular',
      strokeBold: 'bold',
      motionPanelTitle: 'Animation & Motion States',
      motionLiveLoop: 'Auto Loop on Stage',
      motionPlayOnce: 'Play Motion',
      exportModeTitle: 'SVG Download & Copy Mode',
      exportModeStatic: 'Static SVG',
      exportModeStaticSub: 'Lightweight static vector (~3–15 KB)',
      exportModeHover: 'Animated SVG (On Hover)',
      exportModeHoverSub: 'Plays animation when hovered (:hover)',
      exportModeLoop: 'Animated SVG (Auto Loop)',
      exportModeLoopSub: 'Loops continuously by itself (infinite)',
      exportPanelTitle: 'Export',
      exportOptAnimation: 'Animation',
      exportOptMotion: 'Motion',
      exportMotionLoading: 'Loading motion states…',
      exportOptSize: 'Size',
      exportModeStaticShort: 'Static',
      exportModeHoverShort: 'On hover',
      exportModeLoopShort: 'Loop',
      exportCopyBtn: 'Copy',
      exportDownloadBtn: 'Download',
      exportLottieLoading: 'Lottie data is still loading…',
      exportLottieNote: 'Preview truncated — Copy / Download gives the full JSON with your colors & stroke.',
      exportFailed: 'Export failed, please try again.',
      exportModeNotePng: 'PNG is always a still image',
      exportModeNoteHtml: 'HTML <img> links the original file',
      exportModeNoteLottie: 'Lottie JSON already contains every motion',
      hoverRepeatLabel: 'On hover:',
      hoverRepeatOnce: 'Play once',
      hoverRepeatLoop: 'Repeat',
      exportModeLottie: 'Download Lottie .JSON',
      exportModeLottieSub: 'Raw vector animation JSON',
      toastCompilingAnimSvg: 'Compiling standalone animated SVG with your colors & stroke...',
      lordiconAllCategories: 'All Categories',
      lordiconTopicLabel: 'Animated Categories:',
      categories: {
        popular: 'Popular',
        interface: 'Interface',
        animals: 'Animals',
        'architecture-and-places': 'Architecture & Places',
        'business-and-finance': 'Business & Finance',
        celebrations: 'Celebrations',
        'characters-and-symbols': 'Characters & Symbols',
        communication: 'Communication',
        culture: 'Culture',
        'design-and-editing': 'Design & Editing',
        'fashion-and-beauty': 'Fashion & Beauty',
        'files-and-folders': 'Files & Folders',
        'finance-and-stats': 'Finance & Stats',
        'food-and-drink': 'Food & Drink',
        'games-and-toys': 'Games & Toys',
        'health-and-medical': 'Health & Medical',
        household: 'Household',
        'music-and-audio': 'Music & Audio',
        'nature-and-weather': 'Nature & Weather',
        people: 'People',
        'photo-and-video': 'Photo & Video',
        'science-and-industry': 'Science & Industry',
        'security-and-military': 'Security & Military',
        shopping: 'Shopping',
        'sports-and-fitness': 'Sports & Fitness',
        'tech-and-devices': 'Tech & Devices',
        'time-and-date': 'Time & Date',
        transport: 'Transport',
        'work-and-education': 'Work & Education',
        ai: 'AI & Machine Learning',
        cloud: 'Cloud & Infrastructure',
        devtools: 'Developer Tools & Code',
        brand: 'Brand & Company Logos',
      },
      styles: {
        outlined: 'Outlined',
        filled: 'Filled',
        duotone: 'Duotone',
        multicolor: 'Multicolor',
        monocolor: 'Monocolor',
      },
      iconTypes: {
        'ui-icon': 'UI / System Icon',
        animated: 'Animated / Motion SVG',
        'brand-logo': 'Brand / Tech Logo',
        architecture: 'Cloud Architecture',
        badge: 'Badge / Auth Button',
      },
    },
    vi: {
      searchPlaceholder: 'Tìm trong 500.000+ icon, thương hiệu, AI, AWS, UI... (Cmd/Ctrl + K)',
      tonePrefix: 'Nền:',
      toneTitle: 'Đổi nền xem trước icon (Auto / Dark / Light / Checkerboard)',
      langTitle: 'Đổi ngôn ngữ (English / Tiếng Việt)',
      themeTitle: 'Đổi giao diện Sáng / Tối',
      exploreHeading: 'Khám phá',
      navAllIcons: 'Tất cả Icons',
      navAnimated: 'Icon Động (Animated)',
      navCollections: 'Bộ sưu tập',
      navBrands: 'Thương hiệu (Brands)',
      navFavorites: 'Đã yêu thích',
      categoriesHeading: 'Chủ đề (Categories)',
      resetAll: 'Tất cả',
      heroHeadingIcons: '500.000+ Vector Icons. Inspect. Customize. Ship.',
      heroHeadingCollections: 'Khám phá Bộ sưu tập Vector theo Chủ đề & Phong cách.',
      heroHeadingBrands: 'Khám phá Logo & Hệ sinh thái Thương hiệu.',
      heroSubheading:
        'Tìm kiếm tức thì hơn <strong>1.500+ bộ sưu tập</strong> · Đổi màu trực tiếp · Xuất nhanh <strong>SVG, React JSX, Vue, Data URI &amp; PNG</strong>.',
      styleTriggerDefault: 'Phong cách',
      styleHeader: 'Phong cách vẽ (Style Type)',
      iconTypeTriggerDefault: 'Loại Icon',
      iconTypeHeader: 'Phân loại (Icon Kind)',
      collectionsTriggerDefault: 'Bộ sưu tập',
      collectionsHeader: 'Bộ sưu tập (Collections)',
      collectionSearchPlaceholder: 'Tìm bộ sưu tập (VD: Solar, AWS, Simple Icons...)',
      noCollectionsFound: 'Không tìm thấy bộ sưu tập phù hợp',
      clearSelection: 'Bỏ chọn',
      sortTitle: 'Thứ tự sắp xếp',
      sortRecent: 'Mới cập nhật',
      sortAz: 'Tên A → Z',
      sortZa: 'Tên Z → A',
      reloadBtnTitle: 'Làm mới dữ liệu kho',
      reloadBtnText: 'Làm mới',
      reloadingText: 'Đang đồng bộ...',
      tabIcons: 'Từng Icon lẻ',
      tabCollections: 'Bộ sưu tập',
      tabBrands: 'Thương hiệu (Brands)',
      showingPrefix: 'Hiển thị',
      unitIcons: 'icons',
      unitCollections: 'bộ sưu tập',
      unitBrands: 'thương hiệu',
      loadMoreDefault: 'Tải thêm icon',
      loadingMoreIcons: 'Đang tự động tải thêm icon...',
      loadingMoreItems: 'Đang tự động tải thêm {unit}...',
      scrollLoadMore: 'Cuộn xuống để tải thêm ({shown} / {total} {unit})',
      removeFilterTag: 'Gỡ tag lọc',
      popIconKindTitle: 'Loại Icon & Brand (Icon Kind)',
      popIconKindHint: 'Gắn tag để lọc nhanh',
      popCategoriesTitle: 'Chủ đề (Categories)',
      popStylesTitle: 'Phong cách (Styles)',
      popTopColsTitle: 'Bộ sưu tập nổi bật (Mở màn hình Bộ sưu tập)',
      chipCategory: 'Chủ đề',
      chipStyle: 'Phong cách',
      chipType: 'Loại',
      chipCollection: 'Bộ sưu tập',
      chipLetter: 'Chữ cái',
      chipKeyword: 'Từ khóa',
      chipFavorites: 'Đã yêu thích',
      clearAllFilters: 'Xóa tất cả bộ lọc',
      emptyColsTitle: 'Không tìm thấy {unit} nào khớp bộ lọc',
      emptyColsDesc: 'Hãy thử chọn chủ đề khác hoặc đặt lại bộ lọc để xem toàn bộ danh sách.',
      emptyIconsTitle: 'Không tìm thấy icon SVG nào khớp bộ lọc',
      emptyIconsDesc: 'Hãy thử xóa bớt từ khóa hoặc đặt lại bộ lọc để xem toàn bộ kho lưu trữ.',
      resetFiltersBtn: 'Đặt lại bộ lọc',
      variantsTooltip: 'Có {count} biến thể',
      copySvgTitle: 'Copy mã SVG gốc',
      copyJsxTitle: 'Copy React JSX',
      downloadSvgTitle: 'Tải file .svg',
      favoriteTitle: 'Yêu thích',
      toastRateLimit: 'Bạn thao tác quá nhanh, vui lòng đợi vài giây...',
      toastPngCopied: 'Đã copy ảnh PNG ({size}×{size}px) vào Clipboard',
      toastPngDownloaded: 'Đã tải xuống {file}',
      toastSvgCopied: 'Đã copy mã SVG vào Clipboard',
      toastJsxCopied: 'Đã copy component <{comp} /> (JSX)',
      toastVueCopied: 'Đã copy mã Vue Template',
      toastDataUriCopied: 'Đã copy SVG Data URI',
      toastFileDownloaded: 'Đã tải xuống {file}',
      toastCodeCopied: 'Đã copy mã {tab}',
      toastHexCopied: 'Đã copy mã màu {hex}',
      toastColNotFound: 'Không tìm thấy bộ sưu tập này',
      toastColLinkCopied: 'Đã copy đường dẫn bộ sưu tập',
      toastIconNotFound: 'Không tìm thấy dữ liệu chi tiết cho icon này',
      toastIconLinkCopied: 'Đã copy đường dẫn chi tiết icon',
      toastFavAdded: 'Đã lưu vào danh sách Yêu thích',
      toastFavRemoved: 'Đã bỏ khỏi danh sách Yêu thích',
      toastSynced: 'Đã đồng bộ kho SVGCraft ({count} icons)',
      colPageTitleSuffix: 'Bộ sưu tập SVG Icons | SVGCraft',
      colBackCatalog: 'Quay lại Kho lưu trữ',
      colBreadcrumb: 'Bộ sưu tập',
      colShareTitle: 'Copy liên kết bộ sưu tập',
      colStatCount: 'Số lượng:',
      colStatLicense: 'Giấy phép:',
      colStatAuthor: 'Tác giả:',
      colSearchPlaceholder: 'Tìm icon trong bộ sưu tập {name}...',
      colAllStyles: 'Tất cả ({count})',
      colEmptySearch: 'Không tìm thấy icon nào khớp từ khóa trong bộ sưu tập này.',
      colLoadMoreBtn: 'Tải thêm icon trong bộ sưu tập ({shown} / {total})',
      detailBack: 'Quay lại',
      detailPrevTitle: 'Icon trước đó (←)',
      detailNextTitle: 'Icon tiếp theo (→)',
      detailFavTitle: 'Lưu vào Yêu thích',
      detailShareTitle: 'Copy liên kết trực tiếp',
      stageToneChecker: 'Nền trong suốt (Checkerboard)',
      stageToneDark: 'Nền tối (Dark)',
      stageToneLight: 'Nền sáng (Light)',
      stageToneAuto: 'Nền tự động theo giao diện (Auto)',
      stageKeylineTitle: 'Bật/Tắt lưới chuẩn thiết kế (Keyline Grid)',
      stageZoomOutTitle: 'Thu nhỏ',
      stageZoomInTitle: 'Phóng to',
      stageZoomResetTitle: 'Cuộn chuột để Zoom tại con trỏ · Bấm để đặt lại 100%',
      stageCanvasTitle: 'Cuộn chuột để phóng to/thu nhỏ tại vị trí con trỏ · Kéo giữ chuột để di chuyển trong khung',
      stageColorLabel: 'Đổi màu:',
      stageResetColorTitle: 'Khôi phục màu gốc',
      detailVariantsTitle: 'Biến thể ({count} Variants)',
      detailPaletteTitle: 'Bảng màu gốc trong SVG (Bấm để copy HEX)',
      detailStylePrefix: 'Phong cách:',
      detailDownloadSvgBtn: 'Tải .SVG',
      detailPngExportTitle: 'Xuất ảnh PNG chất lượng cao:',
      detailPngBtnTitle: 'Tải file PNG {size}×{size}px',
      detailCopyPngTitle: 'Copy ảnh PNG 256px vào Clipboard',
      detailCopyCodeBtn: 'Copy Code',
      detailCopiedBtn: 'Đã Copy',
      metaCollection: 'Bộ sưu tập',
      metaGridSize: 'Kích thước lưới',
      metaFileSize: 'Dung lượng',
      metaLicense: 'Giấy phép (License)',
      metaAuthor: 'Tác giả',
      detailTagsLabel: 'Từ khóa phân loại (Bấm vào tag để tìm các icon cùng từ khóa)',
      recSimilarTitle: 'Gợi ý tương đồng (Cùng từ khóa, chủ đề & phong cách)',
      recSameStyleTitle: 'Cùng phong cách "{style}" & chủ đề "{category}"',
      recSameColTitle: 'Cùng bộ sưu tập "{collection}"',
      recViewAllCol: 'Xem toàn bộ bộ sưu tập',
      recEmpty: 'Chưa có thêm icon trong nhóm này.',
      customizerTitle: 'Tuỳ chỉnh Vector (Màu sắc · Nền · Độ dày nét Stroke)',
      ctrlColors: 'Colors',
      ctrlBackground: 'Background',
      ctrlTransparent: 'Transparent',
      ctrlStroke: 'Stroke',
      strokeLight: 'light',
      strokeRegular: 'regular',
      strokeBold: 'bold',
      motionPanelTitle: 'Trạng thái Chuyển động (Animation States)',
      motionLiveLoop: 'Tự chạy lặp trên khung',
      motionPlayOnce: 'Chạy thử',
      exportModeTitle: 'Tuỳ chọn xuất & tải SVG',
      exportModeStatic: 'SVG Tĩnh (Static)',
      exportModeStaticSub: 'File SVG nhẹ nguyên bản (~3–15 KB)',
      exportModeHover: 'SVG Động khi Hover',
      exportModeHoverSub: 'Tự chuyển động khi rê chuột (:hover)',
      exportModeLoop: 'SVG Động tự chạy (Auto Loop)',
      exportModeLoopSub: 'Tự chạy lặp liên tục (infinite)',
      exportPanelTitle: 'Xuất file',
      exportOptAnimation: 'Kiểu chạy',
      exportOptMotion: 'Chuyển động',
      exportMotionLoading: 'Đang tải các chuyển động…',
      exportOptSize: 'Kích thước',
      exportModeStaticShort: 'Tĩnh',
      exportModeHoverShort: 'Khi hover',
      exportModeLoopShort: 'Tự lặp',
      exportCopyBtn: 'Copy',
      exportDownloadBtn: 'Tải',
      exportLottieLoading: 'Dữ liệu Lottie đang tải…',
      exportLottieNote: 'Bản xem trước đã rút gọn — Copy / Tải sẽ lấy đủ JSON kèm màu & nét đã chỉnh.',
      exportFailed: 'Xuất file lỗi, vui lòng thử lại.',
      exportModeNotePng: 'PNG luôn là ảnh tĩnh',
      exportModeNoteHtml: 'HTML <img> dùng link file gốc',
      exportModeNoteLottie: 'Lottie JSON đã chứa toàn bộ chuyển động',
      hoverRepeatLabel: 'Khi hover:',
      hoverRepeatOnce: 'Chạy 1 lần',
      hoverRepeatLoop: 'Lặp lại',
      exportModeLottie: 'Tải Lottie .JSON',
      exportModeLottieSub: 'File dữ liệu gốc Lottie JSON',
      toastCompilingAnimSvg: 'Đang đóng gói Animation + Màu + Stroke vào file SVG...',
      lordiconAllCategories: 'Tất cả danh mục (All Categories)',
      lordiconTopicLabel: 'Danh mục Icon động:',
      categories: {
        popular: 'Phổ biến (Popular)',
        interface: 'Giao diện (Interface)',
        animals: 'Động vật (Animals)',
        'architecture-and-places': 'Kiến trúc & Địa điểm',
        'business-and-finance': 'Kinh doanh & Tài chính',
        celebrations: 'Lễ hội & Sự kiện',
        'characters-and-symbols': 'Ký tự & Biểu tượng',
        communication: 'Giao tiếp & Tin nhắn',
        culture: 'Văn hóa & Tôn giáo',
        'design-and-editing': 'Thiết kế & Chỉnh sửa',
        'fashion-and-beauty': 'Thời trang & Làm đẹp',
        'files-and-folders': 'Tệp tin & Thư mục',
        'finance-and-stats': 'Thống kê & Biểu đồ',
        'food-and-drink': 'Ẩm thực & Đồ uống',
        'games-and-toys': 'Trò chơi & Đồ chơi',
        'health-and-medical': 'Y tế & Sức khỏe',
        household: 'Đồ gia dụng & Nội thất',
        'music-and-audio': 'Âm nhạc & Âm thanh',
        'nature-and-weather': 'Thiên nhiên & Thời tiết',
        people: 'Con người & Cảm xúc',
        'photo-and-video': 'Nhiếp ảnh & Video',
        'science-and-industry': 'Khoa học & Công nghiệp',
        'security-and-military': 'Bảo mật & Quân sự',
        shopping: 'Mua sắm & Thương mại',
        'sports-and-fitness': 'Thể thao & Thể hình',
        'tech-and-devices': 'Công nghệ & Thiết bị',
        'time-and-date': 'Thời gian & Lịch',
        transport: 'Giao thông & Phương tiện',
        'work-and-education': 'Công việc & Giáo dục',
        ai: 'AI & Trí tuệ nhân tạo',
        cloud: 'Cloud & Hạ tầng mạng',
        devtools: 'Công cụ Lập trình & Code',
        brand: 'Logo Thương hiệu & Công ty',
      },
      styles: {
        outlined: 'Outlined (Nét viền)',
        filled: 'Filled (Đặc / Glyph)',
        duotone: 'Duotone (Hai tông màu)',
        multicolor: 'Multicolor (Đa sắc / Brand)',
        monocolor: 'Monocolor (Đơn sắc)',
      },
      iconTypes: {
        'ui-icon': 'UI / System Icon',
        animated: 'Animated / Motion SVG',
        'brand-logo': 'Logo Thương hiệu / Tech',
        architecture: 'Kiến trúc Cloud',
        badge: 'Huy hiệu / Nút Xác thực',
      },
    },
  };

  function t(key, vars = {}) {
    const dict = I18N[currentLang] || I18N.en;
    let str = dict[key] !== undefined ? dict[key] : I18N.en[key] || key;
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v ?? ''));
    }
    return str;
  }

  function getCatLabel(catId, fallback = '') {
    if (!catId) return fallback || 'General';
    const cleanId = String(catId).replace(/^lordicon:/, '');
    const dict = I18N[currentLang]?.categories || I18N.en.categories;
    if (dict[cleanId]) return dict[cleanId];
    const lObj = (catalogSummary?.lordiconCategories || []).find((c) => c.id === cleanId);
    if (lObj) return currentLang === 'vi' && lObj.labelVi ? lObj.labelVi : lObj.label;
    return fallback || cleanId || 'General';
  }

  function getStyleLabel(styleId, fallback = '') {
    const dict = I18N[currentLang]?.styles || I18N.en.styles;
    return dict[styleId] || fallback || styleId || '';
  }

  function getTypeLabel(typeId, fallback = '') {
    const dict = I18N[currentLang]?.iconTypes || I18N.en.iconTypes;
    return dict[typeId] || fallback || typeId || '';
  }

  const countFavorites = document.getElementById('countFavorites');
  const navAllIcons = document.getElementById('navAllIcons');
  const navAnimatedIcons = document.getElementById('navAnimatedIcons');
  const sidebarCountAnimated = document.getElementById('sidebarCountAnimated');
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
  const lordiconCategoryBar = document.getElementById('lordiconCategoryBar');
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

  // Detail-view export preferences (per viewer convenience only; safe if storage is blocked)
  // Set by the open detail view: { copy, download }
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
      showToast(t('toastRateLimit'));
      throw new Error('Rate limited (429)');
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    setCacheEntry(apiJsonCache, url, data);
    return data;
  }

  // ============================================================================
  // TOP NAVIGATION PROGRESS BAR (YouTube-style) + detail prefetch on hover
  // ============================================================================
  const topProgress = (() => {
    let el = null;
    let pending = 0;
    let value = 0;
    let trickleTimer = null;
    let hideTimer = null;

    function ensureEl() {
      if (el) return el;
      el = document.createElement('div');
      el.id = 'topProgressBar';
      el.className = 'top-progress-bar';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<div class="top-progress-fill"></div>';
      document.body.appendChild(el);
      return el;
    }

    function render() {
      const fill = ensureEl().firstElementChild;
      fill.style.transform = `scaleX(${value})`;
    }

    function start() {
      pending += 1;
      if (pending > 1) return;
      clearTimeout(hideTimer);
      clearInterval(trickleTimer);
      const bar = ensureEl();
      bar.classList.remove('is-done');
      bar.classList.add('is-active');
      value = 0.08;
      render();
      // Ease towards 90% while waiting, never completing on its own
      trickleTimer = setInterval(() => {
        value += (0.9 - value) * 0.08;
        render();
      }, 200);
    }

    function done() {
      if (pending === 0) return;
      pending -= 1;
      if (pending > 0) return;
      clearInterval(trickleTimer);
      value = 1;
      render();
      const bar = ensureEl();
      bar.classList.add('is-done');
      hideTimer = setTimeout(() => {
        bar.classList.remove('is-active', 'is-done');
        value = 0;
        render();
      }, 350);
    }

    return { start, done };
  })();

  async function withTopProgress(fn) {
    topProgress.start();
    try {
      return await fn();
    } finally {
      topProgress.done();
    }
  }

  function buildIconDetailApiUrl(collectionSlug, idOrSlug) {
    return `/api/catalog/icon/any/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(idOrSlug)}`;
  }

  function parseOpenDetailKey(key = '') {
    const parts = String(key).split(':');
    if (parts.length >= 3) return { site: parts[0], collectionSlug: parts[1], idOrSlug: parts[2] };
    return { site: 'any', collectionSlug: parts[0], idOrSlug: parts[1] };
  }

  // Warm the detail API cache when the pointer rests on a card, so the click feels instant
  let detailPrefetchTimer = null;
  let detailPrefetchTarget = null;
  document.addEventListener('pointerover', (e) => {
    const trigger = e.target.closest && e.target.closest('[data-open-detail]');
    if (!trigger || trigger === detailPrefetchTarget) return;
    detailPrefetchTarget = trigger;
    clearTimeout(detailPrefetchTimer);
    detailPrefetchTimer = setTimeout(() => {
      const { collectionSlug, idOrSlug } = parseOpenDetailKey(trigger.dataset.openDetail);
      if (!collectionSlug || !idOrSlug) return;
      apiFetchJson(buildIconDetailApiUrl(collectionSlug, idOrSlug)).catch(() => {});
    }, 120);
  });
  document.addEventListener('pointerout', (e) => {
    const trigger = e.target.closest && e.target.closest('[data-open-detail]');
    if (trigger && trigger === detailPrefetchTarget && !trigger.contains(e.relatedTarget)) {
      clearTimeout(detailPrefetchTimer);
      detailPrefetchTarget = null;
    }
  });

  async function fetchSvgTextCached(url) {
    if (!url) return '';
    if (svgTextCache.has(url)) {
      return svgTextCache.get(url);
    }
    const res = await fetch(url);
    if (res.status === 429) {
      showToast(t('toastRateLimit'));
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

  window.addEventListener('svgcraft:favorites', () => {
    favorites = new Set(JSON.parse(localStorage.getItem('svg_hub_favs') || '[]'));
    countFavorites.textContent = favorites.size;
    document.querySelectorAll('[data-toggle-fav]').forEach((btn) => {
      const on = favorites.has(btn.dataset.toggleFav);
      btn.classList.toggle('fav-active', on);
      btn.innerHTML = on ? ICONS.heartFilled : ICONS.heart;
    });
  });

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
    const cleanKey = String(iconKeyOrId || '').replace(/^lordicon:/, '');
    const mapByCatId = {
      popular: ICONS.sparkles,
      interface: ICONS.sliders,
      animals: ICONS.sun,
      'architecture-and-places': ICONS.home,
      'business-and-finance': ICONS.wallet,
      celebrations: ICONS.sparkles,
      'characters-and-symbols': ICONS.code,
      communication: ICONS['message-square'],
      culture: ICONS.compass,
      'design-and-editing': ICONS['pen-tool'],
      'fashion-and-beauty': ICONS.sparkles,
      'files-and-folders': ICONS.layers,
      'finance-and-stats': ICONS.activity,
      'food-and-drink': ICONS.coffee,
      'games-and-toys': ICONS['play-circle'],
      'health-and-medical': ICONS.activity,
      household: ICONS.home,
      'music-and-audio': ICONS.waveform,
      'nature-and-weather': ICONS.sun,
      people: ICONS['message-square'],
      'photo-and-video': ICONS['play-circle'],
      'science-and-industry': ICONS.cpu,
      'security-and-military': ICONS.shield,
      shopping: ICONS.wallet,
      'sports-and-fitness': ICONS.activity,
      'tech-and-devices': ICONS.cpu,
      'time-and-date': ICONS.compass,
      transport: ICONS.compass,
      'work-and-education': ICONS.layers,
      ai: ICONS.sparkles,
      cloud: ICONS.cloud,
      devtools: ICONS.code,
      brand: ICONS.hexagon,
    };
    return ICONS[cleanKey] || mapByCatId[cleanKey] || ICONS.waveform || ICONS.hexagon;
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

  // Export SVG string to PNG via HTML5 Canvas (32px - 512px)
  // ============================================================================
  // ALPHABET BAR
  // ============================================================================
  function initAlphabetBar() {
    const chars = ['', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
    alphabetBar.innerHTML = chars
      .map((ch) => {
        const label = ch === '' ? t('resetAll') : ch;
        const isActive = filters.letter === ch;
        return `<button type="button" class="alpha-btn ${isActive ? 'active' : ''}" data-letter="${ch}">${escapeHtml(label)}</button>`;
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
      filterCollectionOptions.innerHTML = `<div style="padding:14px 10px;text-align:center;color:var(--text-dim);font-size:0.78rem">${escapeHtml(t('noCollectionsFound'))}</div>`;
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
  function renderSidebarCategoriesList() {
    if (!catalogSummary || !sidebarCategories) return;

    const isAnimContext =
      viewMode === 'icons' &&
      !activeCollectionState &&
      !filters.onlyFavorites &&
      (filters.iconType === 'animated' ||
        String(filters.collection || '').startsWith('lordicon-'));
    const isBrandsContext = viewMode === 'brands' && !activeCollectionState;

    const lCatCountMap = new Map(
      (catalogSummary.lordiconCategories || []).map((lc) => [lc.id, lc.count || 0])
    );

    const visibleCats = (catalogSummary.categories || [])
      .filter((c) => c.id !== 'animation')
      .map((c) => {
        let modeCount = c.count || 0;
        if (isAnimContext) {
          modeCount = c.animatedCount !== undefined ? c.animatedCount : lCatCountMap.get(c.id) || 0;
        } else if (isBrandsContext && c.brandCount !== undefined) {
          modeCount = c.brandCount;
        }
        return { ...c, modeCount };
      })
      .filter((c) => c.modeCount > 0 || filters.category === c.id);

    sidebarCategories.innerHTML = visibleCats
      .map(
        (c) => `
        <button type="button" class="nav-item ${filters.category === c.id ? 'active' : ''}" data-filter-cat="${escapeHtml(c.id)}">
          <span class="nav-item-left">
            <span class="nav-icon">${getCategoryIconSvg(c.id || c.icon)}</span>
            <span>${escapeHtml(getCatLabel(c.id, c.label))}</span>
          </span>
          <span class="nav-count">${(c.modeCount || 0).toLocaleString()}</span>
        </button>
      `
      )
      .join('');
  }

  function renderSummaryTaxonomyLists() {
    if (!catalogSummary) return;

    // 1. Left Sidebar: Context-aware Thematic Categories (never shows empty 0-count rows)
    renderSidebarCategoriesList();

    // 2. Top Dropdown: Styles
    filterStyleOptions.innerHTML = (catalogSummary.styles || [])
      .map(
        (s) => `
        <button type="button" class="dropdown-option ${filters.styleType === s.id ? 'active' : ''}" data-filter-style="${escapeHtml(s.id)}">
          <span class="dropdown-option-left">
            <span class="nav-icon">${getStyleIconSvg(s.id)}</span>
            <span class="dropdown-option-title">${escapeHtml(getStyleLabel(s.id, s.label))}</span>
          </span>
          <span class="nav-count">${(s.count || 0).toLocaleString()}</span>
        </button>
      `
      )
      .join('');

    // 3. Top Dropdown: Icon Types
    filterIconTypeOptions.innerHTML = (catalogSummary.iconTypes || [])
      .map(
        (tItem) => `
        <button type="button" class="dropdown-option ${filters.iconType === tItem.id ? 'active' : ''}" data-filter-type="${escapeHtml(tItem.id)}">
          <span class="dropdown-option-left">
            <span class="nav-icon">${getIconTypeSvg(tItem.id)}</span>
            <span class="dropdown-option-title">${escapeHtml(getTypeLabel(tItem.id, tItem.label))}</span>
          </span>
          <span class="nav-count">${(tItem.count || 0).toLocaleString()}</span>
        </button>
      `
      )
      .join('');

    // 4. Top Dropdown: Collections
    renderCollectionsDropdownList(collectionSearchInput.value);
  }

  async function loadSummary(bypassCache = false) {
    catalogSummary = await apiFetchJson('/api/catalog/summary?v=4', { bypassCache });

    countFavorites.textContent = favorites.size;
    const totalColsCount = catalogSummary.totalCollections || (catalogSummary.collections || []).length;
    badgeTotalCollections.textContent = totalColsCount;
    if (sidebarCountCollections) {
      sidebarCountCollections.textContent = totalColsCount.toLocaleString();
    }
    if (sidebarCountBrands) {
      sidebarCountBrands.textContent = (catalogSummary.totalBrands || 49).toLocaleString();
    }
    if (sidebarCountAnimated) {
      const animTypeObj = (catalogSummary.iconTypes || []).find((tItem) => tItem.id === 'animated');
      const animCatObj = (catalogSummary.categories || []).find((c) => c.id === 'animation');
      const animCount = animTypeObj?.count ?? animCatObj?.count ?? 0;
      sidebarCountAnimated.textContent = animCount.toLocaleString();
    }

    renderSummaryTaxonomyLists();
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

    const isAnimatedExplorerActive =
      viewMode === 'icons' &&
      !activeCollectionState &&
      !filters.onlyFavorites &&
      (filters.iconType === 'animated' ||
        String(filters.category || '').startsWith('lordicon:') ||
        String(filters.collection || '').startsWith('lordicon-'));

    navAllIcons.classList.toggle('active', isAllIcons);
    if (navAnimatedIcons) {
      navAnimatedIcons.classList.toggle('active', isAnimatedExplorerActive);
    }
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
        viewMode === 'brands'
          ? t('unitBrands')
          : viewMode === 'collections'
            ? t('unitCollections')
            : t('unitIcons');
    }
    if (iconsGrid && collectionsDirectoryGrid) {
      iconsGrid.style.display = isDirMode ? 'none' : 'grid';
      collectionsDirectoryGrid.style.display = isDirMode ? 'grid' : 'none';
    }

    renderSidebarCategoriesList();

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
    labelTriggerStyle.textContent = selectedStyleObj
      ? getStyleLabel(selectedStyleObj.id, selectedStyleObj.label).split(' (')[0]
      : t('styleTriggerDefault');
    btnTriggerStyle.classList.toggle('has-value', Boolean(filters.styleType));

    const selectedTypeObj = (catalogSummary?.iconTypes || []).find((tItem) => tItem.id === filters.iconType);
    labelTriggerIconType.textContent = selectedTypeObj
      ? getTypeLabel(selectedTypeObj.id, selectedTypeObj.label)
      : t('iconTypeTriggerDefault');
    btnTriggerIconType.classList.toggle('has-value', Boolean(filters.iconType));

    const selectedColObj = (catalogSummary?.collections || []).find((c) => c.slug === activeColSlug);
    labelTriggerCollections.textContent = selectedColObj
      ? selectedColObj.name.length > 20
        ? selectedColObj.name.slice(0, 18) + '…'
        : selectedColObj.name
      : t('collectionsTriggerDefault');
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
        label: getCatLabel(filters.category, catObj?.label).split(' & ')[0],
        icon: getCategoryIconSvg(filters.category),
      });
    }
    if (filters.iconType) {
      const tpObj = (catalogSummary?.iconTypes || []).find((tItem) => tItem.id === filters.iconType);
      inlineTags.push({
        key: 'iconType',
        label: getTypeLabel(filters.iconType, tpObj?.label),
        icon: getIconTypeSvg(filters.iconType),
      });
    }
    if (filters.styleType) {
      const stObj = (catalogSummary?.styles || []).find((s) => s.id === filters.styleType);
      inlineTags.push({
        key: 'styleType',
        label: getStyleLabel(filters.styleType, stObj?.label).split(' (')[0],
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
        (tag) => `
        <span class="search-inline-chip">
          <span class="icon-inline" style="width:12px;height:12px">${tag.icon}</span>
          <span>${escapeHtml(tag.label)}</span>
          <button type="button" data-remove-inline-tag="${tag.key}" title="${escapeHtml(t('removeFilterTag'))}">${ICONS.close}</button>
        </span>
      `
      )
      .join('');
  }

  function renderSearchPopoverContent() {
    if (!searchPopoverContent || !catalogSummary) return;

    const categories = (catalogSummary.categories || []).filter((c) => c.id !== 'animation' && (c.count || 0) > 0);
    const iconTypes = catalogSummary.iconTypes || [];
    const styles = catalogSummary.styles || [];
    const topCols = (catalogSummary.collections || []).slice(0, 8);

    searchPopoverContent.innerHTML = `
      <div class="search-pop-group">
        <div class="search-pop-title">
          <span>${escapeHtml(t('popIconKindTitle'))}</span>
          <span style="font-weight:500;text-transform:none">${escapeHtml(t('popIconKindHint'))}</span>
        </div>
        <div class="search-pop-pills">
          ${iconTypes
            .map(
              (tItem) => `
              <button type="button" class="search-pop-pill ${filters.iconType === tItem.id ? 'active' : ''}" data-pop-tag-type="iconType" data-pop-tag-val="${escapeHtml(tItem.id)}">
                <span class="icon-inline">${getIconTypeSvg(tItem.id)}</span>
                <span>${escapeHtml(getTypeLabel(tItem.id, tItem.label))}</span>
                <span class="pill-count">${(tItem.count || 0).toLocaleString()}</span>
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      <div class="search-pop-group">
        <div class="search-pop-title">
          <span>${escapeHtml(t('popCategoriesTitle'))}</span>
        </div>
        <div class="search-pop-pills">
          ${categories
            .map(
              (c) => `
              <button type="button" class="search-pop-pill ${filters.category === c.id ? 'active' : ''}" data-pop-tag-type="category" data-pop-tag-val="${escapeHtml(c.id)}">
                <span class="icon-inline">${getCategoryIconSvg(c.id)}</span>
                <span>${escapeHtml(getCatLabel(c.id, c.label))}</span>
                <span class="pill-count">${(c.count || 0).toLocaleString()}</span>
              </button>
            `
            )
            .join('')}
        </div>
      </div>

      <div class="search-pop-group">
        <div class="search-pop-title">
          <span>${escapeHtml(t('popStylesTitle'))}</span>
        </div>
        <div class="search-pop-pills">
          ${styles
            .map(
              (s) => `
              <button type="button" class="search-pop-pill ${filters.styleType === s.id ? 'active' : ''}" data-pop-tag-type="styleType" data-pop-tag-val="${escapeHtml(s.id)}">
                <span class="icon-inline">${getStyleIconSvg(s.id)}</span>
                <span>${escapeHtml(getStyleLabel(s.id, s.label).split(' (')[0])}</span>
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
            <span>${escapeHtml(t('popTopColsTitle'))}</span>
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

  const ANIMATED_STYLE_PACKS_ORDER = [
    { slug: 'lordicon-wired-outline', label: 'Wired Outline', styleType: 'duotone' },
    { slug: 'lordicon-wired-flat', label: 'Wired Flat', styleType: 'multicolor' },
    { slug: 'lordicon-wired-lineal', label: 'Wired Lineal', styleType: 'multicolor' },
    { slug: 'lordicon-wired-gradient', label: 'Wired Gradient', styleType: 'multicolor' },
    { slug: 'lordicon-doodle-color', label: 'Doodle Color', styleType: 'multicolor' },
    { slug: 'lordicon-doodle-motif', label: 'Doodle Motif', styleType: 'duotone' },
    { slug: 'lordicon-doodle-outline', label: 'Doodle Outline', styleType: 'outlined' },
    { slug: 'lordicon-doodle-black', label: 'Doodle Black', styleType: 'filled' },
    { slug: 'lordicon-system-outline', label: 'System Outline', styleType: 'outlined' },
    { slug: 'lordicon-system-solid', label: 'System Solid', styleType: 'filled' },
  ];

  function renderLordiconCategoryBar() {
    if (!lordiconCategoryBar) return;
    const isAnimContext =
      filters.iconType === 'animated' ||
      String(filters.collection || '').startsWith('lordicon-');

    if (!isAnimContext || viewMode === 'brands' || viewMode === 'collections') {
      lordiconCategoryBar.style.display = 'none';
      return;
    }

    const activePackSlug = String(filters.collection || '').startsWith('lordicon-')
      ? filters.collection
      : '';
    const allStylesLabel = currentLang === 'vi' ? 'Tất cả kiểu' : 'All Styles';

    lordiconCategoryBar.style.display = 'flex';
    lordiconCategoryBar.innerHTML = `
      <span class="lordicon-row-badge">
        <span class="icon-inline">${ICONS.sliders}</span>
        <span>${currentLang === 'vi' ? 'Kiểu vẽ:' : 'Style Pack:'}</span>
      </span>
      <div class="lordicon-cat-pills">
        <button type="button" class="pill-btn ${!activePackSlug ? 'active' : ''}" data-lordicon-pack="">
          <span>${escapeHtml(allStylesLabel)}</span>
        </button>
        ${ANIMATED_STYLE_PACKS_ORDER.map(
          (pk) => `
          <button type="button" class="pill-btn ${activePackSlug === pk.slug ? 'active' : ''}" data-lordicon-pack="${escapeHtml(pk.slug)}">
            <span class="icon-inline">${getStyleIconSvg(pk.styleType)}</span>
            <span>${escapeHtml(pk.label)}</span>
          </button>
        `
        ).join('')}
      </div>
    `;
  }

  if (lordiconCategoryBar) {
    lordiconCategoryBar.addEventListener('click', (e) => {
      const packBtn = e.target.closest('[data-lordicon-pack]');
      if (!packBtn) return;
      const packSlug = packBtn.dataset.lordiconPack;
      filters.iconType = 'animated';
      filters.collection = filters.collection === packSlug && packSlug ? '' : packSlug;
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
    });
  }

  function renderActiveFiltersChips() {
    renderSearchInlineChips();
    renderSearchPopoverContent();
    renderLordiconCategoryBar();

    const isAnimContext =
      viewMode === 'icons' &&
      (filters.iconType === 'animated' || String(filters.collection || '').startsWith('lordicon-'));

    heroHeading.textContent =
      viewMode === 'brands'
        ? t('heroHeadingBrands')
        : viewMode === 'collections'
          ? t('heroHeadingCollections')
          : isAnimContext
            ? currentLang === 'vi'
              ? '20.000+ Icon Động Vector. Tuỳ chỉnh Màu, Nét & Xuất SVG/Lottie.'
              : '20,000+ Animated Vector Icons. Customize Colors, Stroke & Export.'
            : t('heroHeadingIcons');

    const chips = [];
    if (filters.category) {
      const catObj = (catalogSummary?.categories || []).find((c) => c.id === filters.category);
      chips.push({ key: 'category', label: `${t('chipCategory')}: ${getCatLabel(filters.category, catObj?.label)}` });
    }
    if (filters.styleType) {
      const stObj = (catalogSummary?.styles || []).find((s) => s.id === filters.styleType);
      chips.push({ key: 'styleType', label: `${t('chipStyle')}: ${getStyleLabel(filters.styleType, stObj?.label)}` });
    }
    if (filters.iconType && filters.iconType !== 'animated') {
      const tpObj = (catalogSummary?.iconTypes || []).find((tItem) => tItem.id === filters.iconType);
      chips.push({ key: 'iconType', label: `${t('chipType')}: ${getTypeLabel(filters.iconType, tpObj?.label)}` });
    }
    if (filters.collection) {
      const colObj = (catalogSummary?.collections || []).find((c) => c.slug === filters.collection);
      chips.push({ key: 'collection', label: `${t('chipCollection')}: ${colObj ? colObj.name : filters.collection}` });
    }
    if (filters.letter) chips.push({ key: 'letter', label: `${t('chipLetter')}: ${filters.letter}` });
    if (filters.q) chips.push({ key: 'q', label: `${t('chipKeyword')}: "${filters.q}"` });
    if (filters.onlyFavorites) chips.push({ key: 'onlyFavorites', label: t('chipFavorites') });

    if (chips.length === 0) {
      activeFiltersBar.style.display = 'none';
      return;
    }

    activeFiltersBar.style.display = 'flex';
    activeFiltersBar.innerHTML =
      chips
        .map(
          (c) => `
        <span class="filter-tag">
          <span>${escapeHtml(c.label)}</span>
          <button type="button" data-clear-key="${c.key}" title="${escapeHtml(t('removeFilterTag'))}">${ICONS.close}</button>
        </span>
      `
        )
        .join('') +
      `<button type="button" class="pill-btn" id="btnClearAllFilters" style="font-size:0.74rem;padding:4px 10px">${escapeHtml(t('clearAllFilters'))}</button>`;
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
      category: String(params.get('category') || '').replace(/^lordicon:/, ''),
      styleType: params.get('style') || '',
      iconType: params.get('type') || '',
      site: params.get('site') || '',
      collection: params.get('collection') || '',
      letter: params.get('letter') || '',
      sort: params.get('sort') || 'recent',
      onlyFavorites: params.get('fav') === '1',
    };
    if (viewMode === 'brands') {
      filters.iconType = '';
      filters.styleType = '';
      filters.collection = '';
      filters.onlyFavorites = false;
    } else if (viewMode === 'collections') {
      filters.collection = '';
      filters.onlyFavorites = false;
    }
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

  function setCatalogViewMode(nextMode, resetFiltersForMode = false) {
    if (nextMode !== 'icons' && nextMode !== 'collections' && nextMode !== 'brands') return;
    if (resetFiltersForMode) {
      filters.category = '';
      filters.styleType = '';
      filters.iconType = '';
      filters.collection = '';
      filters.letter = '';
      filters.onlyFavorites = false;
      initAlphabetBar();
    } else {
      if (nextMode === 'collections' || nextMode === 'brands') {
        filters.onlyFavorites = false;
        filters.collection = '';
      }
      if (nextMode === 'brands') {
        filters.iconType = '';
        filters.styleType = '';
      }
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
      setCatalogViewMode(btn.dataset.viewMode, false);
    });
  }

  // ============================================================================
  // VIEW SWITCHING (CATALOG VIEW vs COLLECTION VIEW vs DETAIL VIEW)
  // ============================================================================
  function showCatalogView(pushHistory = false) {
    activeDetailIconKey = null;
    activeCollectionState = null;
    window.svgcraftDetail.close();
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
    const unitNoun = isBrands ? t('unitBrands') : t('unitCollections');
    if (resetOffset) {
      currentOffset = 0;
      if (activeIconsAbortController) {
        activeIconsAbortController.abort();
      }
      activeIconsAbortController = new AbortController();
    } else {
      isLoadingMore = true;
      loadMoreLabel.textContent = t('loadingMoreItems', { unit: unitNoun });
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
        loadMoreLabel.textContent = t('scrollLoadMore', {
          shown: currentCollections.length.toLocaleString(),
          total: totalMatched.toLocaleString(),
          unit: unitNoun,
        });
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
        const catLabel = getCatLabel(col.primaryCategory, catObj?.label).split(' & ')[0];
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
                <span class="col-dir-count-pill">${(col.count || 0).toLocaleString()} ${escapeHtml(t('unitIcons'))}</span>
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
    const unitNoun = isBrands ? t('unitBrands') : t('unitCollections');
    if (!append && !cols.length) {
      collectionsDirectoryGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:56px 20px;color:var(--text-muted);border:1px dashed var(--border-subtle);border-radius:16px">
          <div style="display:inline-flex;padding:12px;border-radius:12px;background:var(--bg-card);margin-bottom:10px;color:var(--brand-orange)">
            ${isBrands ? ICONS.hexagon : ICONS.folder}
          </div>
          <p style="font-size:1rem;font-weight:600;color:var(--text-main);margin-bottom:6px">${escapeHtml(
            t('emptyColsTitle', { unit: unitNoun })
          )}</p>
          <p style="font-size:0.83rem;margin-bottom:16px">${escapeHtml(t('emptyColsDesc'))}</p>
          <button type="button" class="pill-btn active" id="btnEmptyColResetFilters">${escapeHtml(
            t('resetFiltersBtn')
          )}</button>
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
      loadMoreLabel.textContent = t('loadingMoreIcons');
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
          ? currentLang === 'vi'
            ? '500.000+'
            : '500,000+'
          : totalMatched.toLocaleString();

      if (!filters.onlyFavorites && currentItems.length < totalMatched) {
        loadMoreWrap.style.display = 'flex';
        loadMoreLabel.textContent = t('scrollLoadMore', {
          shown: currentItems.length.toLocaleString(),
          total: totalMatched.toLocaleString(),
          unit: t('unitIcons'),
        });
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

  // ============================================================================
  // LORDICON LOTTIE ENGINE, MULTI-COLOR / STROKE CUSTOMIZER & ANIMATED SVG COMPILER
  // ============================================================================
  function ensureLottieWebLoaded() {
    // Self-hosted chunk provided by the React bundle (features/icon-studio/lottie.ts)
    return window.svgcraftLoadLottie();
  }

  /**
   * Compile a Lordicon Lottie animation + selected Motion State + Custom Colors/Stroke/Background
   * into a single standalone animated `.svg` file (either `hover` or `loop` trigger).
   * Optimized to strip unused `<defs>`, hidden precomps, round float precision, and merge identical frames
   * so only the exact data needed for the selected single animation is embedded.
   */
  function buildIconCardsHtml(items) {
    return items
      .map((ic, idx) => {
        const cleanKey = `${ic.collectionSlug}:${ic.id || ic.slug}`;
        const legacyKey = `${ic.site}:${ic.collectionSlug}:${ic.id || ic.slug}`;
        const isFav = favorites.has(cleanKey) || favorites.has(legacyKey);
        const variantCount = Object.keys(ic.variants || {}).length;
        const isLordicon =
          ic.site === 'lordicon' || (ic.collectionSlug && ic.collectionSlug.startsWith('lordicon-'));
        const isAnimated = isLordicon || ic.iconType === 'animated' || ic.site === 'allsvgicons';
        const styleTitle = `${t('detailStylePrefix')} ${getStyleLabel(ic.styleType, ic.styleType)}`;
        const motionTitle = getTypeLabel('animated', 'Animated / Motion SVG');
        const subCategoryText = isLordicon
          ? ic.lordiconCategory || ic.rawCategory || ic.category
          : ic.category;
        const loadingAttr = idx < 24 ? 'eager' : 'lazy';
        const priorityAttr = idx < 12 ? ' fetchpriority="high"' : '';

        return `
          <article class="icon-card" data-icon-card="${escapeHtml(cleanKey)}">
            <div class="icon-preview-area" data-open-detail="${escapeHtml(cleanKey)}" ${
              isLordicon
                ? `data-lordicon-col="${escapeHtml(ic.collectionSlug)}" data-lordicon-slug="${escapeHtml(ic.slug)}"`
                : ''
            }>
              <div class="card-badges-top">
                <span class="micro-icon-badge" title="${escapeHtml(styleTitle)}">${getStyleIconSvg(ic.styleType)}</span>
                ${
                  isAnimated
                    ? `<span class="micro-icon-badge motion-badge" title="${escapeHtml(motionTitle)}">${ICONS.waveform}</span>`
                    : variantCount > 1
                      ? `<span class="micro-badge" title="${escapeHtml(t('variantsTooltip', { count: variantCount }))}">${variantCount}v</span>`
                      : `<span class="micro-badge">${escapeHtml(ic.gridSize || '24x24')}</span>`
                }
              </div>
              <img src="${escapeHtml(ic.assetUrl)}" alt="${escapeHtml(ic.title)}" loading="${loadingAttr}"${priorityAttr} decoding="async" />
            </div>

            <div class="icon-info-area" data-open-detail="${escapeHtml(cleanKey)}">
              <div class="icon-name" title="${escapeHtml(ic.title)}">${escapeHtml(ic.title || ic.slug)}</div>
              <div class="icon-sub">${escapeHtml(subCategoryText)} · ${escapeHtml(ic.collectionName)}</div>
            </div>

            <div class="icon-actions-bar">
              <button type="button" class="act-btn" data-copy-svg="${escapeHtml(ic.assetUrl)}" title="${escapeHtml(t('copySvgTitle'))}">SVG</button>
              <button type="button" class="act-btn" data-copy-jsx="${escapeHtml(ic.assetUrl)}" data-title="${escapeHtml(ic.slug)}" title="${escapeHtml(t('copyJsxTitle'))}">JSX</button>
              <a href="${escapeHtml(ic.assetUrl)}" download="${escapeHtml(ic.fileName)}" class="act-btn" title="${escapeHtml(t('downloadSvgTitle'))}">${ICONS.download}</a>
              <button type="button" class="act-btn ${isFav ? 'fav-active' : ''}" data-toggle-fav="${escapeHtml(cleanKey)}" title="${escapeHtml(t('favoriteTitle'))}">
                ${isFav ? ICONS.heartFilled : ICONS.heart}
              </button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  // Hover animation on Grid Cards for Lordicon icons
  function setupLordiconGridHover(gridEl) {
    if (!gridEl || gridEl.__lordiconHoverBound) return;
    gridEl.__lordiconHoverBound = true;

    gridEl.addEventListener('pointerover', async (e) => {
      const previewArea = e.target.closest('.icon-preview-area[data-lordicon-slug]');
      if (!previewArea || previewArea.__hoverActive) return;
      previewArea.__hoverActive = true;

      const col = previewArea.dataset.lordiconCol;
      const slug = previewArea.dataset.lordiconSlug;
      if (!col || !slug) return;

      const cleanupLottieLayer = () => {
        if (previewArea.__lottieAnim) {
          try {
            previewArea.__lottieAnim.destroy();
          } catch {
            // Ignore
          }
          previewArea.__lottieAnim = null;
        }
        const layer = previewArea.querySelector('.lordicon-grid-lottie-layer');
        if (layer) layer.remove();
        const img = previewArea.querySelector('img');
        if (img) img.style.opacity = '';
      };

      const onLeave = () => {
        previewArea.__hoverActive = false;
        previewArea.removeEventListener('pointerleave', onLeave);
        const img = previewArea.querySelector('img');
        const imgReady = img && img.complete && img.naturalWidth > 0;
        if (!imgReady && previewArea.__lottieAnim) {
          try {
            // Reset segments first: goToAndStop() is segment-relative after playSegments()
            previewArea.__lottieAnim.resetSegments(true);
            previewArea.__lottieAnim.goToAndStop(previewArea.__lottieStartFrame || 0, true);
          } catch {
            // Ignore
          }
          if (img) {
            img.addEventListener(
              'load',
              () => {
                if (!previewArea.__hoverActive) cleanupLottieLayer();
              },
              { once: true }
            );
          }
          return;
        }
        cleanupLottieLayer();
      };
      previewArea.addEventListener('pointerleave', onLeave);

      if (previewArea.__lottieAnim) {
        try {
          const seg = previewArea.__lottieSegment;
          if (seg) previewArea.__lottieAnim.playSegments(seg, true);
          else previewArea.__lottieAnim.play();
          return;
        } catch {
          cleanupLottieLayer();
        }
      }

      try {
        const [lottie, liData] = await Promise.all([
          ensureLottieWebLoaded(),
          apiFetchJson(
            `/api/lordicon/lottie?collection=${encodeURIComponent(col)}&slug=${encodeURIComponent(slug)}`
          ),
        ]);
        if (!previewArea.__hoverActive || !liData || !liData.lottie) return;

        let layer = previewArea.querySelector('.lordicon-grid-lottie-layer');
        if (!layer) {
          layer = document.createElement('div');
          layer.className = 'lordicon-grid-lottie-layer';
          previewArea.appendChild(layer);
        }
        const img = previewArea.querySelector('img');
        if (img) img.style.opacity = '0';

        const defState =
          (liData.states || []).find((s) => s.isDefault) ||
          (liData.states || []).find((s) => s.id.includes('hover')) ||
          (liData.states || [])[0];

        const anim = lottie.loadAnimation({
          container: layer,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData: JSON.parse(JSON.stringify(liData.lottie)),
        });
        previewArea.__lottieAnim = anim;
        previewArea.__lottieStartFrame = defState ? defState.startFrame : 0;
        previewArea.__lottieSegment = defState ? [defState.startFrame, defState.endFrame] : null;
        if (defState) {
          anim.playSegments([defState.startFrame, defState.endFrame], true);
        } else {
          anim.play();
        }
      } catch {
        // Ignore hover error
      }
    });
  }

  setupLordiconGridHover(iconsGrid);

  function renderIconsGrid(items, append = false) {
    if (!append && !items.length) {
      iconsGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:56px 20px;color:var(--text-muted);border:1px dashed var(--border-subtle);border-radius:16px">
          <div style="display:inline-flex;padding:12px;border-radius:12px;background:var(--bg-card);margin-bottom:10px;color:var(--brand-orange)">
            ${ICONS.sparkles}
          </div>
          <p style="font-size:1rem;font-weight:600;color:var(--text-main);margin-bottom:6px">${escapeHtml(t('emptyIconsTitle'))}</p>
          <p style="font-size:0.83rem;margin-bottom:16px">${escapeHtml(t('emptyIconsDesc'))}</p>
          <button type="button" class="pill-btn active" id="btnEmptyResetFilters">${escapeHtml(t('resetFiltersBtn'))}</button>
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
      showToast(t('toastSvgCopied'));
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
      showToast(t('toastJsxCopied', { comp: compName }));
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
  function openCollectionPage(site, collectionSlug, pushHistory = true, initialParams = {}) {
    return withTopProgress(() => openCollectionPageImpl(site, collectionSlug, pushHistory, initialParams));
  }

  async function openCollectionPageImpl(site, collectionSlug, pushHistory = true, initialParams = {}) {
    const safeSite = 'any';
    const initQ = initialParams.q || '';
    const initStyle = initialParams.styleType || '';
    const initCat = initialParams.category || '';
    const initSort = initialParams.sort || 'az';

    const queryInit = new URLSearchParams({
      q: initQ,
      styleType: initStyle,
      category: initCat,
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
      showToast(t('toastColNotFound'));
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
      category: initCat,
      sort: initSort,
      offset: 0,
      total: data.total || 0,
      items: data.items || [],
      isLoading: false,
    };

    syncCollectionUrl(pushHistory);
    updateNavActiveStates();

    document.title = `${col.name} — ${t('colPageTitleSuffix')}`;
    catalogView.style.display = 'none';
    window.svgcraftDetail.close();
    detailView.style.display = 'none';
    collectionView.style.display = 'block';
    brandGlowBackdrop.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const authorLabel =
      !col.author || /^(thesvg|svg\s*repo)$/i.test(String(col.author).trim()) ? 'Open Source' : col.author;

    const isLordiconStylePack =
      String(col.slug || '').startsWith('lordicon-') && !String(col.slug || '').startsWith('lordicon-cat-');
    const lCats = catalogSummary?.lordiconCategories || [];

    collectionView.innerHTML = `
      <div class="detail-topbar">
        <div class="detail-breadcrumbs">
          <button type="button" class="btn-back-catalog" id="btnColBackCatalog">
            ${ICONS.arrowLeft}
            <span>${escapeHtml(t('colBackCatalog'))}</span>
          </button>
          <span class="crumb-sep">${ICONS.chevronRight}</span>
          <span style="color:var(--text-muted)">${escapeHtml(t('colBreadcrumb'))}</span>
          <span class="crumb-sep">${ICONS.chevronRight}</span>
          <span class="crumb-current">${escapeHtml(col.name)}</span>
        </div>
        <div class="detail-nav-actions">
          <button type="button" class="icon-btn-square" id="btnColShare" title="${escapeHtml(t('colShareTitle'))}">
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
                <span class="col-stat-pill">${escapeHtml(t('colStatCount'))} <strong>${(col.totalIconsInCollection || data.total || 0).toLocaleString()} ${escapeHtml(t('unitIcons'))}</strong></span>
                <span class="col-stat-pill">${escapeHtml(t('colStatLicense'))} <strong>${escapeHtml(col.license || 'MIT / CC0')}</strong></span>
                <span class="col-stat-pill">${escapeHtml(t('colStatAuthor'))} <strong>${escapeHtml(authorLabel)}</strong></span>
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
            <input type="search" id="colLocalSearchInput" value="${escapeHtml(initQ)}" placeholder="${escapeHtml(t('colSearchPlaceholder', { name: col.name }))}" autocomplete="off" />
          </div>

          ${
            isLordiconStylePack && lCats.length
              ? `
            <div class="lordicon-cat-select-wrap">
              <span class="icon-inline" style="color:var(--brand-orange)">${ICONS.waveform}</span>
              <select id="colLordiconCatSelect" aria-label="${escapeHtml(t('lordiconTopicLabel'))}">
                <option value="" ${!initCat ? 'selected' : ''}>${escapeHtml(t('lordiconAllCategories'))} (${(col.totalIconsInCollection || 0).toLocaleString()})</option>
                ${lCats
                  .map((lc) => {
                    const lbl = currentLang === 'vi' && lc.labelVi ? `${lc.label} (${lc.labelVi})` : lc.label;
                    return `<option value="${escapeHtml(lc.id)}" ${initCat === lc.id ? 'selected' : ''}>${escapeHtml(lbl)}</option>`;
                  })
                  .join('')}
              </select>
            </div>
          `
              : ''
          }

          <div class="col-filter-pills-group" id="colStyleFilterGroup">
            <button type="button" class="pill-btn ${!initStyle ? 'active' : ''}" data-col-style="">
              <span>${escapeHtml(t('colAllStyles', { count: (col.totalIconsInCollection || 0).toLocaleString() }))}</span>
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
              <select id="colSortSelect" aria-label="${escapeHtml(t('sortTitle'))}">
                <option value="az" ${initSort === 'az' ? 'selected' : ''}>${escapeHtml(t('sortAz'))}</option>
                <option value="za" ${initSort === 'za' ? 'selected' : ''}>${escapeHtml(t('sortZa'))}</option>
                <option value="recent" ${initSort === 'recent' ? 'selected' : ''}>${escapeHtml(t('sortRecent'))}</option>
              </select>
            </div>
            <div class="results-counter">
              ${escapeHtml(t('showingPrefix'))} <strong id="colShowingCount">${activeCollectionState.items.length}</strong> / <strong id="colTotalCount">${activeCollectionState.total}</strong>
            </div>
          </div>
        </div>
      </div>

      <div id="colIconsGrid" class="icons-grid">
        ${buildIconCardsHtml(activeCollectionState.items)}
      </div>

      <div id="colLoadMoreWrap" class="load-more-wrap" style="display:${activeCollectionState.items.length < activeCollectionState.total ? 'flex' : 'none'}">
        <button type="button" id="btnColLoadMore" class="btn-load-more">
          <span>${escapeHtml(t('colLoadMoreBtn', { shown: activeCollectionState.items.length, total: activeCollectionState.total }))}</span>
        </button>
      </div>
    `;

    // Keep currentItems synced with collection items so Prev/Next inside Detail works seamlessly
    currentItems = activeCollectionState.items;

    const colIconsGrid = document.getElementById('colIconsGrid');
    setupLordiconGridHover(colIconsGrid);
    const colLocalSearchInput = document.getElementById('colLocalSearchInput');
    const colLordiconCatSelect = document.getElementById('colLordiconCatSelect');
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
          category: activeCollectionState.category || '',
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
            colIconsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:48px 20px;color:var(--text-muted);border:1px dashed var(--border-subtle);border-radius:14px">${escapeHtml(t('colEmptySearch'))}</div>`;
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
          btnColLoadMore.innerHTML = `<span>${escapeHtml(t('colLoadMoreBtn', { shown: activeCollectionState.items.length, total: activeCollectionState.total }))}</span>`;
        } else {
          colLoadMoreWrap.style.display = 'none';
        }
      } finally {
        if (activeCollectionState) activeCollectionState.isLoading = false;
      }
    }

    if (colLordiconCatSelect) {
      colLordiconCatSelect.addEventListener('change', () => {
        activeCollectionState.category = colLordiconCatSelect.value;
        fetchCollectionFiltered(true);
      });
    }

    document.getElementById('btnColBackCatalog').addEventListener('click', () => {
      showCatalogView(true);
    });

    document.getElementById('btnColShare').addEventListener('click', async () => {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t('toastColLinkCopied'));
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
  let detailNavToken = 0;
  function openDetailPage(site, collectionSlug, idOrSlug, pushHistory = true) {
    detailNavToken += 1;
    const navToken = detailNavToken;
    return withTopProgress(() => openDetailPageImpl(site, collectionSlug, idOrSlug, pushHistory, navToken));
  }

  async function openDetailPageImpl(site, collectionSlug, idOrSlug, pushHistory, navToken) {
    let data;
    try {
      data = await apiFetchJson(buildIconDetailApiUrl(collectionSlug, idOrSlug));
    } catch {
      if (navToken === detailNavToken) showToast(t('toastIconNotFound'));
      return;
    }
    // A newer navigation started while we were waiting: drop this stale response
    if (navToken !== detailNavToken) return;

    const { icon } = data;
    const favKey = `${icon.collectionSlug}:${icon.id || icon.slug}`;
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

    // Prev / next within the list the user came from
    const currentIdx = currentItems.findIndex((it) => `${it.collectionSlug}:${it.id || it.slug}` === favKey);
    window.svgcraftDetail.open(data, {
      prev: currentIdx > 0 ? currentItems[currentIdx - 1] : null,
      next: currentIdx >= 0 && currentIdx < currentItems.length - 1 ? currentItems[currentIdx + 1] : null,
    });
  }

  // Delegate clicks on breadcrumbs, collection links, tags, style/type badges & recommended mini cards inside Detail View
  detailView.addEventListener('click', (e) => {
    // Ctrl/Cmd/middle click on the page's real links opens a new tab as usual
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    const backBtn = e.target.closest('[data-detail-back]');
    if (backBtn) {
      if (activeCollectionState && activeCollectionState.slug === activeDetailIconKey?.split(':')[0]) {
        openCollectionPage('any', activeCollectionState.slug, true);
      } else {
        showCatalogView(true);
      }
      return;
    }

    const switchCard = e.target.closest('[data-switch-icon]');
    if (switchCard) {
      e.preventDefault();
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
      e.preventDefault();
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

  if (navAnimatedIcons) {
    navAnimatedIcons.addEventListener('click', () => {
      viewMode = 'icons';
      filters.category = '';
      filters.styleType = '';
      filters.collection = '';
      filters.onlyFavorites = false;
      filters.iconType = filters.iconType === 'animated' ? '' : 'animated';
      updateNavActiveStates();
      showCatalogView(true);
      loadCatalogData(true);
    });
  }

  if (navCollectionsDirectory) {
    navCollectionsDirectory.addEventListener('click', () => {
      setCatalogViewMode('collections', true);
    });
  }

  if (navBrandsDirectory) {
    navBrandsDirectory.addEventListener('click', () => {
      setCatalogViewMode('brands', true);
    });
  }

  navFavorites.addEventListener('click', () => {
    viewMode = 'icons';
    filters.category = '';
    filters.styleType = '';
    filters.iconType = '';
    filters.collection = '';
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
    if (viewMode === 'brands') {
      viewMode = 'icons';
    }
    if (String(filters.collection).startsWith('lordicon-cat-')) {
      filters.collection = '';
    }
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
    reloadBtnText.textContent = t('reloadingText');
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
      showToast(t('toastSynced', { count: (catalogSummary?.totalIcons || 0).toLocaleString() }));
    } finally {
      reloadSpinIcon.classList.remove('spin-anim');
      reloadBtnText.textContent = t('reloadBtnText');
      btnReloadCatalog.disabled = false;
      isSyncing = false;
    }
  });

  logoResetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetAllFilters();
  });

  // ============================================================================
  // LANGUAGE SWITCHER (EN / VI) & STATIC UI TRANSLATION
  // ============================================================================
  function setTextById(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function applyLanguageUI(reRenderViews = false) {
    document.documentElement.lang = currentLang;
    window.dispatchEvent(new Event('svgcraft:lang'));
    if (langTextLabel) {
      langTextLabel.textContent = currentLang.toUpperCase();
    }
    if (btnToggleLang) {
      btnToggleLang.title = t('langTitle');
      btnToggleLang.setAttribute('aria-label', t('langTitle'));
    }
    if (btnCycleTone) {
      btnCycleTone.title = t('toneTitle');
    }
    if (btnToggleTheme) {
      btnToggleTheme.title = t('themeTitle');
    }
    setTextById('tonePrefixLabel', t('tonePrefix'));

    if (searchInput) {
      searchInput.placeholder = t('searchPlaceholder');
    }
    setTextById('sidebarExploreHeading', t('exploreHeading'));
    setTextById('navLabelAllIcons', t('navAllIcons'));
    setTextById('navLabelAnimated', t('navAnimated'));
    setTextById('navLabelCollections', t('navCollections'));
    setTextById('navLabelBrands', t('navBrands'));
    setTextById('navLabelFavorites', t('navFavorites'));
    setTextById('sidebarCategoriesHeading', t('categoriesHeading'));
    setTextById('btnResetCategory', t('resetAll'));

    const heroSub = document.getElementById('heroSubheading');
    if (heroSub) heroSub.innerHTML = t('heroSubheading');

    setTextById('headerPanelStyle', t('styleHeader'));
    setTextById('btnClearStyleDropdown', t('clearSelection'));
    setTextById('headerPanelIconType', t('iconTypeHeader'));
    setTextById('btnClearTypeDropdown', t('clearSelection'));
    setTextById('headerPanelCollections', t('collectionsHeader'));
    setTextById('btnClearColDropdown', t('clearSelection'));
    if (collectionSearchInput) {
      collectionSearchInput.placeholder = t('collectionSearchPlaceholder');
    }

    if (sortSelect) {
      sortSelect.setAttribute('aria-label', t('sortTitle'));
    }
    setTextById('optSortRecent', t('sortRecent'));
    setTextById('optSortAz', t('sortAz'));
    setTextById('optSortZa', t('sortZa'));

    if (btnReloadCatalog) {
      btnReloadCatalog.title = t('reloadBtnTitle');
    }
    if (!isSyncing && reloadBtnText) {
      reloadBtnText.textContent = t('reloadBtnText');
    }

    setTextById('tabLabelIcons', t('tabIcons'));
    setTextById('tabLabelCollections', t('tabCollections'));
    setTextById('tabLabelBrands', t('tabBrands'));
    setTextById('showingPrefixLabel', t('showingPrefix'));

    initAlphabetBar();
    renderSummaryTaxonomyLists();
    updateNavActiveStates();

    if (reRenderViews) {
      if (activeDetailIconKey) {
        // The React detail page follows the svgcraft:lang event
      } else if (activeCollectionState) {
        openCollectionPage('any', activeCollectionState.slug, false, {
          q: activeCollectionState.q,
          styleType: activeCollectionState.styleType,
          sort: activeCollectionState.sort,
        });
      } else {
        if (viewMode === 'collections' || viewMode === 'brands') {
          renderCollectionsDirectoryGrid(currentCollections, false);
          const unitNoun = viewMode === 'brands' ? t('unitBrands') : t('unitCollections');
          if (currentCollections.length < totalMatched) {
            loadMoreLabel.textContent = t('scrollLoadMore', {
              shown: currentCollections.length.toLocaleString(),
              total: totalMatched.toLocaleString(),
              unit: unitNoun,
            });
          }
        } else {
          renderIconsGrid(currentItems, false);
          if (!filters.onlyFavorites && currentItems.length < totalMatched) {
            loadMoreLabel.textContent = t('scrollLoadMore', {
              shown: currentItems.length.toLocaleString(),
              total: totalMatched.toLocaleString(),
              unit: t('unitIcons'),
            });
          }
        }
      }
    }
  }

  if (btnToggleLang) {
    btnToggleLang.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'vi' : 'en';
      localStorage.setItem('svg_hub_lang', currentLang);
      applyLanguageUI(true);
    });
  }

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
      window.dispatchEvent(new Event('svgcraft:tone'));
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

    window.dispatchEvent(new Event('svgcraft:tone'));
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

    // First load of /icon/*: the server already rendered the detail page
    if (detailView.dataset.ssrKey) {
      activeDetailIconKey = detailView.dataset.ssrKey;
      delete detailView.dataset.ssrKey;
      return;
    }

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
    applyLanguageUI(false);
    await Promise.all([
      handleInitialOrPopStateRoute(),
      loadSummary().then(() => {
        renderActiveFiltersChips();
      }),
    ]);
  }

  init();
})();

