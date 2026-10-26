(() => {
  const siteSelect = document.getElementById('siteSelect');
  const siteDescription = document.getElementById('siteDescription');
  const categorySelect = document.getElementById('categorySelect');
  const startListPageInput = document.getElementById('startListPage');
  const maxListPagesInput = document.getElementById('maxListPages');
  const maxCollectionsPerPageInput = document.getElementById('maxCollectionsPerPage');
  const maxPagesPerCollectionInput = document.getElementById('maxPagesPerCollection');
  const skipCompletedInput = document.getElementById('skipCompletedCollections');

  const postLoadDelayMinInput = document.getElementById('postLoadDelayMin');
  const postLoadDelayMaxInput = document.getElementById('postLoadDelayMax');
  const actionGapMinInput = document.getElementById('actionGapMin');
  const actionGapMaxInput = document.getElementById('actionGapMax');
  const downloadGapMinInput = document.getElementById('downloadGapMin');
  const downloadGapMaxInput = document.getElementById('downloadGapMax');
  const enableMouseMovementInput = document.getElementById('enableMouseMovement');
  const enableRandomScrollInput = document.getElementById('enableRandomScroll');
  const showVisualCursorInput = document.getElementById('showVisualCursor');
  const headlessModeInput = document.getElementById('headlessMode');

  const btnStart = document.getElementById('btnStart');
  const btnPause = document.getElementById('btnPause');
  const btnResume = document.getElementById('btnResume');
  const btnStop = document.getElementById('btnStop');
  const btnResetCheckpoint = document.getElementById('btnResetCheckpoint');
  const btnClearLogs = document.getElementById('btnClearLogs');
  const btnRefreshCollections = document.getElementById('btnRefreshCollections');

  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const statListPage = document.getElementById('statListPage');
  const statCurrentCol = document.getElementById('statCurrentCol');
  const statTotalCols = document.getElementById('statTotalCols');
  const statTotalIcons = document.getElementById('statTotalIcons');

  const currentActionLabel = document.getElementById('currentActionLabel');
  const collectionProgressNumbers = document.getElementById('collectionProgressNumbers');
  const collectionProgressBar = document.getElementById('collectionProgressBar');
  const liveIconsStrip = document.getElementById('liveIconsStrip');
  const sessionCounterBadge = document.getElementById('sessionCounterBadge');
  const logsContainer = document.getElementById('logsContainer');
  const collectionsGrid = document.getElementById('collectionsGrid');

  const collectionModal = document.getElementById('collectionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalBody = document.getElementById('modalBody');
  const btnCloseModal = document.getElementById('btnCloseModal');

  let availableSites = [];
  let liveIconItems = [];

  function formatTime(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('vi-VN', { hour12: false });
    } catch {
      return '';
    }
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function appendLog(entry) {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.dataset.level = entry.level || 'info';
    div.innerHTML = `
      <span class="log-time">[${escapeHtml(formatTime(entry.timestamp))}]</span>
      <span class="log-msg">${escapeHtml(entry.message)}</span>
    `;
    logsContainer.appendChild(div);
    while (logsContainer.children.length > 250) {
      logsContainer.removeChild(logsContainer.firstChild);
    }
    logsContainer.scrollTop = logsContainer.scrollHeight;
  }

  function updateStatusUI(status) {
    statusBadge.dataset.status = status || 'idle';
    const labels = {
      idle: 'Sẵn sàng (Idle)',
      running: 'Đang chạy Crawl...',
      paused: 'Đã tạm dừng (Paused)',
      stopping: 'Đang dừng...',
      error: 'Có lỗi (Error)',
    };
    statusText.textContent = labels[status] || status;

    const isRunning = status === 'running';
    const isPaused = status === 'paused';
    const isActive = isRunning || isPaused;

    btnStart.disabled = isActive;
    btnPause.disabled = !isRunning;
    btnPause.style.display = isPaused ? 'none' : 'inline-flex';
    btnResume.style.display = isPaused ? 'inline-flex' : 'none';
    btnStop.disabled = !isActive;
  }

  function updateSitesUI(sites, preserveInputs = false) {
    availableSites = sites || [];
    if (!siteSelect.options.length) {
      siteSelect.innerHTML = availableSites
        .map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`)
        .join('');
    }

    const selectedSiteId = siteSelect.value || availableSites[0]?.id || 'svgrepo';
    const siteObj = availableSites.find((s) => s.id === selectedSiteId) || availableSites[0];
    if (!siteObj) return;

    if (siteDescription) {
      siteDescription.textContent = siteObj.description || '';
    }

    if (!categorySelect.dataset.initializedFor || categorySelect.dataset.initializedFor !== siteObj.id) {
      categorySelect.innerHTML = (siteObj.categories || [{ id: 'all', label: 'Tất cả' }])
        .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.label)}</option>`)
        .join('');
      categorySelect.dataset.initializedFor = siteObj.id;
    }

    const st = siteObj.state || {};
    statTotalCols.textContent = st.totalCollectionsCrawled || 0;
    statTotalIcons.textContent = st.totalIconsDownloaded || 0;

    if (!preserveInputs) {
      if (st.currentCategory) categorySelect.value = st.currentCategory;
      if (st.currentListPage) {
        startListPageInput.value = st.currentListPage;
        statListPage.textContent = `#${st.currentListPage}`;
      }
    }
  }

  siteSelect.addEventListener('change', () => {
    updateSitesUI(availableSites, false);
  });

  function updateProgressUI(prog) {
    if (!prog) return;
    updateStatusUI(prog.status);

    statListPage.textContent = `#${prog.currentListPage || 1}`;
    statCurrentCol.textContent = prog.currentCollection || '—';
    currentActionLabel.textContent = prog.currentAction || 'Sẵn sàng';
    sessionCounterBadge.textContent = `Phiên này: ${prog.sessionIconsDownloaded || 0} SVG`;

    const downloaded = Number(prog.collectionIconsDownloaded || 0);
    const total = Number(prog.collectionIconsTotal || 0);

    if (prog.status === 'running' && total === 0) {
      collectionProgressBar.removeAttribute('value');
      collectionProgressNumbers.textContent = 'Đang thu thập thông tin trang...';
    } else {
      const maxVal = total > 0 ? total : 100;
      const curVal = total > 0 ? Math.min(downloaded, total) : 0;
      collectionProgressBar.max = maxVal;
      collectionProgressBar.value = curVal;
      collectionProgressNumbers.textContent =
        total > 0
          ? `${downloaded} / ${total} SVG (Trang ${prog.collectionPage || 1}/${prog.collectionTotalPages || 1})`
          : `${downloaded} SVG`;
    }
  }

  function prependLiveIcon(item) {
    liveIconItems.unshift(item);
    if (liveIconItems.length > 18) {
      liveIconItems.pop();
    }

    liveIconsStrip.innerHTML = liveIconItems
      .map((entry) => {
        const icon = entry.icon || {};
        const imgUrl = `/output/${encodeURIComponent(entry.siteId)}/${encodeURIComponent(entry.collectionSlug)}/${icon.relativePath}`;
        return `
          <div class="live-icon-pill" title="Collection: ${escapeHtml(entry.collectionName)}">
            <div class="live-icon-thumb">
              <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(icon.title)}" loading="lazy" />
            </div>
            <div>
              <div style="font-size:0.82rem;font-weight:600">${escapeHtml(icon.title || icon.slug)}</div>
              <div style="font-size:0.74rem;color:var(--text-muted)">
                ${escapeHtml(icon.category || '')} · ${escapeHtml(icon.styleType || '')} · ${escapeHtml(icon.gridSize || '')}
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  async function fetchCollectionsGallery() {
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      renderCollectionsGallery(data.collections || []);
    } catch (err) {
      console.error('Failed to load collections:', err);
    }
  }

  function renderCollectionsGallery(collections) {
    if (!collections.length) {
      collectionsGrid.innerHTML = `
        <div style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:24px;">
          Chưa có collection nào được lưu trong thư mục <code>output/</code>. Hãy nhấn <strong>"Bắt đầu Crawl"</strong> để bắt đầu!
        </div>
      `;
      return;
    }

    collectionsGrid.innerHTML = collections
      .map((col) => {
        const samples = (col.sampleIcons || []).slice(0, 6);
        const tags = (col.tags || []).slice(0, 6);
        return `
          <article class="collection-card">
            <div class="collection-header">
              <div>
                <div class="collection-title">${escapeHtml(col.name || col.slug)}</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">[${escapeHtml(col.site)}] /${escapeHtml(col.slug)}</div>
              </div>
              <span class="badge">${col.downloadedIconsCount || 0} / ${col.totalIcons || '?'} SVG</span>
            </div>

            <div class="collection-meta">
              <span>👤 <strong>Tác giả:</strong> ${escapeHtml(col.author || 'Community')}</span>
              <span>⚖️ <strong>Giấy phép:</strong> ${escapeHtml(col.license || 'Open')}</span>
            </div>

            <div class="preview-strip">
              ${
                samples.length
                  ? samples
                      .map((ic) => {
                        const src = `/output/${encodeURIComponent(col.site)}/${encodeURIComponent(col.slug)}/${ic.relativePath}`;
                        return `<div class="preview-thumb" title="${escapeHtml(ic.title)} (${escapeHtml(ic.category)} / ${escapeHtml(ic.styleType)})"><img src="${escapeHtml(src)}" alt="${escapeHtml(ic.title)}" loading="lazy" /></div>`;
                      })
                      .join('')
                  : '<span style="grid-column:1/-1;font-size:0.75rem;color:var(--text-muted)">Đang tải SVG...</span>'
              }
            </div>

            <div class="tags-list">
              ${tags.map((t) => `<span class="tag-chip">#${escapeHtml(t)}</span>`).join('')}
            </div>

            <div style="margin-top:auto;padding-top:6px;display:flex;justify-content:space-between;align-items:center">
              <a href="${escapeHtml(col.url || '#')}" target="_blank" rel="noopener" style="font-size:0.78rem;color:var(--accent-color);text-decoration:none">🔗 Nguồn (${escapeHtml(col.site)})</a>
              <button type="button" class="btn-secondary btn-sm" data-open-col="${escapeHtml(col.site)}:${escapeHtml(col.slug)}">
                🔍 Xem chi tiết &amp; Metadata
              </button>
            </div>
          </article>
        `;
      })
      .join('');
  }

  collectionsGrid.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-open-col]');
    if (!btn) return;
    const [site, slug] = btn.dataset.openCol.split(':');
    await openCollectionModal(site, slug);
  });

  async function openCollectionModal(site, slug) {
    try {
      const res = await fetch(`/api/collections/${encodeURIComponent(site)}/${encodeURIComponent(slug)}`);
      if (!res.ok) return;
      const meta = await res.json();
      const col = meta.collection || {};
      const icons = meta.icons || [];

      modalTitle.textContent = `${col.name || col.slug} (${icons.length} SVG đã tải)`;
      modalSubtitle.textContent = `Nguồn: ${site} · Tác giả: ${col.author || 'Community'} · Giấy phép: ${col.license || 'Open'} · Đường dẫn: output/${site}/${slug}/`;

      modalBody.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:14px;font-size:0.86rem">
          <div><strong>Slug:</strong> <code>${escapeHtml(col.slug)}</code></div>
          <div><strong>Tổng số icon gốc:</strong> ${escapeHtml(col.totalIcons)}</div>
          <div><strong>Tác giả:</strong> ${escapeHtml(col.author)}</div>
          <div><strong>Giấy phép:</strong> <span class="badge">${escapeHtml(col.license)}</span></div>
        </div>
        <div class="tags-list" style="margin-bottom:16px">
          ${(col.tags || []).map((t) => `<span class="tag-chip">#${escapeHtml(t)}</span>`).join('')}
        </div>
        <div class="modal-icons-grid">
          ${icons
            .map((ic) => {
              const svgUrl = `/output/${encodeURIComponent(site)}/${encodeURIComponent(slug)}/${ic.relativePath}`;
              return `
                <div class="modal-icon-card">
                  <a href="${escapeHtml(svgUrl)}" target="_blank" class="icon-box" title="Mở file SVG gốc">
                    <img src="${escapeHtml(svgUrl)}" alt="${escapeHtml(ic.title)}" loading="lazy" />
                  </a>
                  <div style="font-size:0.8rem;font-weight:600;word-break:break-word">${escapeHtml(ic.title)}</div>
                  <div style="font-size:0.72rem;color:var(--text-muted)">
                    ${escapeHtml(ic.category || 'general')} · ${escapeHtml(ic.styleType || 'filled')} · <strong>${escapeHtml(ic.gridSize)}</strong>
                  </div>
                  <div class="tags-list" style="justify-content:center">
                    ${(ic.tags || [])
                      .slice(0, 4)
                      .map((t) => `<span class="tag-chip">${escapeHtml(t)}</span>`)
                      .join('')}
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;

      collectionModal.showModal();
    } catch (err) {
      console.error('Error loading collection detail:', err);
    }
  }

  btnCloseModal.addEventListener('click', () => collectionModal.close());
  collectionModal.addEventListener('click', (e) => {
    if (e.target === collectionModal) collectionModal.close();
  });

  function gatherOptions() {
    return {
      category: categorySelect.value || 'all',
      startListPage: Number(startListPageInput.value) || 1,
      maxListPages: Number(maxListPagesInput.value) || 0,
      maxCollectionsPerPage: Number(maxCollectionsPerPageInput.value) || 0,
      maxPagesPerCollection: Number(maxPagesPerCollectionInput.value) || 0,
      skipCompletedCollections: skipCompletedInput.checked,
      postLoadDelayMin: Number(postLoadDelayMinInput.value) || 1800,
      postLoadDelayMax: Number(postLoadDelayMaxInput.value) || 4000,
      actionGapMin: Number(actionGapMinInput.value) || 900,
      actionGapMax: Number(actionGapMaxInput.value) || 2500,
      downloadGapMin: Number(downloadGapMinInput.value) || 120,
      downloadGapMax: Number(downloadGapMaxInput.value) || 400,
      enableMouseMovement: enableMouseMovementInput.checked,
      enableRandomScroll: enableRandomScrollInput.checked,
      showVisualCursor: showVisualCursorInput.checked,
      headless: headlessModeInput.checked,
    };
  }

  btnStart.addEventListener('click', async () => {
    const siteId = siteSelect.value || 'svgrepo';
    const options = gatherOptions();
    btnStart.disabled = true;

    try {
      const res = await fetch('/api/crawl/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, options }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Không thể bắt đầu crawl');
        btnStart.disabled = false;
        return;
      }
      updateStatusUI(data.status);
    } catch (err) {
      alert('Lỗi kết nối tới server: ' + err.message);
      btnStart.disabled = false;
    }
  });

  btnPause.addEventListener('click', async () => {
    await fetch('/api/crawl/pause', { method: 'POST' });
  });

  btnResume.addEventListener('click', async () => {
    await fetch('/api/crawl/resume', { method: 'POST' });
  });

  btnStop.addEventListener('click', async () => {
    btnStop.disabled = true;
    await fetch('/api/crawl/stop', { method: 'POST' });
    await fetchCollectionsGallery();
  });

  btnResetCheckpoint.addEventListener('click', async () => {
    const siteId = siteSelect.value || 'svgrepo';
    const res = await fetch('/api/state/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId }),
    });
    if (res.ok) {
      startListPageInput.value = 1;
      statListPage.textContent = '#1';
    }
  });

  btnClearLogs.addEventListener('click', () => {
    logsContainer.innerHTML = '';
  });

  btnRefreshCollections.addEventListener('click', () => {
    fetchCollectionsGallery();
  });

  async function init() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      updateSitesUI(data.sites || [], false);
      updateStatusUI(data.status || 'idle');
      if (data.progress) updateProgressUI(data.progress);
      (data.logs || []).forEach(appendLog);
    } catch (err) {
      console.error('Init error:', err);
    }

    await fetchCollectionsGallery();

    const evtSource = new EventSource('/api/events');
    evtSource.addEventListener('init', (e) => {
      const payload = JSON.parse(e.data);
      const isActive = payload.status === 'running' || payload.status === 'paused';
      updateSitesUI(payload.sites || [], isActive);
      updateStatusUI(payload.status || 'idle');
      if (payload.progress) updateProgressUI(payload.progress);
      fetchCollectionsGallery();
    });

    evtSource.addEventListener('log', (e) => {
      const entry = JSON.parse(e.data);
      appendLog(entry);
    });

    evtSource.addEventListener('progress', (e) => {
      const payload = JSON.parse(e.data);
      if (payload.sites) updateSitesUI(payload.sites, true);
      if (payload.progress) updateProgressUI(payload.progress);
    });

    let lastGalleryFetch = 0;
    function throttledFetchGallery(minIntervalMs = 12000) {
      const now = Date.now();
      if (now - lastGalleryFetch >= minIntervalMs) {
        lastGalleryFetch = now;
        fetchCollectionsGallery();
      }
    }

    evtSource.addEventListener('collection_updated', () => {
      throttledFetchGallery(5000);
    });

    evtSource.addEventListener('icon_downloaded', (e) => {
      const item = JSON.parse(e.data);
      prependLiveIcon(item);
      throttledFetchGallery(15000);
    });

    evtSource.addEventListener('sites_updated', (e) => {
      const sites = JSON.parse(e.data);
      updateSitesUI(sites, false);
    });
  }

  init();
})();
