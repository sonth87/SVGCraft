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
