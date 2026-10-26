const { StateManager, R2Client, OUTPUT_DIR, parseSvgMetadata } = require('@svg-hub/shared');

// Global singletons to preserve in-memory catalog cache across Next.js hot reloads & serverless warm invocations
const globalForCatalog = globalThis;

function getStateManager() {
  if (!globalForCatalog.__svgcraftStateManager) {
    globalForCatalog.__svgcraftStateManager = new StateManager();
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
