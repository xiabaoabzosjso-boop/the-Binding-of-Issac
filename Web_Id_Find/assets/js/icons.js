// ============================================================================
// Unified Hand-Drawn Ink SVG Library + Crisp 32px/48px Minimal Icons (#118, #182, #636)
// ============================================================================

window.ISAAC_ICONS = (() => {
  const UI_ICONS = {
    bookmarkCatalog: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18110e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="#fef3c7"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="#f3d078"/><path d="M9 7h7M9 11h5"/></svg>`,
    bookmarkGallery: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18110e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" fill="#f3d078"/><rect x="6" y="6" width="12" height="12" fill="#991b1b"/><circle cx="9.5" cy="9.5" r="1.5" fill="#fde047" stroke="none"/><path d="m6 16 4-4 3 3 3-4 2 5" fill="#d9a441"/></svg>`,
    bookmarkSticker: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18110e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" fill="#fef3c7"/><path d="M14 3v4a2 2 0 0 0 2 2h4" fill="#d9a441"/><circle cx="10" cy="13" r="2.5" fill="#ef4444"/></svg>`,
    bookmarkAlchemy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18110e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 21 7 21 17 12 22 3 17 3 7" fill="#a855f7"/><path d="M12 7v10m0 0-3.5-3.5M12 17l3.5-3.5" stroke="#fde047"/></svg>`,
    heartRed: `<svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17.2S2.5 12.2 2.5 6.8C2.5 4.2 4.5 2.5 7 2.5c1.5 0 2.5.8 3 1.8.5-1 1.5-1.8 3-1.8 2.5 0 4.5 1.7 4.5 4.3 0 5.4-7.5 10.4-7.5 10.4z" fill="#ef4444" stroke="#18110e" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    heartSoul: `<svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17.2S2.5 12.2 2.5 6.8C2.5 4.2 4.5 2.5 7 2.5c1.5 0 2.5.8 3 1.8.5-1 1.5-1.8 3-1.8 2.5 0 4.5 1.7 4.5 4.3 0 5.4-7.5 10.4-7.5 10.4z" fill="#38bdf8" stroke="#18110e" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    heartBlack: `<svg width="15" height="15" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17.2S2.5 12.2 2.5 6.8C2.5 4.2 4.5 2.5 7 2.5c1.5 0 2.5.8 3 1.8.5-1 1.5-1.8 3-1.8 2.5 0 4.5 1.7 4.5 4.3 0 5.4-7.5 10.4-7.5 10.4z" fill="#27272a" stroke="#18110e" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    statDmg: `<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 3.5 17 6l-9.5 9.5H5v-2.5L14.5 3.5z" fill="#ef4444"/><path d="m3 17 2.5-2.5"/></svg>`,
    statTears: `<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3s5.5 6.2 5.5 10A5.5 5.5 0 0 1 4.5 13C4.5 9.2 10 3 10 3z" fill="#38bdf8" stroke="#18110e" stroke-width="2"/></svg>`,
    statSpd: `<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#18110e" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M4 15h13l-1.5-4.5-4.5-1-2-4H5.5v9.5z" fill="#4ade80"/></svg>`,
    devTerminal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3d078" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    diceMini: `<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="#18110e" stroke-width="2.2" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="2.5" fill="#f3d078"/><circle cx="7" cy="7" r="1.2" fill="#18110e"/><circle cx="13" cy="13" r="1.2" fill="#18110e"/><circle cx="10" cy="10" r="1.2" fill="#991b1b"/></svg>`,
    doorTreasure: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V12a10 10 0 0 1 20 0v16H6z" fill="#f59e0b" stroke="#18110e" stroke-width="2.5"/><path d="M10 28V13a6 6 0 0 1 12 0v15" fill="#78350f" stroke="#18110e" stroke-width="2"/><polygon points="11,9 13.5,6 16,9 18.5,6 21,9 20,12 12,12" fill="#fde047" stroke="#18110e" stroke-width="1.6"/></svg>`,
    doorDevil: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V12a10 10 0 0 1 20 0v16H6z" fill="#7f1d1d" stroke="#18110e" stroke-width="2.5"/><path d="M5 9C3 4 8 3 10 7M27 9c2-5-3-6-5-2" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/><path d="M10 28V14a6 6 0 0 1 12 0v14" fill="#18110e"/></svg>`,
    doorAngel: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V12a10 10 0 0 1 20 0v16H6z" fill="#bae6fd" stroke="#18110e" stroke-width="2.5"/><ellipse cx="16" cy="5" rx="6" ry="2" fill="none" stroke="#fde047" stroke-width="2.4"/><path d="M10 28V14a6 6 0 0 1 12 0v14" fill="#fef9c3" stroke="#18110e" stroke-width="2"/><path d="M16 12v12M12 16.5h8" stroke="#f59e0b" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    doorSecret: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="5" width="22" height="23" rx="2" fill="#44403c" stroke="#18110e" stroke-width="2.5"/><text x="16" y="23" text-anchor="middle" font-family="monospace" font-weight="900" font-size="15" fill="#e879f9">?</text></svg>`,
    doorPlanet: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V12a10 10 0 0 1 20 0v16H6z" fill="#1e1b4b" stroke="#18110e" stroke-width="2.5"/><circle cx="16" cy="17" r="4.5" fill="#38bdf8" stroke="#fde047" stroke-width="1.6"/><ellipse cx="16" cy="17" rx="9" ry="2.8" transform="rotate(-22 16 17)" fill="none" stroke="#fde047" stroke-width="2"/></svg>`,
    doorBoss: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V12a10 10 0 0 1 20 0v16H6z" fill="#57534e" stroke="#18110e" stroke-width="2.5"/><circle cx="16" cy="16" r="5.5" fill="#e7e5e4" stroke="#18110e" stroke-width="2"/><circle cx="14" cy="15.5" r="1.4" fill="#dc2626"/><circle cx="18" cy="15.5" r="1.4" fill="#dc2626"/></svg>`,
    doorShop: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V12a10 10 0 0 1 20 0v16H6z" fill="#a16207" stroke="#18110e" stroke-width="2.5"/><circle cx="16" cy="17" r="6" fill="#fde047" stroke="#18110e" stroke-width="2"/><path d="M16 13v8" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    doorCurse: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="6" width="20" height="22" fill="#450a0a" stroke="#18110e" stroke-width="2.5"/><path d="M6 10l3 2-3 2M6 18l3 2-3 2M26 10l-3 2 3 2M26 18l-3 2 3 2" fill="none" stroke="#ef4444" stroke-width="2.2"/></svg>`,
    doorLibrary: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V12a10 10 0 0 1 20 0v16H6z" fill="#78350f" stroke="#18110e" stroke-width="2.5"/><rect x="10" y="12" width="12" height="11" rx="1" fill="#fef3c7" stroke="#18110e" stroke-width="2"/><path d="M16 12v11" stroke="#18110e" stroke-width="2"/></svg>`,
    doorSpecial: `<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="5" width="22" height="22" rx="4" fill="#3f2e24" stroke="#18110e" stroke-width="2.5"/><path d="M16 9l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill="#f3d078" stroke="#18110e" stroke-width="1.6"/></svg>`,
  };

  // ==========================================================================
  // NEW v2.0 CRISP MINIMAL SMALL-SIZE ICONS (#118, #182, #636)
  // Designed strictly for 32px & 48px silhouette clarity:
  // - Consistent 2.4px ink outline (#140e0c)
  // - Clean padding/whitespace, zero background pedestal/glow clutter
  // - Limited 3-4 tone flat palette
  // ==========================================================================
  const MINIMAL_SMALL_ICONS = {
    // #118 Brimstone: Bold Leviathan double-cross + infinity loop
    118: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4v15M10 9h12M11 14h10" stroke="#140e0c" stroke-width="5.2" stroke-linecap="round"/>
      <path d="M16 19.5c-4.2-1-8 1-8 4.4 0 3.2 3.8 4.2 8 2 4.2 2.2 8 1.2 8-2 0-3.4-3.8-5.4-8-4.4Z" stroke="#140e0c" stroke-width="5.2" stroke-linejoin="round"/>
      <path d="M16 4v15M10 9h12M11 14h10" stroke="#dc2626" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M16 19.5c-4.2-1-8 1-8 4.4 0 3.2 3.8 4.2 8 2 4.2 2.2 8 1.2 8-2 0-3.4-3.8-5.4-8-4.4Z" stroke="#dc2626" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M16 5.2v3.2" stroke="#fca5a5" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,

    // #182 Sacred Heart: Pure ivory heart + golden halo + crimson core cross
    182: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <ellipse cx="16" cy="5.5" rx="6.5" ry="2.1" stroke="#140e0c" stroke-width="4.2"/>
      <ellipse cx="16" cy="5.5" rx="6.5" ry="2.1" stroke="#f59e0b" stroke-width="2"/>
      <path d="M16 27.5S5.5 20.6 5.5 13.6C5.5 9.8 8.3 7.8 11.4 7.8c2 0 3.6 1 4.6 2.5 1-1.5 2.6-2.5 4.6-2.5 3.1 0 5.9 2 5.9 5.8 0 7-10.5 13.9-10.5 13.9Z" fill="#fefce8" stroke="#140e0c" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M16 13v8M12.5 16.5h7" stroke="#dc2626" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,

    // #636 R Key: Clean retro mechanical keycap + high-contrast green R
    636: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" rx="4.5" fill="#c9bda6" stroke="#140e0c" stroke-width="2.4"/>
      <rect x="6.5" y="5.5" width="19" height="17" rx="3" fill="#f8f3e6" stroke="#140e0c" stroke-width="2"/>
      <path d="M12.2 19V9.5h4.2c1.8 0 3 1 3 2.6 0 1.3-.8 2.2-2.1 2.5L19.8 19M12.2 14.7h4.1" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };

  // Fallback category icons for any item (supports 62 built-in AND 700+ imported items cleanly)
  function renderCategoryFallback(item, px) {
    const icon = (item && item.icon) || "tear";
    const palette = {
      brimstone: ["#dc2626", "#fca5a5", "B"],
      angel: ["#f59e0b", "#fef9c3", "A"],
      devil: ["#991b1b", "#fecaca", "D"],
      dice: ["#4338ca", "#fde047", "6"],
      planet: ["#0284c7", "#bae6fd", "P"],
      mushroom: ["#ef4444", "#fef3c7", "M"],
      tech: ["#16a34a", "#bbf7d0", "X"],
      knife: ["#52525b", "#f4f4f5", "K"],
      heart: ["#e11d48", "#ffe4e6", "♥"],
      eye: ["#0284c7", "#e0f2fe", "◉"],
      fly: ["#7e22ce", "#f3e8ff", "F"],
      book: ["#1d4ed8", "#fef08a", "B"],
      rock: ["#78716c", "#e7e5e4", "R"],
      poison: ["#65a30d", "#ecfccb", "!"],
      syringe: ["#15803d", "#dcfce7", "+"],
      guppy: ["#27272a", "#f4f4f5", "G"],
      psychic: ["#9333ea", "#f3e8ff", "Ψ"],
      glitch: ["#0891b2", "#fde047", "?"],
    };
    const [bg, fg, glyph] = palette[icon] || ["#57534e", "#f8f0df", "#"];
    return `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="24" height="24" rx="6" fill="${bg}" stroke="#140e0c" stroke-width="2.4"/>
      <text x="16" y="21" text-anchor="middle" font-family="monospace" font-size="13" font-weight="900" fill="${fg}">${glyph}</text>
    </svg>`;
  }

  // Distinct compact SVGs for other built-in items
  const BUILTIN_SVGS = {
    1: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 4c-1.5 2-2.5 3-2.5 4.8h5C18.5 7 17.5 6 16 4Z" fill="#84cc16" stroke="#140e0c" stroke-width="2"/><path d="M16 8c-6.2 1.6-8.8 6.4-7.8 12.2 1 4.6 4 6.8 7.8 6.8s6.8-2.2 7.8-6.8C24.8 14.4 22.2 9.6 16 8Z" fill="#f3e8ff" stroke="#140e0c" stroke-width="2.2"/><path d="M11 17v7M21 17v7" stroke="#38bdf8" stroke-width="2.6" stroke-linecap="round"/><circle cx="11.8" cy="16.5" r="2" fill="#140e0c"/><circle cx="20.2" cy="16.5" r="2" fill="#140e0c"/></svg>`,
    2: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16.5" r="10.5" fill="#f5cfc4" stroke="#140e0c" stroke-width="2.2"/><ellipse cx="16" cy="11" rx="4" ry="2.5" fill="#fff" stroke="#140e0c" stroke-width="1.8"/><circle cx="16" cy="11" r="1.4" fill="#dc2626"/><circle cx="11" cy="18" r="2" fill="#140e0c"/><circle cx="21" cy="18" r="2" fill="#140e0c"/></svg>`,
    3: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M7 25c3.5-4.5 6.5-8.5 8.5-11.5" stroke="#140e0c" stroke-width="4.4" stroke-linecap="round"/><path d="M7 25c3.5-4.5 6.5-8.5 8.5-11.5" stroke="#e4e4e7" stroke-width="2.2" stroke-linecap="round"/><path d="M14.5 13.5c-2-3.2-.8-7.5 3-9 3.6-1.3 6.5 1.8 5.5 5.8-.8 3.2-4.2 4.5-8.5 3.2Z" fill="#f4f4f5" stroke="#140e0c" stroke-width="2.2"/><circle cx="25" cy="14" r="2" fill="#c084fc"/></svg>`,
    4: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6.5 7.5c-1.5 2-1.5 5.5 0 8l1.8-2.4c1 7 3.5 11.8 7.7 11.8s6.7-4.8 7.7-11.8l1.8 2.4c1.5-2.5 1.5-6 0-8-2 1-3.5 2.8-4.5 4.5-2.8-1-7.2-1-10 0-1-1.7-2.5-3.5-4.5-4.5Z" fill="#e6c499" stroke="#140e0c" stroke-width="2.2" stroke-linejoin="round"/><circle cx="11.5" cy="16" r="2.5" fill="#fef08a" stroke="#140e0c" stroke-width="1.6"/><circle cx="20.5" cy="16" r="2.5" fill="#fef08a" stroke="#140e0c" stroke-width="1.6"/><circle cx="11.5" cy="16" r="1.2" fill="#140e0c"/><circle cx="20.5" cy="16" r="1.2" fill="#140e0c"/></svg>`,
    11: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M10.5 16h11v8c0 2.2-2.4 3.5-5.5 3.5s-5.5-1.3-5.5-3.5v-8Z" fill="#fef3c7" stroke="#140e0c" stroke-width="2.1"/><path d="M4.5 16.5C4.5 9.5 9.2 5 16 5s11.5 4.5 11.5 11.5c0 1.8-2.4 2.2-11.5 2.2S4.5 18.3 4.5 16.5Z" fill="#22c55e" stroke="#140e0c" stroke-width="2.2"/><circle cx="10" cy="11.5" r="2.3" fill="#fff"/><circle cx="21.5" cy="11" r="2.4" fill="#fff"/></svg>`,
    12: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M10.5 16h11v8c0 2.2-2.4 3.5-5.5 3.5s-5.5-1.3-5.5-3.5v-8Z" fill="#fde68a" stroke="#140e0c" stroke-width="2.1"/><path d="M4.5 16.5C4.5 9.5 9.2 5 16 5s11.5 4.5 11.5 11.5c0 1.8-2.4 2.2-11.5 2.2S4.5 18.3 4.5 16.5Z" fill="#ef4444" stroke="#140e0c" stroke-width="2.2"/><circle cx="10" cy="11.5" r="2.3" fill="#fff"/><circle cx="21.5" cy="11" r="2.4" fill="#fff"/></svg>`,
    105: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 9.5 16 5l10 4.5v13L16 27 6 22.5v-13Z" fill="#dc2626" stroke="#140e0c" stroke-width="2.2" stroke-linejoin="round"/><path d="M6 9.5 16 14l10-4.5M16 14v13" stroke="#140e0c" stroke-width="1.8"/><circle cx="11" cy="16" r="1.4" fill="#fff"/><circle cx="21" cy="16" r="1.4" fill="#fff"/><circle cx="21" cy="21" r="1.4" fill="#fff"/></svg>`,
    114: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M23 5 9 19l4 4L27 9.5c1-2.2 0-4-4-4.5Z" fill="#f4f4f5" stroke="#140e0c" stroke-width="2.2" stroke-linejoin="round"/><path d="M9 19 4.5 23.5l3.5 3.5L12.5 22.5Z" fill="#92400e" stroke="#140e0c" stroke-width="2.1" stroke-linejoin="round"/><path d="M20 9.5 23.5 13" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    331: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><polygon points="16,4 28,26 4,26" fill="#fde047" stroke="#140e0c" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="16" cy="18.5" rx="6" ry="3.4" fill="#fff" stroke="#140e0c" stroke-width="1.8"/><circle cx="16" cy="18.5" r="1.9" fill="#0284c7"/></svg>`,
    395: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="10" stroke="#140e0c" stroke-width="4.6"/><circle cx="16" cy="16" r="10" stroke="#4ade80" stroke-width="2.4"/><circle cx="16" cy="16" r="4.2" fill="#bbf7d0" stroke="#140e0c" stroke-width="1.8"/></svg>`,
    562: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6.5 24 5 13l6.5-6.5 11 .8 4.5 8-3 8.7H6.5Z" fill="#a8a29e" stroke="#140e0c" stroke-width="2.2" stroke-linejoin="round"/><path d="M16 23v-7m0 0-3.2 3.2M16 16l3.2 3.2" stroke="#fde047" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    678: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="10.5" fill="#fda4af" fill-opacity="0.45" stroke="#140e0c" stroke-width="2.2"/><circle cx="16" cy="13" r="4" fill="#fecdd3" stroke="#140e0c" stroke-width="1.8"/><path d="M16 17c-2.4 0-3.2 2.4-2.8 4.8.4 1.6 2.8 2.2 4 1.6" stroke="#e11d48" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    689: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 23 7 10l5.5 5.5L16 7l3.5 8.5L25 10l2 13H5Z" fill="#fbbf24" stroke="#140e0c" stroke-width="2.2" stroke-linejoin="round"/><rect x="9.5" y="14.5" width="3.5" height="3.5" fill="#22d3ee"/><rect x="19" y="14.5" width="3.5" height="3.5" fill="#f43f5e"/></svg>`,
    723: (px) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" fill="none" aria-hidden="true"><polygon points="16,3.5 27.5,10 27.5,22 16,28.5 4.5,22 4.5,10" fill="#4338ca" stroke="#140e0c" stroke-width="2.2" stroke-linejoin="round"/><path d="M16 9.5v12m0 0-4-4m4 4 4-4" stroke="#fde047" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };

  function getItemIcon(item, px = 44) {
    if (item && MINIMAL_SMALL_ICONS[item.id]) {
      return MINIMAL_SMALL_ICONS[item.id](px);
    }
    if (item && BUILTIN_SVGS[item.id]) {
      return BUILTIN_SVGS[item.id](px);
    }
    return renderCategoryFallback(item, px);
  }

  return {
    UI: UI_ICONS,
    MINIMAL_SMALL_ICONS,
    getItemIcon,
  };
})();
