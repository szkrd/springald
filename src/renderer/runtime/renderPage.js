;(function () {
  const { MAX_RESULT_ITEMS } = window.app.constants

  function resultItems() {
    let ret = ''
    for (let i = 0; i < MAX_RESULT_ITEMS; i++) {
      ret += `<div class="result type-UNSET" id="result-${i}" style="display:none">${i}</div>`
    }
    return ret
  }

  // TODO restore override css support? maybe not, in the end I never used it
  //   see also: `<style type="text/css">${overrideCss()}</style>`
  function renderPage() {
    return `
    <div id="error-line"></div>
    <div class="loader"></div>
    <input type="text" class="search" id="search" autocomplete="off"/>
    <input type="text" class="app" id="app" autocomplete="off" />
    <span class="ghost" id="ghost"></span>
    <div class="input-focus-indicator"></div>
    <div class="current" id="current"></div>
    <div class="results">${resultItems()}</div>
  `
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
  }

  window.app.runtime.renderPage = renderPage
})()
