;(function () {
  const { sendMessage, renderPage } = window.app.runtime

  function onDomReady() {
    const config = sendMessage('MSG_GET_CONFIG')
    document.body.className = `theme-${config.theme}`
    document.body.innerHTML = renderPage()
    console.log('ready')
  }

  function main() {
    document.addEventListener('DOMContentLoaded', onDomReady)
  }

  main()
})()
