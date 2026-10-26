const express = require('express');
const path = require('path');
const { StateManager, OUTPUT_DIR, R2Client, parseSvgMetadata } = require('@svg-hub/shared');

const app = express();
const PORT = process.env.WEB_PORT || process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.static(path.join(__dirname, '../public'), {
    maxAge: '1h',
  })
);
app.use(
  '/output',
  express.static(OUTPUT_DIR, {
    maxAge: '365d',
    immutable: true,
  })
);

const stateManager = new StateManager();
const r2Client = new R2Client();

// Fallback route for /output/:site/:collection/icons/:fileName when served from Cloudflare R2 (e.g. on Vercel)
app.get('/output/:site/:collection/icons/:fileName', async (req, res) => {
  try {
    const { site, collection, fileName } = req.params;
    const objectKey = `${site}/${collection}/icons/${fileName}`;

    if (r2Client.publicUrl) {
      res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, immutable');
      return res.redirect(302, `${r2Client.publicUrl}/${objectKey}`);
    }

    const svgContent = await r2Client.getSvgObject(objectKey);
    if (!svgContent) {
      return res.status(404).send('SVG not found on R2');
    }

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, immutable');
    return res.send(svgContent);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Read-only Cloudflare R2 Free Tier Quota Guard status (never exposes keys/secrets)
app.get('/api/r2/quota', (req, res) => {
  res.json(r2Client.getQuotaSummary());
});

// Get catalog summary (categories, styles, types, collections, counts)
app.get('/api/catalog/summary', (req, res) => {
  try {
    const summary = stateManager.getCatalogSummary();
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Query icons with multi-dimensional filters
app.get('/api/catalog/icons', (req, res) => {
  try {
    const result = stateManager.queryIcons({
      q: req.query.q || '',
      category: req.query.category || '',
      styleType: req.query.styleType || '',
      iconType: req.query.iconType || '',
      site: req.query.site || '',
      collection: req.query.collection || '',
      gridSize: req.query.gridSize || '',
      letter: req.query.letter || '',
      sort: req.query.sort || 'recent',
      offset: Number(req.query.offset) || 0,
      limit: Number(req.query.limit) || 120,
    });
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single collection metadata + paginated/searchable icons within the collection
app.get('/api/catalog/collection/:site/:collection', (req, res) => {
  try {
    const { site, collection } = req.params;
    const data = stateManager.getCollectionDetails(site, collection, {
      q: req.query.q || '',
      styleType: req.query.styleType || '',
      category: req.query.category || '',
      sort: req.query.sort || 'az',
      offset: Number(req.query.offset) || 0,
      limit: Number(req.query.limit) || 120,
    });
    if (!data) {
      return res.status(404).json({ error: 'Không tìm thấy bộ sưu tập.' });
    }
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single icon details + raw SVG XML + similar/related recommendations
app.get('/api/catalog/icon/:site/:collection/:idOrSlug', async (req, res) => {
  try {
    const { site, collection, idOrSlug } = req.params;
    const data = stateManager.getIconWithRecommendations(site, collection, idOrSlug);
    if (!data) {
      return res.status(404).json({ error: 'Không tìm thấy icon.' });
    }

    // If running on Vercel (without local output/ disk files), fetch SVG XML from R2 on demand
    if (!data.rawSvg && data.icon) {
      const variants = data.icon.variants || { default: data.icon.relativePath };
      for (const [varName, relPath] of Object.entries(variants)) {
        const key = `${site}/${collection}/${relPath}`;
        const fetched = await r2Client.getSvgObject(key).catch(() => null);
        if (fetched && fetched.includes('<svg')) {
          data.svgVariantsContent[varName] = fetched;
        }
      }
      data.rawSvg = data.svgVariantsContent.default || Object.values(data.svgVariantsContent)[0] || '';
      if (data.rawSvg) {
        const parsedMeta = parseSvgMetadata(data.rawSvg);
        data.icon.width = data.icon.width || parsedMeta.width;
        data.icon.height = data.icon.height || parsedMeta.height;
        data.icon.viewBox = data.icon.viewBox || parsedMeta.viewBox || '0 0 24 24';
        data.icon.gridSize = data.icon.gridSize || parsedMeta.gridSize || '24x24';
        data.icon.fileSizeBytes = data.icon.fileSizeBytes || parsedMeta.fileSizeBytes;
        if (!data.icon.colorPalette || data.icon.colorPalette.length === 0) {
          data.icon.colorPalette = parsedMeta.colorPalette || [];
        }
      }
    }

    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA routes for direct navigation & page reload on icon detail and collection pages
app.get(
  [
    '/icon/:site/:collection/:idOrSlug',
    '/icon/:slug',
    '/collection/:site/:collection',
    '/collection/:collection',
  ],
  (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
);

// Catch-all SPA fallback for any non-API / non-asset GET route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/output/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SVGCraft Web Portal] Đang chạy tại: http://localhost:${PORT}`);
  });
}

module.exports = app;
