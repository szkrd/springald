;(function () {
  function escapeRegExp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  }

  // escape html, but allow underlines
  function escapeHtml(unsafe) {
    const consts = window.app.constants
    const prefix = consts.U_PREFIX
    const postfix = consts.U_POSTFIX
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(new RegExp(escapeRegExp(prefix), 'g'), '<u>')
      .replace(new RegExp(escapeRegExp(postfix), 'g'), '</u>')
  }

  window.app.utils.string = {
    escapeRegExp,
    escapeHtml,
  }
})()
