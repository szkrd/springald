;(function () {
  function escapeRegExp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  }

  window.app.utils.string = {
    escapeRegExp,
  }
})()
