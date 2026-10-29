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
              reject(new Error('Failed to create PNG'));
              return;
            }
            if (copyToClipboard && navigator.clipboard && window.ClipboardItem) {
              try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
                showToast(t('toastPngCopied', { size: sizePx }));
                resolve();
                return;
              } catch {
                // Fallback to download if clipboard image write fails
              }
            }
            const dlUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = dlUrl;
            const fileName = `${fileNameBase}-${sizePx}px.png`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(dlUrl), 1000);
            showToast(t('toastPngDownloaded', { file: fileName }));
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
  let lottieLoadPromise = null;
  function ensureLottieWebLoaded() {
    if (typeof window !== 'undefined' && window.lottie) {
      return Promise.resolve(window.lottie);
    }
    if (lottieLoadPromise) return lottieLoadPromise;
    lottieLoadPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
      s.async = true;
      s.onload = () => resolve(window.lottie);
      s.onerror = () => {
        lottieLoadPromise = null;
        reject(new Error('Failed to load lottie-web'));
      };
      document.head.appendChild(s);
    });
    return lottieLoadPromise;
  }

  function expandShortHex(hex = '') {
    const clean = String(hex || '').trim().toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(clean)) {
      return `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
    }
    if (/^#[0-9a-f]{6}$/.test(clean)) {
      return clean;
    }
    return null;
  }

  function extractEditableColorsFromSvg(svgText = '') {
    if (!svgText) return ['#121331'];
    const found = [];
    const seen = new Set();

    const addHex = (rawHex, label = '') => {
      const hex = expandShortHex(rawHex);
      if (!hex || seen.has(hex)) return;
      seen.add(hex);
      found.push({ hex, label: label || `Color ${found.length + 1}` });
    };

    // 1. Prioritize Lordicon semantic classes (.primary, .secondary, .tertiary, .quaternary, etc.)
    const semanticOrder = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary'];
    for (const cls of semanticOrder) {
      const clsRegex = new RegExp(`class=["'][^"']*\\b${cls}\\b[^"']*["'][^>]*>`, 'gi');
      let m;
      while ((m = clsRegex.exec(svgText)) !== null) {
        const tagStr = m[0];
        const hexMatches = tagStr.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g) || [];
        for (const h of hexMatches) {
          addHex(h, cls);
        }
      }
    }

    // 2. Scan all remaining hex colors in the SVG
    const allHexes = svgText.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g) || [];
    for (const h of allHexes) {
      if (found.length >= 6) break;
      addHex(h);
    }

    if (found.length === 0) {
      found.push({ hex: '#121331', label: 'primary' });
    }
    return found.slice(0, 6);
  }

  function getStrokeMultiplier(strokeMode = 'regular') {
    if (strokeMode === 'light') return 0.55;
    if (strokeMode === 'bold') return 1.45;
    return 1.0;
  }

  function applyCustomizationsToSvgXml(
    baseSvg = '',
    { colorMap = {}, strokeMode = 'regular', bgTransparent = true, bgColor = '#ffffff' } = {}
  ) {
    if (!baseSvg || !baseSvg.includes('<svg')) return baseSvg;
    let out = baseSvg;

    // 1. Replace mapped hex colors using temporary tokens so swaps don't collide
    const entries = Object.entries(colorMap).filter(
      ([orig, next]) => orig && next && orig.toLowerCase() !== next.toLowerCase()
    );
    if (entries.length > 0) {
      entries.forEach(([orig], idx) => {
        const normOrig = expandShortHex(orig);
        if (!normOrig) return;
        const shortOrig =
          normOrig[1] === normOrig[2] && normOrig[3] === normOrig[4] && normOrig[5] === normOrig[6]
            ? `#${normOrig[1]}${normOrig[3]}${normOrig[5]}`
            : null;
        const token = `__SVGCRAFT_CLR_${idx}__`;
        out = out.replace(new RegExp(`${normOrig}\\b`, 'gi'), token);
        if (shortOrig) {
          out = out.replace(new RegExp(`${shortOrig}\\b`, 'gi'), token);
        }
      });
      entries.forEach(([, next], idx) => {
        const token = `__SVGCRAFT_CLR_${idx}__`;
        out = out.replace(new RegExp(token, 'g'), next);
      });

      // Also support monochrome currentColor icons when 1st color well is changed
      if (!/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/.test(baseSvg) && entries[0]) {
        const firstColor = entries[0][1];
        out = out.replace(/\bcurrentColor\b/g, firstColor);
      }
    }

    // 2. Apply stroke-width multiplier (light: 0.55x, regular: 1.0x, bold: 1.45x)
    const mult = getStrokeMultiplier(strokeMode);
    if (Math.abs(mult - 1.0) > 0.01) {
      out = out.replace(/\bstroke-width=["']([\d.]+)(px)?["']/gi, (full, numStr, unit) => {
        const val = parseFloat(numStr);
        if (Number.isNaN(val) || val <= 0) return full;
        const scaled = Math.max(0.25, Number((val * mult).toFixed(2)));
        return `stroke-width="${scaled}${unit || ''}"`;
      });
      out = out.replace(/\bstroke-width:\s*([\d.]+)(px)?/gi, (full, numStr, unit) => {
        const val = parseFloat(numStr);
        if (Number.isNaN(val) || val <= 0) return full;
        const scaled = Math.max(0.25, Number((val * mult).toFixed(2)));
        return `stroke-width:${scaled}${unit || ''}`;
      });
    }

    // 3. Apply custom background rect if bgTransparent is false
    if (!bgTransparent && bgColor) {
      const vbMatch = out.match(/\bviewBox=["']([^"']+)["']/i);
      let vbX = 0;
      let vbY = 0;
      let vbW = 24;
      let vbH = 24;
      if (vbMatch) {
        const parts = vbMatch[1].trim().split(/[\s,]+/).map(Number);
        if (parts.length === 4 && !parts.some(Number.isNaN)) {
          [vbX, vbY, vbW, vbH] = parts;
        }
      } else {
        const wM = out.match(/\bwidth=["']([\d.]+)/i);
        const hM = out.match(/\bheight=["']([\d.]+)/i);
        if (wM) vbW = parseFloat(wM[1]) || 24;
        if (hM) vbH = parseFloat(hM[1]) || 24;
      }
      const bgRect = `<rect class="svgcraft-bg" x="${vbX}" y="${vbY}" width="${vbW}" height="${vbH}" fill="${bgColor}"/>`;
      out = out.replace(/<svg\b[^>]*>/i, (openTag) => `${openTag}${bgRect}`);
    }

    return out;
  }

  function hexToNormalizedRgbArray(hex) {
    const clean = expandShortHex(hex);
    if (!clean) return null;
    const r = parseInt(clean.slice(1, 3), 16) / 255;
    const g = parseInt(clean.slice(3, 5), 16) / 255;
    const b = parseInt(clean.slice(5, 7), 16) / 255;
    return [Number(r.toFixed(4)), Number(g.toFixed(4)), Number(b.toFixed(4))];
  }

  function rgbArrayToHex(arr) {
    if (!Array.isArray(arr) || arr.length < 3) return null;
    const r = Math.max(0, Math.min(255, Math.round(Number(arr[0]) * 255)));
    const g = Math.max(0, Math.min(255, Math.round(Number(arr[1]) * 255)));
    const b = Math.max(0, Math.min(255, Math.round(Number(arr[2]) * 255)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toLowerCase();
  }

  function applyCustomizationsToLottieJson(lottieData, { colorMap = {}, strokeMode = 'regular' } = {}) {
    const cloned = JSON.parse(JSON.stringify(lottieData));
    const normalizedMap = {};
    for (const [orig, next] of Object.entries(colorMap)) {
      const k = expandShortHex(orig);
      const v = hexToNormalizedRgbArray(next);
      if (k && v) normalizedMap[k] = v;
    }
    const mult = getStrokeMultiplier(strokeMode);

    function walk(node) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }

      // Check Lottie fill ('fl') or stroke ('st') color property node.c.k
      if ((node.ty === 'fl' || node.ty === 'st') && node.c && node.c.k) {
        const ck = node.c.k;
        if (Array.isArray(ck) && typeof ck[0] === 'number') {
          const curHex = rgbArrayToHex(ck);
          if (curHex && normalizedMap[curHex]) {
            const [r, g, b] = normalizedMap[curHex];
            ck[0] = r;
            ck[1] = g;
            ck[2] = b;
          }
        } else if (Array.isArray(ck)) {
          ck.forEach((kf) => {
            if (kf && Array.isArray(kf.s)) {
              const curHex = rgbArrayToHex(kf.s);
              if (curHex && normalizedMap[curHex]) {
                const [r, g, b] = normalizedMap[curHex];
                kf.s[0] = r;
                kf.s[1] = g;
                kf.s[2] = b;
              }
            }
            if (kf && Array.isArray(kf.e)) {
              const curHex = rgbArrayToHex(kf.e);
              if (curHex && normalizedMap[curHex]) {
                const [r, g, b] = normalizedMap[curHex];
                kf.e[0] = r;
                kf.e[1] = g;
                kf.e[2] = b;
              }
            }
          });
        }
      }

      // Scale stroke width in Lottie stroke ('st') items
      if (node.ty === 'st' && node.w && Math.abs(mult - 1.0) > 0.01) {
        if (typeof node.w.k === 'number') {
          node.w.k = Number((node.w.k * mult).toFixed(2));
        } else if (Array.isArray(node.w.k)) {
          node.w.k.forEach((kf) => {
            if (kf && Array.isArray(kf.s) && typeof kf.s[0] === 'number') {
              kf.s[0] = Number((kf.s[0] * mult).toFixed(2));
            }
            if (kf && Array.isArray(kf.e) && typeof kf.e[0] === 'number') {
              kf.e[0] = Number((kf.e[0] * mult).toFixed(2));
            }
          });
        }
      }

      for (const val of Object.values(node)) {
        if (val && typeof val === 'object') walk(val);
      }
    }

    walk(cloned);
    return cloned;
  }

  /**
   * Compile a Lordicon Lottie animation + selected Motion State + Custom Colors/Stroke/Background
   * into a single standalone animated `.svg` file (either `hover` or `loop` trigger).
   * Optimized to strip unused `<defs>`, hidden precomps, round float precision, and merge identical frames
   * so only the exact data needed for the selected single animation is embedded.
   */
  async function compileStandaloneAnimatedSvg(
    lottieData,
    stateObj,
    {
      exportMode = 'loop', // 'loop' | 'hover'
      colorMap = {},
      strokeMode = 'regular',
      bgTransparent = true,
      bgColor = '#ffffff',
      frameSamples = 14,
    } = {}
  ) {
    const lottie = await ensureLottieWebLoaded();
    const customizedLottie = applyCustomizationsToLottieJson(lottieData, { colorMap, strokeMode });

    const w = Number(customizedLottie.w) || 430;
    const h = Number(customizedLottie.h) || 430;
    const fps = Number(customizedLottie.fr) || 60;
    const startF = stateObj ? stateObj.startFrame : Number(customizedLottie.ip) || 0;
    const endF = stateObj ? stateObj.endFrame : Number(customizedLottie.op) || 60;
    const totalSpan = Math.max(1, endF - startF);
    const durationSec = Math.max(0.45, Number((totalSpan / fps).toFixed(2)));
    const count = Math.max(8, Math.min(20, frameSamples));

    const offscreen = document.createElement('div');
    offscreen.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${w}px;height:${h}px;visibility:hidden;pointer-events:none;`;
    document.body.appendChild(offscreen);

    try {
      const anim = lottie.loadAnimation({
        container: offscreen,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: customizedLottie,
      });

      const rawFrames = [];
      for (let k = 0; k < count; k++) {
        const frameNum = Math.round(startF + (k / (count - 1)) * totalSpan);
        anim.goToAndStop(frameNum, true);
        const svgEl = offscreen.querySelector('svg');
        if (!svgEl) continue;

        const cloneSvg = svgEl.cloneNode(true);
        // 1. Strip hidden layers (`display: none`) and zero-opacity groups belonging to other animations
        cloneSvg
          .querySelectorAll('[style*="display: none"], [style*="display:none"], [opacity="0"]')
          .forEach((el) => {
            if (!el.closest('defs')) el.remove();
          });

        // 2. Prune unreferenced <defs> children so we only keep clipPaths/masks/gradients used in THIS frame
        const defsEl = cloneSvg.querySelector('defs');
        if (defsEl) {
          const bodyHtmlWithoutDefs = Array.from(cloneSvg.children)
            .filter((ch) => ch.tagName.toLowerCase() !== 'defs')
            .map((ch) => ch.outerHTML)
            .join('');
          const usedIds = new Set();
          const collectRefs = (str) => {
            let m;
            const re = /url\(#([^)]+)\)|(?:xlink:href|href)=["']#([^"']+)["']/g;
            while ((m = re.exec(str)) !== null) {
              usedIds.add(m[1] || m[2]);
            }
          };
          collectRefs(bodyHtmlWithoutDefs);
          // Transitively keep defs referenced by other kept defs
          let added = true;
          while (added) {
            added = false;
            Array.from(defsEl.children).forEach((defChild) => {
              const id = defChild.getAttribute('id');
              if (id && usedIds.has(id)) {
                const beforeSize = usedIds.size;
                collectRefs(defChild.outerHTML);
                if (usedIds.size > beforeSize) added = true;
              }
            });
          }
          Array.from(defsEl.children).forEach((defChild) => {
            const id = defChild.getAttribute('id');
            if (!id || !usedIds.has(id)) {
              defChild.remove();
            }
          });
          if (defsEl.children.length === 0) {
            defsEl.remove();
          }
        }

        // 3. Remove empty <g> containers left behind after pruning
        let removedEmpty = true;
        while (removedEmpty) {
          removedEmpty = false;
          cloneSvg.querySelectorAll('g').forEach((g) => {
            if (!g.closest('defs') && g.children.length === 0 && !g.textContent.trim()) {
              g.remove();
              removedEmpty = true;
            }
          });
        }

        // 4. Compact coordinates & strip redundant default attributes
        let rawInner = cloneSvg.innerHTML
          .replace(/\sstyle=["']display:\s*block;?["']/gi, '')
          .replace(/\stransform=["']matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)["']/gi, '')
          .replace(/\s(?:opacity|fill-opacity|stroke-opacity)=["']1["']/gi, '')
          .replace(/(\d+\.\d{2,})/g, (numStr) => String(Number(parseFloat(numStr).toFixed(1))));

        rawInner = applyCustomizationsToSvgXml(`<svg viewBox="0 0 ${w} ${h}">${rawInner}</svg>`, {
          colorMap,
          strokeMode,
          bgTransparent: true,
        })
          .replace(/^<svg[^>]*>/i, '')
          .replace(/<\/svg>$/i, '');

        // Normalize signature (ignoring defs IDs) to deduplicate consecutive identical frames
        const signature = rawInner.replace(/\bid=["'][^"']+["']/g, '').replace(/url\(#[^)]+\)/g, '');
        if (rawFrames.length > 0 && rawFrames[rawFrames.length - 1].signature === signature) {
          rawFrames[rawFrames.length - 1].spanCount += 1;
        } else {
          rawFrames.push({
            rawInner,
            signature,
            spanCount: 1,
          });
        }
      }

      anim.destroy();

      const totalSampleSlots = rawFrames.reduce((acc, f) => acc + f.spanCount, 0) || 1;
      let cursorSlot = 0;
      const frameGroups = [];
      const keyframesCss = [];

      rawFrames.forEach((f, idx) => {
        const prefix = `f${idx}_`;
        const scopedInner = f.rawInner
          .replace(/\bid=["']([^"']+)["']/g, `id="${prefix}$1"`)
          .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
          .replace(/\b(xlink:href|href)=["']#([^"']+)["']/g, `$1="#${prefix}$2"`);

        frameGroups.push(`<g class="li-f li-f-${idx}">${scopedInner}</g>`);

        const startPct = Number(((cursorSlot / totalSampleSlots) * 100).toFixed(2));
        cursorSlot += f.spanCount;
        const endPct = Number(((cursorSlot / totalSampleSlots) * 100).toFixed(2));
        const endHoldPct = Math.max(startPct, Number((endPct - 0.01).toFixed(2)));

        let kfRule = '';
        if (startPct === 0 && endPct >= 100) {
          kfRule = `@keyframes li-k-${idx}{0%,100%{opacity:1}}`;
        } else if (startPct === 0) {
          kfRule = `@keyframes li-k-${idx}{0%,${endHoldPct}%{opacity:1}${endPct}%,100%{opacity:0}}`;
        } else if (endPct >= 100) {
          const prePct = Math.max(0, Number((startPct - 0.01).toFixed(2)));
          kfRule = `@keyframes li-k-${idx}{0%,${prePct}%{opacity:0}${startPct}%,100%{opacity:1}}`;
        } else {
          const prePct = Math.max(0, Number((startPct - 0.01).toFixed(2)));
          kfRule = `@keyframes li-k-${idx}{0%,${prePct}%{opacity:0}${startPct}%,${endHoldPct}%{opacity:1}${endPct}%,100%{opacity:0}}`;
        }

        const triggerRule =
          exportMode === 'hover'
            ? `svg:hover .li-f-${idx}{opacity:0;animation:li-k-${idx} ${durationSec}s steps(1,end) infinite}`
            : `.li-f-${idx}{animation:li-k-${idx} ${durationSec}s steps(1,end) infinite}`;

        keyframesCss.push(`${kfRule}${triggerRule}`);
      });

      const baseRule =
        exportMode === 'hover'
          ? `.li-f{opacity:0}.li-f-0{opacity:1}`
          : `.li-f{opacity:0}`;

      const styleBlock = `<style>${baseRule}${keyframesCss.join('')}</style>`;
      const bgRect =
        !bgTransparent && bgColor
          ? `<rect class="svgcraft-bg" x="0" y="0" width="${w}" height="${h}" fill="${bgColor}"/>`
          : '';

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${styleBlock}${bgRect}${frameGroups.join('')}</svg>`;
    } finally {
      offscreen.remove();
    }
  }

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
            previewArea.__lottieAnim.goToAndStop(0, true);
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
          previewArea.__lottieAnim.play();
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
  async function openCollectionPage(site, collectionSlug, pushHistory = true, initialParams = {}) {
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
  function updateBrandGlow(hexColor) {
    const color = hexColor && /^#[0-9a-fA-F]{3,8}$/.test(hexColor) ? hexColor : '#f97316';
    brandGlowOrb.style.background = `radial-gradient(ellipse 62% 95% at 55% 0%, ${color}40, transparent 72%)`;
    brandGlowBackdrop.classList.toggle('active', activeDetailIconKey !== null);
  }

  let activeStageLottieAnim = null;
  function destroyActiveStageLottie() {
    if (activeStageLottieAnim) {
      try {
        activeStageLottieAnim.destroy();
      } catch {
        // Ignore
      }
      activeStageLottieAnim = null;
    }
  }

  async function openDetailPage(site, collectionSlug, idOrSlug, pushHistory = true) {
    destroyActiveStageLottie();
    let data;
    try {
      data = await apiFetchJson(
        `/api/catalog/icon/any/${encodeURIComponent(collectionSlug)}/${encodeURIComponent(idOrSlug)}`
      );
    } catch {
      showToast(t('toastIconNotFound'));
      return;
    }

    const {
      icon,
      svgVariantsContent = {},
      variantAssetUrls = {},
      lordiconStyles = null,
      recommendations = {},
    } = data;
    const isLordicon =
      icon.site === 'lordicon' ||
      (icon.collectionSlug && icon.collectionSlug.startsWith('lordicon-')) ||
      Array.isArray(lordiconStyles);

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

    // Advanced Studio Customizer State (Multi-Color Map, Background, Stroke Mode, Motion & Export Mode)
    let baseRawSvgForCurrentStyle = svgVariantsContent[activeVariant] || data.rawSvg || '';
    let editableColorSlots = extractEditableColorsFromSvg(baseRawSvgForCurrentStyle);
    let colorMap = {};
    editableColorSlots.forEach((slot) => {
      colorMap[slot.hex] = slot.hex;
    });
    let bgTransparent = true;
    let bgColor = '#ffffff';
    let strokeMode = 'regular'; // 'light' | 'regular' | 'bold'

    // Lordicon State
    let activeLordiconFamily = icon.family || (icon.collectionSlug.startsWith('lordicon-') ? icon.collectionSlug.split('-')[1] : 'system');
    let activeLordiconStyle = icon.lordiconStyle || (icon.collectionSlug.startsWith('lordicon-') ? icon.collectionSlug.split('-').slice(2).join('-') : 'outline');
    let lordiconLottieData = null;
    let lordiconMotionStates = [];
    let activeMotionStateId = '';
    let isStageLiveLooping = true;
    let svgExportMode = isLordicon ? 'loop' : 'static'; // 'static' | 'hover' | 'loop'
    let compiledAnimatedSvgCache = null;

    const primaryHex = editableColorSlots[0]?.hex || (icon.colorPalette && icon.colorPalette[0]) || '#f97316';
    updateBrandGlow(primaryHex);

    // Find prev/next icon in currentItems for quick keyboard/button navigation
    const currentIdx = currentItems.findIndex(
      (it) => `${it.collectionSlug}:${it.id || it.slug}` === favKey
    );
    const prevItem = currentIdx > 0 ? currentItems[currentIdx - 1] : null;
    const nextItem = currentIdx >= 0 && currentIdx < currentItems.length - 1 ? currentItems[currentIdx + 1] : null;

    const catObj = (catalogSummary?.categories || []).find((c) => c.id === icon.category);
    const catLabel = getCatLabel(icon.category, catObj?.label);

    function getCustomizedStaticSvg() {
      const raw = baseRawSvgForCurrentStyle || svgVariantsContent[activeVariant] || data.rawSvg || '';
      return applyCustomizationsToSvgXml(raw, {
        colorMap,
        strokeMode,
        bgTransparent,
        bgColor,
      });
    }

    function getActiveRawSvg() {
      if (isLordicon && (svgExportMode === 'hover' || svgExportMode === 'loop') && compiledAnimatedSvgCache) {
        return compiledAnimatedSvgCache;
      }
      return getCustomizedStaticSvg();
    }

    async function getOrCompileExportSvg(silent = false) {
      if (isLordicon && (svgExportMode === 'hover' || svgExportMode === 'loop') && lordiconLottieData) {
        if (compiledAnimatedSvgCache) return compiledAnimatedSvgCache;
        if (!silent) showToast(t('toastCompilingAnimSvg'));
        const stObj =
          lordiconMotionStates.find((s) => s.id === activeMotionStateId) || lordiconMotionStates[0];
        compiledAnimatedSvgCache = await compileStandaloneAnimatedSvg(lordiconLottieData, stObj, {
          exportMode: svgExportMode,
          colorMap,
          strokeMode,
          bgTransparent,
          bgColor,
        });
        return compiledAnimatedSvgCache;
      }
      return getCustomizedStaticSvg();
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
        return `<div style="color:var(--text-dim);font-size:0.82rem;padding:12px 0">${escapeHtml(t('recEmpty'))}</div>`;
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

    function buildColorWellsHtml() {
      return editableColorSlots
        .map((slot, idx) => {
          const curVal = colorMap[slot.hex] || slot.hex;
          return `
            <label class="color-well-item" style="background:${escapeHtml(curVal)}" title="${escapeHtml(slot.label)}: ${escapeHtml(curVal.toUpperCase())}">
              <input type="color" data-color-slot="${escapeHtml(slot.hex)}" data-color-idx="${idx}" value="${escapeHtml(curVal)}" />
              <span class="color-well-tag">${escapeHtml(curVal)}</span>
            </label>
          `;
        })
        .join('');
    }

    const isFav = favorites.has(favKey) || favorites.has(legacyFavKey);
    const paletteColors = icon.colorPalette && icon.colorPalette.length ? icon.colorPalette : [];

    detailView.innerHTML = `
      <!-- Top Breadcrumb & Navigation Bar -->
      <div class="detail-topbar">
        <div class="detail-breadcrumbs">
          <button type="button" class="btn-back-catalog" id="btnBackToCatalog">
            ${ICONS.arrowLeft}
            <span>${escapeHtml(t('detailBack'))}</span>
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
          <button type="button" class="icon-btn-square" id="btnDetailPrev" ${prevItem ? '' : 'disabled'} title="${escapeHtml(t('detailPrevTitle'))}">
            ${ICONS.chevronLeft}
          </button>
          <button type="button" class="icon-btn-square" id="btnDetailNext" ${nextItem ? '' : 'disabled'} title="${escapeHtml(t('detailNextTitle'))}">
            ${ICONS.chevronRight}
          </button>
          <button type="button" class="icon-btn-square ${isFav ? 'active-fav' : ''}" id="btnDetailFav" title="${escapeHtml(t('detailFavTitle'))}">
            ${isFav ? ICONS.heartFilled : ICONS.heart}
          </button>
          <button type="button" class="icon-btn-square" id="btnDetailShare" title="${escapeHtml(t('detailShareTitle'))}">
            ${ICONS.share}
          </button>
        </div>
      </div>

      <!-- Main Hero Grid (thesvg.org 2-Column Layout) -->
      <div class="detail-hero-grid">
        <!-- Left Column: Interactive Vector Stage, Customizer (Colors/Bg/Stroke), Variants & Palette -->
        <div class="detail-stage-col">
          <div class="stage-card">
            <div class="stage-toolbar-top">
              <!-- Background Switcher -->
              <div class="stage-control-group" role="group" aria-label="Canvas background">
                <button type="button" class="stage-ctrl-btn ${stageTone === 'checker' ? 'active' : ''}" data-stage-tone="checker" title="${escapeHtml(t('stageToneChecker'))}">
                  ${ICONS.checkerboard}
                </button>
                <button type="button" class="stage-ctrl-btn ${stageTone === 'dark' ? 'active' : ''}" data-stage-tone="dark" title="${escapeHtml(t('stageToneDark'))}">
                  ${ICONS.moon}
                </button>
                <button type="button" class="stage-ctrl-btn ${stageTone === 'light' ? 'active' : ''}" data-stage-tone="light" title="${escapeHtml(t('stageToneLight'))}">
                  ${ICONS.sun}
                </button>
                <button type="button" class="stage-ctrl-btn ${stageTone === 'auto' ? 'active' : ''}" data-stage-tone="auto" title="${escapeHtml(t('stageToneAuto'))}">
                  <span>Auto</span>
                </button>
              </div>

              <!-- Keyline Grid & Zoom Inspector -->
              <div style="display:flex;align-items:center;gap:6px">
                <button type="button" class="stage-ctrl-btn" id="btnToggleKeyline" style="border:1px solid var(--border-subtle);background:var(--bg-page);height:30px" title="${escapeHtml(t('stageKeylineTitle'))}">
                  ${ICONS.grid}
                  <span>Grid</span>
                </button>
                <div class="stage-control-group">
                  <button type="button" class="stage-ctrl-btn" id="btnZoomOut" title="${escapeHtml(t('stageZoomOutTitle'))}">${ICONS.zoomOut}</button>
                  <button type="button" class="stage-ctrl-btn stage-zoom-readout" id="stageZoomReadout" title="${escapeHtml(t('stageZoomResetTitle'))}">${BASE_STAGE_SIZE}px</button>
                  <button type="button" class="stage-ctrl-btn" id="btnZoomIn" title="${escapeHtml(t('stageZoomInTitle'))}">${ICONS.zoomIn}</button>
                </div>
              </div>
            </div>

            <div class="stage-canvas" id="stageCanvas" data-tone="${stageTone}" title="${escapeHtml(t('stageCanvasTitle'))}">
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
                <span>viewBox: <strong id="stageViewBoxLabel">${escapeHtml(icon.viewBox || '0 0 24 24')}</strong></span>
                <span> · </span>
                <span id="stageBytesLabel">${formatBytes(icon.fileSizeBytes)}</span>
              </div>
            </div>
          </div>

          <!-- Vector Customizer Box: Multi-Colors, Background (Transparent + Picker), Stroke (light | regular | bold) -->
          <div class="studio-customizer-box">
            <div class="panel-box-label" style="margin-bottom:2px">
              <span>${escapeHtml(t('customizerTitle'))}</span>
              <button type="button" class="stage-ctrl-btn" id="btnResetAllCustomizations" title="${escapeHtml(t('stageResetColorTitle'))}">
                ${ICONS.rotateCcw}
              </button>
            </div>

            <!-- Row 1: Multi-Color Wells -->
            <div class="studio-ctrl-row">
              <span class="studio-ctrl-label">${escapeHtml(t('ctrlColors'))}</span>
              <div class="color-wells-list" id="studioColorWellsList">
                ${buildColorWellsHtml()}
              </div>
            </div>

            <!-- Row 2: Background (Transparent Checkbox + Color Well) -->
            <div class="studio-ctrl-row">
              <span class="studio-ctrl-label">${escapeHtml(t('ctrlBackground'))}</span>
              <div class="studio-ctrl-right">
                <label class="bg-transparent-toggle">
                  <input type="checkbox" id="chkBgTransparent" checked />
                  <span>${escapeHtml(t('ctrlTransparent'))}</span>
                </label>
                <label class="color-well-item" id="bgColorWellWrap" style="max-width:72px;background:${escapeHtml(bgColor)};opacity:0.45" title="Background HEX">
                  <input type="color" id="inputBgColorPicker" value="${escapeHtml(bgColor)}" />
                  <span class="color-well-tag" id="bgColorWellTag">${escapeHtml(bgColor)}</span>
                </label>
              </div>
            </div>

            <!-- Row 3: Stroke Width (light | regular | bold) -->
            <div class="studio-ctrl-row">
              <span class="studio-ctrl-label">${escapeHtml(t('ctrlStroke'))}</span>
              <div class="stroke-segmented-group" id="strokeSegmentedGroup" role="group" aria-label="Stroke width">
                <button type="button" class="stroke-seg-btn" data-stroke-mode="light">${escapeHtml(t('strokeLight'))}</button>
                <button type="button" class="stroke-seg-btn active" data-stroke-mode="regular">${escapeHtml(t('strokeRegular'))}</button>
                <button type="button" class="stroke-seg-btn" data-stroke-mode="bold">${escapeHtml(t('strokeBold'))}</button>
              </div>
            </div>
          </div>

          ${
            isLordicon
              ? `
            <!-- Lordicon Motion States Box -->
            <div class="detail-panel-box" id="lordiconMotionBox">
              <div class="panel-box-label">
                <span>${escapeHtml(t('motionPanelTitle'))}</span>
                <span id="activeMotionStateLabel" style="text-transform:none;font-weight:600;color:var(--brand-orange)">Loading...</span>
              </div>
              <div class="motion-states-wrap" id="lordiconMotionStatesWrap">
                <span style="font-size:0.75rem;color:var(--text-dim)">Loading Lottie motion states...</span>
              </div>
            </div>
          `
              : ''
          }

          <!-- Variant Selector Box (Supports both standard variants & all 10 Lordicon Cross-Style Variants) -->
          <div class="detail-panel-box">
            <div class="panel-box-label">
              <span>${escapeHtml(
                t('detailVariantsTitle', {
                  count: Array.isArray(lordiconStyles) && lordiconStyles.length
                    ? lordiconStyles.length
                    : variantKeys.length,
                })
              )}</span>
              <span style="text-transform:none;font-weight:500" id="activeVariantLabel">${escapeHtml(
                Array.isArray(lordiconStyles) && lordiconStyles.length
                  ? `${activeLordiconFamily}/${activeLordiconStyle}`
                  : activeVariant
              )}</span>
            </div>
            <div class="variants-strip-grid" id="detailVariantStrip">
              ${
                Array.isArray(lordiconStyles) && lordiconStyles.length
                  ? lordiconStyles
                      .map((stItem) => {
                        const isCurrent =
                          stItem.family === activeLordiconFamily && stItem.style === activeLordiconStyle;
                        const colSlugVal =
                          stItem.collectionSlug || stItem.colSlug || `lordicon-${stItem.family}-${stItem.style}`;
                        const isLocalVal = stItem.isLocal || stItem.isCrawled ? '1' : '0';
                        const targetIconId = stItem.iconId || stItem.iconSlug || icon.id || icon.slug;
                        const thumbUrl =
                          stItem.assetUrl || stItem.localAssetUrl || stItem.svgUrl || stItem.cdnSvgUrl || '';
                        return `
                          <button type="button" class="variant-mini-btn ${isCurrent ? 'active' : ''}" data-lordicon-var="${escapeHtml(stItem.family)}:${escapeHtml(stItem.style)}:${escapeHtml(colSlugVal)}:${isLocalVal}:${escapeHtml(targetIconId)}">
                            <span class="variant-mini-thumb">
                              <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(stItem.label)}" loading="lazy" />
                            </span>
                            <span class="variant-mini-name" title="${escapeHtml(stItem.label)}">${escapeHtml(stItem.label)}</span>
                          </button>
                        `;
                      })
                      .join('')
                  : variantKeys
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
                      .join('')
              }
            </div>
          </div>

          <!-- Color Palette Box -->
          ${
            paletteColors.length > 0
              ? `
            <div class="detail-panel-box">
              <div class="panel-box-label">
                <span>${escapeHtml(t('detailPaletteTitle'))}</span>
              </div>
              <div class="palette-swatches">
                ${paletteColors
                  .map(
                    (hex) => `
                    <button type="button" class="swatch-pill" data-copy-hex="${escapeHtml(hex)}" title="${escapeHtml(hex)}">
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

        <!-- Right Column: Icon Metadata, Export Mode Selector, Quick Copy/Download, PNG Export & Code Studio -->
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
                <span>${escapeHtml(t('detailStylePrefix'))} ${escapeHtml(icon.styleType)}</span>
              </button>
              <button type="button" class="pill-btn" data-jump-type="${escapeHtml(icon.iconType)}">
                ${getIconTypeSvg(icon.iconType)}
                <span>${escapeHtml(icon.iconType)}</span>
              </button>
            </div>
          </div>

          ${
            isLordicon
              ? `
            <!-- Option A1 On-Demand Animated SVG Export Mode Selector -->
            <div class="export-mode-bar" id="lordiconExportModeBar">
              <div class="export-mode-header">
                <span>⚡ ${escapeHtml(t('exportModeTitle'))}</span>
              </div>
              <div class="export-mode-pills">
                <button type="button" class="export-mode-btn ${svgExportMode === 'static' ? 'active' : ''}" data-svg-export-mode="static">
                  <span class="export-mode-btn-title">${escapeHtml(t('exportModeStatic'))}</span>
                  <span class="export-mode-btn-sub">${escapeHtml(t('exportModeStaticSub'))}</span>
                </button>
                <button type="button" class="export-mode-btn ${svgExportMode === 'hover' ? 'active' : ''}" data-svg-export-mode="hover">
                  <span class="export-mode-btn-title">${escapeHtml(t('exportModeHover'))}</span>
                  <span class="export-mode-btn-sub">${escapeHtml(t('exportModeHoverSub'))}</span>
                </button>
                <button type="button" class="export-mode-btn ${svgExportMode === 'loop' ? 'active' : ''}" data-svg-export-mode="loop">
                  <span class="export-mode-btn-title">${escapeHtml(t('exportModeLoop'))}</span>
                  <span class="export-mode-btn-sub">${escapeHtml(t('exportModeLoopSub'))}</span>
                </button>
              </div>
            </div>
          `
              : ''
          }

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
              <span>${escapeHtml(t('detailDownloadSvgBtn'))}</span>
            </button>
          </div>

          <!-- Export PNG Bar (32px - 512px like thesvg.org) -->
          <div class="png-export-bar">
            <div class="png-export-title">
              ${ICONS.image}
              <span>${escapeHtml(t('detailPngExportTitle'))}</span>
            </div>
            <div class="png-size-buttons">
              ${[32, 64, 128, 256, 512]
                .map(
                  (sz) => `
                  <button type="button" class="btn-png-size" data-export-png="${sz}" title="${escapeHtml(t('detailPngBtnTitle', { size: sz }))}">
                    ${ICONS.download}
                    <span>${sz}px</span>
                  </button>
                `
                )
                .join('')}
              <button type="button" class="btn-png-size" data-copy-png="256" title="${escapeHtml(t('detailCopyPngTitle'))}">
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
                  <span>${escapeHtml(t('detailCopyCodeBtn'))}</span>
                </button>
              </div>
            </div>
            <pre class="code-studio-pre scroller" id="codeStudioPre"><code>${renderHighlightedCodeBlock(getFormattedCodeForTab('svg'), 'svg')}</code></pre>
          </div>

          <!-- Metadata Cards Grid -->
          <div class="detail-meta-grid">
            <div class="meta-stat-card">
              <span class="meta-stat-label">${escapeHtml(t('metaCollection'))}</span>
              <button type="button" class="meta-stat-link" data-open-col="${escapeHtml(icon.collectionSlug)}">
                ${ICONS.folder}
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(icon.collectionName)}</span>
              </button>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">${escapeHtml(t('metaGridSize'))}</span>
              <span class="meta-stat-val">${escapeHtml(icon.gridSize || '24x24')}</span>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">${escapeHtml(t('metaFileSize'))}</span>
              <span class="meta-stat-val" id="metaFileSizeVal">${formatBytes(icon.fileSizeBytes)}</span>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">${escapeHtml(t('metaLicense'))}</span>
              <span class="meta-stat-val">${escapeHtml(icon.license || 'MIT / CC0')}</span>
            </div>
            <div class="meta-stat-card">
              <span class="meta-stat-label">${escapeHtml(t('metaAuthor'))}</span>
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
              <span>${escapeHtml(t('detailTagsLabel'))}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${(icon.tags || [])
                .map(
                  (tag) =>
                    `<button type="button" class="pill-btn" data-jump-tag="${escapeHtml(tag)}" style="font-size:0.75rem;padding:4px 10px">#${escapeHtml(tag)}</button>`
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
            <span>${escapeHtml(t('recSimilarTitle'))}</span>
          </h2>
        </div>
        ${renderMiniCardsSection(recommendations?.similar)}
      </div>

      <!-- Bottom Section 2: Same Style & Category -->
      <div class="detail-section">
        <div class="detail-section-header">
          <h2 class="detail-section-title">
            <span class="nav-icon" style="color:var(--brand-orange)">${getStyleIconSvg(icon.styleType)}</span>
            <span>${escapeHtml(t('recSameStyleTitle', { style: icon.styleType, category: catLabel }))}</span>
          </h2>
        </div>
        ${renderMiniCardsSection(recommendations?.sameStyle)}
      </div>

      <!-- Bottom Section 3: Same Collection -->
      <div class="detail-section">
        <div class="detail-section-header">
          <h2 class="detail-section-title">
            <span class="nav-icon" style="color:var(--brand-orange)">${ICONS.folder}</span>
            <span>${escapeHtml(t('recSameColTitle', { collection: icon.collectionName }))}</span>
          </h2>
          <button type="button" class="pill-btn" data-open-col="${escapeHtml(icon.collectionSlug)}">
            <span>${escapeHtml(t('recViewAllCol'))}</span>
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
    const stageBytesLabel = document.getElementById('stageBytesLabel');
    const metaFileSizeVal = document.getElementById('metaFileSizeVal');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnToggleKeyline = document.getElementById('btnToggleKeyline');
    const activeVariantLabel = document.getElementById('activeVariantLabel');
    const codeStudioPre = document.getElementById('codeStudioPre');
    const codeLangBadge = document.getElementById('codeLangBadge');
    const studioColorWellsList = document.getElementById('studioColorWellsList');
    const chkBgTransparent = document.getElementById('chkBgTransparent');
    const inputBgColorPicker = document.getElementById('inputBgColorPicker');
    const bgColorWellWrap = document.getElementById('bgColorWellWrap');
    const bgColorWellTag = document.getElementById('bgColorWellTag');
    const strokeSegmentedGroup = document.getElementById('strokeSegmentedGroup');
    const btnResetAllCustomizations = document.getElementById('btnResetAllCustomizations');

    function syncExportModeButtonsUI() {
      detailView.querySelectorAll('[data-svg-export-mode]').forEach((b) => {
        b.classList.toggle('active', b.dataset.svgExportMode === svgExportMode);
      });
    }

    function mountStageVisual(playOnceInHoverMode = false) {
      if (!bgTransparent && bgColor) {
        stageCanvas.style.background = bgColor;
      } else {
        stageCanvas.style.background = '';
      }

      if (
        isLordicon &&
        lordiconLottieData &&
        (svgExportMode === 'hover' || svgExportMode === 'loop') &&
        window.lottie
      ) {
        destroyActiveStageLottie();
        stageSvgMount.innerHTML = '';
        const customizedLottie = applyCustomizationsToLottieJson(lordiconLottieData, {
          colorMap,
          strokeMode,
        });
        const stObj =
          lordiconMotionStates.find((s) => s.id === activeMotionStateId) || lordiconMotionStates[0];
        activeStageLottieAnim = window.lottie.loadAnimation({
          container: stageSvgMount,
          renderer: 'svg',
          loop: svgExportMode === 'loop' || !playOnceInHoverMode,
          autoplay: false,
          animationData: customizedLottie,
        });
        if (svgExportMode === 'loop') {
          if (stObj) {
            activeStageLottieAnim.playSegments([stObj.startFrame, stObj.endFrame], true);
          } else {
            activeStageLottieAnim.play();
          }
        } else {
          // 'hover' mode: stand still at startFrame unless hovering or previewing a newly clicked state
          if (playOnceInHoverMode && stObj) {
            activeStageLottieAnim.loop = false;
            activeStageLottieAnim.playSegments([stObj.startFrame, stObj.endFrame], true);
          } else {
            activeStageLottieAnim.goToAndStop(stObj ? stObj.startFrame : 0, true);
          }
        }
        return;
      }

      // 'static' mode: stand completely still with the lightweight static SVG
      destroyActiveStageLottie();
      stageSvgMount.innerHTML = getCustomizedStaticSvg();
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

    // Stage hover listener for 'hover' mode
    if (isLordicon && stageCanvas) {
      stageCanvas.addEventListener('pointerenter', () => {
        if (svgExportMode !== 'hover' || !activeStageLottieAnim) return;
        const stObj =
          lordiconMotionStates.find((s) => s.id === activeMotionStateId) || lordiconMotionStates[0];
        activeStageLottieAnim.loop = true;
        if (stObj) {
          activeStageLottieAnim.playSegments([stObj.startFrame, stObj.endFrame], true);
        } else {
          activeStageLottieAnim.play();
        }
      });

      stageCanvas.addEventListener('pointerleave', () => {
        if (svgExportMode !== 'hover' || !activeStageLottieAnim) return;
        const stObj =
          lordiconMotionStates.find((s) => s.id === activeMotionStateId) || lordiconMotionStates[0];
        activeStageLottieAnim.goToAndStop(stObj ? stObj.startFrame : 0, true);
      });
    }

    async function refreshStageAndCode(recompileIfAnimated = false, playOnceInHoverMode = false) {
      compiledAnimatedSvgCache = null;
      mountStageVisual(playOnceInHoverMode);
      if (recompileIfAnimated && isLordicon && (svgExportMode === 'hover' || svgExportMode === 'loop')) {
        await getOrCompileExportSvg(true);
      }
      const currentCodeSvg = getActiveRawSvg();
      const byteLen = new Blob([currentCodeSvg]).size;
      if (stageBytesLabel) stageBytesLabel.textContent = formatBytes(byteLen);
      if (metaFileSizeVal) metaFileSizeVal.textContent = formatBytes(byteLen);

      codeStudioPre.innerHTML = `<code>${renderHighlightedCodeBlock(getFormattedCodeForTab(activeCodeTab), activeCodeTab)}</code>`;
      if (codeLangBadge) codeLangBadge.textContent = getLangBadgeForTab(activeCodeTab);
      if (activeVariantLabel) {
        activeVariantLabel.textContent =
          Array.isArray(lordiconStyles) && lordiconStyles.length
            ? `${activeLordiconFamily}/${activeLordiconStyle}`
            : activeVariant;
      }
    }

    function bindColorWellsInputs() {
      if (!studioColorWellsList) return;
      studioColorWellsList.querySelectorAll('input[data-color-slot]').forEach((inp) => {
        inp.addEventListener('input', (e) => {
          const origHex = inp.dataset.colorSlot;
          const nextHex = e.target.value.toLowerCase();
          colorMap[origHex] = nextHex;
          const well = inp.closest('.color-well-item');
          if (well) {
            well.style.background = nextHex;
            const tag = well.querySelector('.color-well-tag');
            if (tag) tag.textContent = nextHex;
          }
          if (inp.dataset.colorIdx === '0') {
            updateBrandGlow(nextHex);
          }
          refreshStageAndCode(false);
        });
      });
    }

    bindColorWellsInputs();
    mountStageVisual();

    // Background Transparent & Picker Events
    if (chkBgTransparent && inputBgColorPicker) {
      chkBgTransparent.addEventListener('change', () => {
        bgTransparent = chkBgTransparent.checked;
        if (bgColorWellWrap) bgColorWellWrap.style.opacity = bgTransparent ? '0.45' : '1';
        refreshStageAndCode(false);
      });
      inputBgColorPicker.addEventListener('input', (e) => {
        bgColor = e.target.value.toLowerCase();
        bgTransparent = false;
        chkBgTransparent.checked = false;
        if (bgColorWellWrap) {
          bgColorWellWrap.style.opacity = '1';
          bgColorWellWrap.style.background = bgColor;
        }
        if (bgColorWellTag) bgColorWellTag.textContent = bgColor;
        refreshStageAndCode(false);
      });
    }

    // Stroke Width Segmented Buttons (light | regular | bold)
    if (strokeSegmentedGroup) {
      strokeSegmentedGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-stroke-mode]');
        if (!btn) return;
        strokeMode = btn.dataset.strokeMode;
        strokeSegmentedGroup.querySelectorAll('[data-stroke-mode]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        refreshStageAndCode(false);
      });
    }

    // Reset All Customizations
    if (btnResetAllCustomizations) {
      btnResetAllCustomizations.addEventListener('click', () => {
        editableColorSlots.forEach((slot) => {
          colorMap[slot.hex] = slot.hex;
        });
        bgTransparent = true;
        bgColor = '#ffffff';
        strokeMode = 'regular';
        if (chkBgTransparent) chkBgTransparent.checked = true;
        if (bgColorWellWrap) {
          bgColorWellWrap.style.opacity = '0.45';
          bgColorWellWrap.style.background = bgColor;
        }
        if (bgColorWellTag) bgColorWellTag.textContent = bgColor;
        if (strokeSegmentedGroup) {
          strokeSegmentedGroup.querySelectorAll('[data-stroke-mode]').forEach((b) => {
            b.classList.toggle('active', b.dataset.strokeMode === 'regular');
          });
        }
        if (studioColorWellsList) {
          studioColorWellsList.innerHTML = buildColorWellsHtml();
          bindColorWellsInputs();
        }
        updateBrandGlow(editableColorSlots[0]?.hex || primaryHex);
        refreshStageAndCode(false);
      });
    }

    // Load Lordicon Lottie & Motion States
    async function loadLordiconStyleLottie(family, style, includeSvg = false) {
      try {
        const [lottie, liRes] = await Promise.all([
          ensureLottieWebLoaded(),
          apiFetchJson(
            `/api/lordicon/lottie?family=${encodeURIComponent(family)}&style=${encodeURIComponent(style)}&slug=${encodeURIComponent(icon.slug)}${includeSvg ? '&includeSvg=1' : ''}`
          ),
        ]);
        if (!liRes || !liRes.lottie) return;
        lordiconLottieData = liRes.lottie;
        lordiconMotionStates = liRes.states || [];
        const defState =
          lordiconMotionStates.find((s) => s.isDefault) ||
          lordiconMotionStates.find((s) => s.id.includes('hover')) ||
          lordiconMotionStates[0];
        activeMotionStateId = defState ? defState.id : '';

        if (includeSvg && liRes.rawSvg) {
          baseRawSvgForCurrentStyle = liRes.rawSvg;
          editableColorSlots = extractEditableColorsFromSvg(baseRawSvgForCurrentStyle);
          colorMap = {};
          editableColorSlots.forEach((slot) => {
            colorMap[slot.hex] = slot.hex;
          });
          if (studioColorWellsList) {
            studioColorWellsList.innerHTML = buildColorWellsHtml();
            bindColorWellsInputs();
          }
        }

        const statesWrap = document.getElementById('lordiconMotionStatesWrap');
        const stateLabel = document.getElementById('activeMotionStateLabel');
        if (stateLabel && defState) {
          stateLabel.textContent = defState.label;
        }
        if (statesWrap) {
          statesWrap.innerHTML = lordiconMotionStates
            .map(
              (st) => `
              <button type="button" class="motion-state-pill ${st.id === activeMotionStateId ? 'active' : ''}" data-motion-state="${escapeHtml(st.id)}">
                ${ICONS['play-circle']}
                <span>${escapeHtml(st.label)}</span>
              </button>
            `
            )
            .join('');

          statesWrap.querySelectorAll('[data-motion-state]').forEach((btn) => {
            btn.addEventListener('click', () => {
              activeMotionStateId = btn.dataset.motionState;
              statesWrap.querySelectorAll('[data-motion-state]').forEach((b) => b.classList.remove('active'));
              btn.classList.add('active');
              const picked = lordiconMotionStates.find((s) => s.id === activeMotionStateId);
              if (stateLabel && picked) stateLabel.textContent = picked.label;
              if (svgExportMode === 'static') {
                svgExportMode = 'loop';
                syncExportModeButtonsUI();
              }
              refreshStageAndCode(true, svgExportMode === 'hover');
            });
          });
        }

        refreshStageAndCode(svgExportMode === 'hover' || svgExportMode === 'loop');
      } catch {
        // Fallback to static SVG if .li is unavailable
      }
    }

    if (isLordicon) {
      loadLordiconStyleLottie(activeLordiconFamily, activeLordiconStyle, false);

      // Export Mode Selector (Static SVG | Animated SVG On Hover | Animated SVG Auto Loop)
      detailView.querySelectorAll('[data-svg-export-mode]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          svgExportMode = btn.dataset.svgExportMode;
          syncExportModeButtonsUI();
          await refreshStageAndCode(true, false);
        });
      });
    }

    // Back button: if user came from a Collection View, return to that Collection View; otherwise return to Catalog
    document.getElementById('btnBackToCatalog').addEventListener('click', () => {
      destroyActiveStageLottie();
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
        showToast(t('toastFavRemoved'));
      } else {
        favorites.add(favKey);
        btnDetailFav.classList.add('active-fav');
        btnDetailFav.innerHTML = ICONS.heartFilled;
        showToast(t('toastFavAdded'));
      }
      saveFavorites();
    });

    // Share Link
    document.getElementById('btnDetailShare').addEventListener('click', async () => {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t('toastIconLinkCopied'));
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

    // Standard Variant Switching
    detailView.querySelectorAll('[data-var-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeVariant = btn.dataset.varKey;
        baseRawSvgForCurrentStyle = svgVariantsContent[activeVariant] || data.rawSvg || '';
        editableColorSlots = extractEditableColorsFromSvg(baseRawSvgForCurrentStyle);
        colorMap = {};
        editableColorSlots.forEach((slot) => {
          colorMap[slot.hex] = slot.hex;
        });
        if (studioColorWellsList) {
          studioColorWellsList.innerHTML = buildColorWellsHtml();
          bindColorWellsInputs();
        }
        detailView.querySelectorAll('[data-var-key]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        refreshStageAndCode(false);
      });
    });

    // Lordicon Cross-Variant Switching
    detailView.querySelectorAll('[data-lordicon-var]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const [fam, st, colSlug, isLocalFlag, targetIconId] = btn.dataset.lordiconVar.split(':');
        if (isLocalFlag === '1' && colSlug && colSlug !== icon.collectionSlug) {
          openDetailPage('lordicon', colSlug, targetIconId || icon.id || icon.slug, true);
          return;
        }
        activeLordiconFamily = fam;
        activeLordiconStyle = st;
        detailView.querySelectorAll('[data-lordicon-var]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        await loadLordiconStyleLottie(fam, st, true);
      });
    });

    // Swatch Click -> Copy Hex
    detailView.querySelectorAll('[data-copy-hex]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const hex = btn.dataset.copyHex;
        await navigator.clipboard.writeText(hex);
        showToast(t('toastHexCopied', { hex: hex.toUpperCase() }));
      });
    });

    // Primary Copy / Download Actions (honors Static vs Hover Animated vs Loop Animated SVG export mode!)
    document.getElementById('btnHeroCopySvg').addEventListener('click', async () => {
      const finalSvg = await getOrCompileExportSvg();
      await navigator.clipboard.writeText(finalSvg.trim());
      await refreshStageAndCode(false);
      showToast(t('toastSvgCopied'));
    });

    document.getElementById('btnHeroCopyJsx').addEventListener('click', async () => {
      const finalSvg = await getOrCompileExportSvg();
      const compName = toPascalCaseComponentName(icon.slug || icon.title);
      await navigator.clipboard.writeText(svgToJsx(finalSvg, compName));
      showToast(t('toastJsxCopied', { comp: compName }));
    });

    document.getElementById('btnHeroCopyVue').addEventListener('click', async () => {
      const finalSvg = await getOrCompileExportSvg();
      await navigator.clipboard.writeText(svgToVue(finalSvg));
      showToast(t('toastVueCopied'));
    });

    document.getElementById('btnHeroCopyDataUri').addEventListener('click', async () => {
      const finalSvg = await getOrCompileExportSvg();
      await navigator.clipboard.writeText(svgToDataUri(finalSvg));
      showToast(t('toastDataUriCopied'));
    });

    document.getElementById('btnHeroDownloadSvg').addEventListener('click', async () => {
      const finalSvg = await getOrCompileExportSvg();
      const svgBlob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
      const dlUrl = URL.createObjectURL(svgBlob);
      const a = document.createElement('a');
      a.href = dlUrl;
      const modeSuffix =
        isLordicon && svgExportMode !== 'static'
          ? `-${activeLordiconFamily}-${activeLordiconStyle}-${svgExportMode}`
          : activeVariant !== 'default'
            ? `-${activeVariant}`
            : '';
      a.download = `${icon.slug || 'icon'}${modeSuffix}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(dlUrl), 1000);
      showToast(t('toastFileDownloaded', { file: a.download }));
    });

    // PNG Export Buttons (32px, 64px, 128px, 256px, 512px & Copy PNG)
    detailView.querySelectorAll('[data-export-png]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sz = Number(btn.dataset.exportPng) || 128;
        exportSvgToPng(getCustomizedStaticSvg(), sz, icon.slug || 'icon', false);
      });
    });

    detailView.querySelectorAll('[data-copy-png]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sz = Number(btn.dataset.copyPng) || 256;
        exportSvgToPng(getCustomizedStaticSvg(), sz, icon.slug || 'icon', true);
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
      await getOrCompileExportSvg();
      await navigator.clipboard.writeText(getFormattedCodeForTab(activeCodeTab));
      btnCopyActiveCode.classList.add('copied');
      btnCopyActiveCode.innerHTML = `${ICONS.check}<span>${escapeHtml(t('detailCopiedBtn'))}</span>`;
      showToast(t('toastCodeCopied', { tab: activeCodeTab.toUpperCase() }));
      setTimeout(() => {
        btnCopyActiveCode.classList.remove('copied');
        btnCopyActiveCode.innerHTML = `${ICONS.copy}<span>${escapeHtml(t('detailCopyCodeBtn'))}</span>`;
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
        const parts = activeDetailIconKey.split(':');
        if (parts.length >= 2) {
          openDetailPage('any', parts[0], parts[1], false);
        }
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

