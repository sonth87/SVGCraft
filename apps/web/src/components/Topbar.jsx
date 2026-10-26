export default function Topbar() {
  return (
    <div className="topbar-wrapper">
      <header className="topbar-glass">
        <a href="/" className="brand-link" id="logoResetBtn" aria-label="SVGCraft Trang chủ">
          <div className="brand-logo-mark" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" width="30" height="30">
              <rect
                x="2.5"
                y="2.5"
                width="27"
                height="27"
                rx="7.5"
                fill="var(--bg-card)"
                stroke="var(--border-hover)"
                strokeWidth="1.2"
              />
              <line x1="16" y1="3" x2="16" y2="29" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <line x1="3" y1="16" x2="29" y2="16" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
              <path
                d="M7.5 20.5L16 25.2L24.5 20.5"
                stroke="#6366f1"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 16.2L16 20.9L24.5 16.2"
                stroke="#fb923c"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 6.8L24.5 11.6L16 16.4L7.5 11.6L16 6.8Z"
                fill="rgba(249, 115, 22, 0.22)"
                stroke="#f97316"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <rect x="14.4" y="5.2" width="3.2" height="3.2" rx="0.8" fill="#f97316" />
              <rect x="22.9" y="10" width="3.2" height="3.2" rx="0.8" fill="#f97316" />
              <rect x="5.9" y="10" width="3.2" height="3.2" rx="0.8" fill="#f97316" />
              <circle cx="16" cy="16.4" r="2.1" fill="var(--bg-surface)" stroke="#f97316" strokeWidth="1.6" />
            </svg>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">SVGCraft</span>
          </div>
        </a>

        <div className="search-box" id="searchBoxWrap">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <div id="searchInlineChips" className="search-inline-chips" />
          <input
            type="search"
            id="searchInput"
            placeholder="Tìm kiếm icon theo tên, từ khóa, chủ đề, bộ sưu tập..."
            autoComplete="off"
          />
          <span className="kbd-hint">⌘K</span>

          {/* Smart Search Quick-Tag Popover on Focus */}
          <div id="searchFocusPopover" className="search-focus-popover" role="dialog" aria-label="Bộ lọc tìm kiếm nhanh">
            <div id="searchPopoverContent" />
          </div>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            id="btnCycleTone"
            className="pill-btn"
            title="Đổi nền khung xem trước (Auto / Dark / Light / Checker)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="3" />
              <path d="M3 9h18" />
              <path d="M3 15h18" />
              <path d="M9 3v18" />
              <path d="M15 3v18" />
            </svg>
            <span>
              Nền: <strong id="toneLabel">Auto</strong>
            </span>
          </button>
          <button type="button" id="btnToggleTheme" className="pill-btn" title="Đổi giao diện Sáng / Tối">
            <span id="themeIconWrap" className="icon-inline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </span>
            <span id="themeTextLabel">Light</span>
          </button>
        </div>
      </header>
    </div>
  );
}
