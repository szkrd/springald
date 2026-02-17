const sendMessage = require('../../interim/sendMessage');
const constants = require('../constants');
const sharedConfig = require('../shared/sharedConfig');
const sharedStore = require('../shared/sharedStore');
const { dom } = require('../utils/utils');

/**
 * Sends a `MSG_RESIZE_WINDOW` message to the backend
 * with the width and height (based on the list of found items).
 */
function setWindowSize() {
  const { MAX_VISIBLE_ITEM_COUNT, FALLBACK_WIN_WIDTH } = constants;
  const { $ } = dom;
  const foundItems = sharedStore.found || [];
  const foundItemCount = foundItems.length;

  const style = window.getComputedStyle($('#current'), null);
  const itemHeight = parseInt(style.height.replace(/px/, ''), 10);
  const itemMax = Math.min(foundItemCount, MAX_VISIBLE_ITEM_COUNT);
  let height = itemHeight + itemHeight * itemMax;
  height += foundItemCount ? itemHeight : 0;
  const width = sharedConfig.winWidth || FALLBACK_WIN_WIDTH;
  sendMessage('MSG_RESIZE_WINDOW', { width, height });
}

module.exports = setWindowSize;
