;(function () {
  const { $ } = window.app.utils.dom

  function handleError() {
    app.interim.sendMessage('MSG_TOGGLE_DEV_TOOLS')
    console.error(...arguments)
    const el = $('#error-line')
    el.style.opacity = 1
    setTimeout(() => {
      el.style.opacity = 0
    }, 1000)
  }

  window.app.runtime.handleError = handleError
})()
