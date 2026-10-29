const path = require('path');
const { StateManager, R2Client, OUTPUT_DIR, parseSvgMetadata } = require('@svg-hub/shared');

const CATALOG_SCHEMA_VERSION = 'v6-svg-ns-href-fix-20261029';

// Global singletons to preserve in-memory catalog cache across Next.js hot reloads & serverless warm invocations
const globalForCatalog = globalThis;

function getStateManager() {
  if (
    !globalForCatalog.__svgcraftStateManager ||
    globalForCatalog.__svgcraftSchemaVersion !== CATALOG_SCHEMA_VERSION
  ) {
    // Clear Node require cache for @svg-hub/shared in dev mode so taxonomy/stateManager updates take effect immediately
    try {
      const sharedTaxonomyPath = path.resolve(process.cwd(), '../../packages/shared/src/taxonomy.js');
      const sharedStatePath = path.resolve(process.cwd(), '../../packages/shared/src/stateManager.js');
      delete require.cache[sharedTaxonomyPath];
      delete require.cache[sharedStatePath];
      const freshShared = require(sharedStatePath);
      globalForCatalog.__svgcraftStateManager = new freshShared.StateManager();
    } catch {
      globalForCatalog.__svgcraftStateManager = new StateManager();
    }
    globalForCatalog.__svgcraftSchemaVersion = CATALOG_SCHEMA_VERSION;
  }
  return globalForCatalog.__svgcraftStateManager;
}

function getR2Client() {
  if (!globalForCatalog.__svgcraftR2Client) {
    globalForCatalog.__svgcraftR2Client = new R2Client();
  }
  return globalForCatalog.__svgcraftR2Client;
}

module.exports = {
  getStateManager,
  getR2Client,
  OUTPUT_DIR,
  parseSvgMetadata,
};
