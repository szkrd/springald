const { $ } = require('../utils/dom');
const { sendMessage, log } = require('../../interim/interim');

function handleError() {
  sendMessage('MSG_TOGGLE_DEV_TOOLS');
  log.error(...arguments);
  const el = $('#error-line');
  el.style.opacity = 1;
  setTimeout(() => {
    el.style.opacity = 0;
  }, 1000);
}

module.exports = handleError;
