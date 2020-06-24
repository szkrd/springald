;(function () {
  function setWindowSize() {
    const { MAX_VISIBLE_ITEM_COUNT, FALLBACK_WIN_WIDTH } = window.app.constants
    const { config } = window.app
    const { $ } = window.app.utils.dom
    const { sendMessage } = window.app.runtime
    const foundItems = window.app.store.found || []
    const foundItemCount = foundItems.length

    const style = window.getComputedStyle($('#current'), null)
    const itemHeight = parseInt(style.height.replace(/px/, ''), 10)
    const itemMax = Math.min(foundItemCount, MAX_VISIBLE_ITEM_COUNT)
    let height = itemHeight + itemHeight * itemMax
    height += foundItemCount ? itemHeight : 0
    const width = config.winWidth || FALLBACK_WIN_WIDTH
    const payload = { width, height }
    sendMessage('MSG_RESIZE_WINDOW', payload)
  }

  window.app.runtime.setWindowSize = setWindowSize
})()
