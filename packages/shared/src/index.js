const taxonomy = require('./taxonomy');
const stateManager = require('./stateManager');
const r2Client = require('./r2Client');

module.exports = {
  ...taxonomy,
  ...stateManager,
  ...r2Client,
};
