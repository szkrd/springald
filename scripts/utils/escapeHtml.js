const escapeRex = require('./escapeRex');
const consts = require('../consts');

// escape html, but allow underlines
function escapeHtml (unsafe) {
  const prefix = consts.U_PREFIX;
  const postfix = consts.U_POSTFIX;
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(new RegExp(escapeRex(prefix), 'g'), '<u>')
    .replace(new RegExp(escapeRex(postfix), 'g'), '</u>');
}

module.exports = escapeHtml;
