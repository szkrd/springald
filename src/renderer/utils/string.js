const { U_PREFIX, U_POSTFIX } = require('../constants');

function escapeRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

// escape html, but allow underlines
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(new RegExp(escapeRegExp(U_PREFIX), 'g'), '<u>')
    .replace(new RegExp(escapeRegExp(U_POSTFIX), 'g'), '</u>');
}

module.exports = {
  escapeRegExp,
  escapeHtml,
};
