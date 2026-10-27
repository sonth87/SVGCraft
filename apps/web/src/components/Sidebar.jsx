export default function Sidebar() {
  return (
    <aside className="sidebar scroller" aria-label="Danh mục chủ đề SVG">
      <div className="sidebar-section">
        <div className="sidebar-heading">Khám phá</div>
        <button type="button" className="nav-item active" id="navAllIcons">
          <span className="nav-item-left">
            <span className="nav-icon">
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
                <rect width="7" height="7" x="3" y="3" rx="1.5" />
                <rect width="7" height="7" x="14" y="3" rx="1.5" />
                <rect width="7" height="7" x="14" y="14" rx="1.5" />
                <rect width="7" height="7" x="3" y="14" rx="1.5" />
              </svg>
            </span>
            <span>Tất cả Icons</span>
          </span>
        </button>
        <button type="button" className="nav-item" id="navCollectionsDirectory">
          <span className="nav-item-left">
            <span className="nav-icon">
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
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                <path d="M2 10h20" />
              </svg>
            </span>
            <span>Bộ sưu tập</span>
          </span>
          <span className="nav-count" id="sidebarCountCollections">
            0
          </span>
        </button>
        <button type="button" className="nav-item" id="navBrandsDirectory">
          <span className="nav-item-left">
            <span className="nav-icon">
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
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <span>Thương hiệu</span>
          </span>
          <span className="nav-count" id="sidebarCountBrands">
            0
          </span>
        </button>
        <button type="button" className="nav-item" id="navFavorites">
          <span className="nav-item-left">
            <span className="nav-icon">
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
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
            <span>Đã yêu thích</span>
          </span>
          <span className="nav-count" id="countFavorites">
            0
          </span>
        </button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading-row">
          <span className="sidebar-heading">Chủ đề (Categories)</span>
          <button
            type="button"
            id="btnResetCategory"
            className="sidebar-mini-reset"
            style={{ display: 'none' }}
            title="Bỏ lọc chủ đề"
          >
            Tất cả
          </button>
        </div>
        <div id="sidebarCategories" className="sidebar-list" />
      </div>
    </aside>
  );
}
