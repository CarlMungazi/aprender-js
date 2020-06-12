const h = require('./createVirtualElement');
const render = require('./render');
const mount = require('./mount');
const diff = require('./diff');
const patch = require('./patch');

module.exports = {
  h,
  render,
  mount,
  diff,
  patch
};