const express = require('express');
const path = require('path');
const { StateManager, OUTPUT_DIR } = require('@svg-hub/shared');
function getCrawlers() {
  try {
    delete require.cache[require.resolve('./crawlers')];
  } catch {
    // Ignore
  }
  return require('./crawlers');
}

const app = express();
const PORT = process.env.CRAWLER_PORT || 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/output', express.static(OUTPUT_DIR));

const stateManager = new StateManager();
let activeCrawler = null;
const recentLogs = [];
const MAX_LOGS = 250;
const sseClients = new Set();

function pushLog(entry) {
  recentLogs.push(entry);
  if (recentLogs.length > MAX_LOGS) {
    recentLogs.shift();
  }
  broadcastEvent('log', entry);
}

function broadcastEvent(type, payload) {
  const data = `event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(data);
    } catch {
      sseClients.delete(res);
    }
  }
}

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const initialPayload = {
    status: activeCrawler ? activeCrawler.status : 'idle',
    progress: activeCrawler ? activeCrawler.currentProgress : null,
    sites: getCrawlers().getAvailableSites(stateManager),
  };
  res.write(`event: init\ndata: ${JSON.stringify(initialPayload)}\n\n`);

  sseClients.add(res);
  req.on('close', () => {
    sseClients.delete(res);
  });
});

app.get('/api/sites', (req, res) => {
  res.json({
    sites: getCrawlers().getAvailableSites(stateManager),
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: activeCrawler ? activeCrawler.status : 'idle',
    progress: activeCrawler ? activeCrawler.currentProgress : null,
    logs: recentLogs,
    sites: getCrawlers().getAvailableSites(stateManager),
  });
});

app.get('/api/collections', (req, res) => {
  const siteId = req.query.site || null;
  const collections = stateManager.listCrawledCollections(siteId);
  res.json({ collections });
});

app.get('/api/collections/:site/:slug', (req, res) => {
  const { site, slug } = req.params;
  const meta = stateManager.loadCollectionMetadata(site, slug);
  if (!meta) {
    return res.status(404).json({ error: 'Không tìm thấy dữ liệu collection này.' });
  }
  res.json(meta);
});

app.post('/api/crawl/start', async (req, res) => {
  try {
    if (activeCrawler && (activeCrawler.status === 'running' || activeCrawler.status === 'paused')) {
      return res.status(400).json({ error: 'Đang có phiên crawl chạy. Vui lòng dừng trước khi bắt đầu mới.' });
    }

    const { siteId = 'svgrepo', options = {} } = req.body || {};
    activeCrawler = getCrawlers().createCrawler(siteId, stateManager, options);

    activeCrawler.on('log', (entry) => pushLog(entry));
    activeCrawler.on('progress', (prog) => {
      broadcastEvent('progress', {
        progress: prog,
        sites: getCrawlers().getAvailableSites(stateManager),
      });
    });
    activeCrawler.on('collection_updated', (col) => {
      broadcastEvent('collection_updated', col);
    });
    activeCrawler.on('icon_downloaded', (item) => {
      broadcastEvent('icon_downloaded', item);
    });

    activeCrawler.start(options).catch((err) => {
      pushLog({
        timestamp: new Date().toISOString(),
        siteId,
        level: 'error',
        message: `Lỗi không xác định: ${err.message}`,
      });
    });

    res.json({
      ok: true,
      status: activeCrawler.status,
      progress: activeCrawler.currentProgress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/crawl/pause', (req, res) => {
  if (!activeCrawler || activeCrawler.status !== 'running') {
    return res.status(400).json({ error: 'Không có phiên crawl nào đang chạy để tạm dừng.' });
  }
  activeCrawler.pause();
  res.json({ ok: true, status: activeCrawler.status });
});

app.post('/api/crawl/resume', (req, res) => {
  if (!activeCrawler || activeCrawler.status !== 'paused') {
    return res.status(400).json({ error: 'Không có phiên crawl nào đang tạm dừng.' });
  }
  activeCrawler.resume();
  res.json({ ok: true, status: activeCrawler.status });
});

app.post('/api/crawl/stop', async (req, res) => {
  if (!activeCrawler) {
    return res.json({ ok: true, status: 'idle' });
  }
  await activeCrawler.stop();
  res.json({ ok: true, status: activeCrawler.status });
});

app.post('/api/state/reset', (req, res) => {
  const { siteId = 'svgrepo' } = req.body || {};
  const reset = stateManager.resetSiteState(siteId);
  pushLog({
    timestamp: new Date().toISOString(),
    siteId,
    level: 'warn',
    message: `🔄 Đã đặt lại trạng thái checkpoint cho trang "${siteId}" về trang 1.`,
  });
  broadcastEvent('sites_updated', getCrawlers().getAvailableSites(stateManager));
  res.json({ ok: true, state: reset });
});

function startServer(port) {
  const srv = app.listen(port, () => {
    console.log(`🤖 [Crawler Studio] Đang chạy tại: http://localhost:${port}`);
  });
  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(port) + 1;
      console.warn(`⚠️ Port ${port} đang được sử dụng, tự động chuyển sang port ${nextPort}...`);
      startServer(nextPort);
    } else {
      throw err;
    }
  });
}

startServer(Number(PORT));
