const taxonomy = require('./taxonomy');
const stateManager = require('./stateManager');
const r2Client = require('./r2Client');
const lordicon = require('./lordicon');

module.exports = {
  ...taxonomy,
  ...stateManager,
  ...r2Client,
  ...lordicon,
};
