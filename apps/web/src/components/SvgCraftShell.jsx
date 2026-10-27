'use client';

import Script from 'next/script';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function SvgCraftShell() {
  return (
    <>
      {/* Ambient Brand Glow (active on Detail Page like thesvg.org) */}
      <div id="brandGlowBackdrop" className="brand-glow-backdrop" aria-hidden="true">
        <div id="brandGlowOrb" className="brand-glow-orb" />
      </div>

      {/* Sticky Glass Topbar */}
      <Topbar />

      {/* Main Shell: Compact Left Sidebar (Explore + Categories only) + Right Content Area */}
      <div className="app-shell">
        <Sidebar />

        <main className="main-area">
          {/* ==================== VIEW 1: CATALOG BROWSE VIEW ==================== */}
          <section id="catalogView" className="catalog-view">
            <div className="hero-bar">
              <div className="hero-copy">
                <h1 className="hero-title" id="heroHeading">
                  500.000+ Vector Icons. Inspect. Customize. Ship.
                </h1>
                <p className="hero-sub" id="heroSubheading">
                  Kho lưu trữ vector chuẩn hóa theo chủ đề, phong cách đường nét, biến thể Sáng/Tối và xuất mã trực
                  tiếp cho React, Vue, HTML &amp; PNG.
                </p>
              </div>

              {/* Top Filter Dropdowns (Style, Icon Kind, Collections, Sort, Sync) */}
              <div className="filter-bar-controls">
                {/* Style Filter Dropdown */}
                <div className="filter-dropdown" id="dropdownStyle">
                  <button type="button" className="filter-trigger" id="btnTriggerStyle" aria-expanded="false">
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
                      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                    </svg>
                    <span id="labelTriggerStyle">Phong cách</span>
                    <svg
                      className="chevron-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className="dropdown-panel" id="panelStyle" role="menu">
                    <div className="dropdown-panel-header">
                      <span>Phong cách (Style)</span>
                      <button type="button" className="dropdown-clear-btn" data-clear-dropdown="styleType">
                        Mặc định
                      </button>
                    </div>
                    <div id="filterStyleOptions" className="dropdown-options-list" />
                  </div>
                </div>

                {/* Icon Type Filter Dropdown */}
                <div className="filter-dropdown" id="dropdownIconType">
                  <button type="button" className="filter-trigger" id="btnTriggerIconType" aria-expanded="false">
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
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                    </svg>
                    <span id="labelTriggerIconType">Loại Icon</span>
                    <svg
                      className="chevron-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className="dropdown-panel" id="panelIconType" role="menu">
                    <div className="dropdown-panel-header">
                      <span>Loại Icon (Icon Kind)</span>
                      <button type="button" className="dropdown-clear-btn" data-clear-dropdown="iconType">
                        Mặc định
                      </button>
                    </div>
                    <div id="filterIconTypeOptions" className="dropdown-options-list" />
                  </div>
                </div>

                {/* Collections Filter Dropdown */}
                <div className="filter-dropdown" id="dropdownCollections">
                  <button type="button" className="filter-trigger" id="btnTriggerCollections" aria-expanded="false">
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
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                      <path d="M2 10h20" />
                    </svg>
                    <span id="labelTriggerCollections">Bộ sưu tập</span>
                    <span className="trigger-count-pill" id="badgeTotalCollections">
                      0
                    </span>
                    <svg
                      className="chevron-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className="dropdown-panel dropdown-panel-wide" id="panelCollections" role="menu">
                    <div className="dropdown-panel-header">
                      <span>
                        Bộ sưu tập (<strong id="colFilteredCount">0</strong>)
                      </span>
                      <button type="button" className="dropdown-clear-btn" data-clear-dropdown="collection">
                        Bỏ chọn
                      </button>
                    </div>
                    <div className="dropdown-search-wrap">
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
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <input
                        type="search"
                        id="collectionSearchInput"
                        placeholder="Tìm nhanh bộ sưu tập (VD: aws, lucide, solar...)"
                        autoComplete="off"
                      />
                    </div>
                    <div id="filterCollectionOptions" className="dropdown-options-list scroller collection-scroll-list" />
                  </div>
                </div>

                {/* Sort Select */}
                <div className="sort-select-wrap">
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
                    <path d="m3 16 4 4 4-4" />
                    <path d="M7 20V4" />
                    <path d="m21 8-4-4-4 4" />
                    <path d="M17 4v16" />
                  </svg>
                  <select id="sortSelect" aria-label="Sắp xếp" defaultValue="recent">
                    <option value="recent">Mới cập nhật</option>
                    <option value="az">Tên A → Z</option>
                    <option value="za">Tên Z → A</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button type="button" id="btnReloadCatalog" className="filter-trigger" title="Đồng bộ dữ liệu mới nhất">
                  <svg
                    id="reloadSpinIcon"
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
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                  <span id="reloadBtnText">Làm mới</span>
                </button>
              </div>
            </div>

            <div className="toolbar-row">
              <div className="toolbar-left-group">
                <div className="view-mode-switcher" id="viewModeSwitcher" role="tablist" aria-label="Chế độ hiển thị">
                  <button
                    type="button"
                    className="view-mode-btn active"
                    id="btnViewModeIcons"
                    data-view-mode="icons"
                    role="tab"
                    aria-selected="true"
                  >
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
                      <rect width="7" height="7" x="3" y="3" rx="1.5" />
                      <rect width="7" height="7" x="14" y="3" rx="1.5" />
                      <rect width="7" height="7" x="14" y="14" rx="1.5" />
                      <rect width="7" height="7" x="3" y="14" rx="1.5" />
                    </svg>
                    <span>Dàn trải Icons</span>
                  </button>
                  <button
                    type="button"
                    className="view-mode-btn"
                    id="btnViewModeCollections"
                    data-view-mode="collections"
                    role="tab"
                    aria-selected="false"
                  >
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
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                      <path d="M2 10h20" />
                    </svg>
                    <span>Theo Chủ đề &amp; Bộ sưu tập</span>
                  </button>
                </div>

                <div className="alphabet-bar" id="alphabetBar" role="group" aria-label="Lọc theo chữ cái đầu" />
              </div>

              <div className="results-counter">
                Hiển thị <strong id="showingCount">0</strong> / <strong id="totalMatchedCount">0</strong>{' '}
                <span id="resultsUnitLabel">icons</span>
              </div>
            </div>

            <div id="activeFiltersBar" className="active-filters-bar" style={{ display: 'none' }} />

            <div id="iconsGrid" className="icons-grid" />
            <div id="collectionsDirectoryGrid" className="collections-directory-grid" style={{ display: 'none' }} />

            <div id="loadMoreWrap" className="load-more-wrap" style={{ display: 'none' }}>
              <button type="button" id="btnLoadMore" className="btn-load-more">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
                <span id="loadMoreLabel">Tải thêm icon</span>
              </button>
            </div>
          </section>

          {/* ==================== VIEW 2: DEDICATED COLLECTION SCREEN ==================== */}
          <section id="collectionView" className="collection-view" style={{ display: 'none' }} aria-live="polite" />

          {/* ==================== VIEW 3: THESVG.ORG-STYLE DETAIL VIEW ==================== */}
          <section id="detailView" className="detail-view" style={{ display: 'none' }} aria-live="polite" />
        </main>
      </div>

      <div className="toast-container" id="toastContainer" role="status" aria-live="polite" />

      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
