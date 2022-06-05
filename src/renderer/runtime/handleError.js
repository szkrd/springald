;(function () {
  const { $ } = window.app.utils.dom
  const { sendMessage, log } = app.interim

  function handleError() {
    sendMessage('MSG_TOGGLE_DEV_TOOLS')
    log.error(...arguments)
    const el = $('#error-line')
    el.style.opacity = 1
    setTimeout(() => {
      el.style.opacity = 0
    }, 1000)
  }

  window.app.runtime.handleError = handleError
})()
