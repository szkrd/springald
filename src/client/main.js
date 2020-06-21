;(function () {
  const { sendMessage } = window.app.runtime
  const { dom } = window.app.utils
  const { $ } = dom

  function onDomReady() {
    const { config } = window.app
    const rt = window.app.runtime
    $('body').className = `theme-${config.theme}`
    $('body').innerHTML = rt.renderPage()
    rt.setWindowSize()

    // add a helper class to the body, so that we can move the focus
    // indicator line below the focused input with css animation
    dom.inputFocusClassToBody('#search')
    dom.inputFocusClassToBody('#app')

    // disable jumping to start / end of input.value
    dom.disableKeyDownForElement('#search', ['ArrowUp', 'ArrowDown'])
    dom.disableKeyDownForElement('#app', ['ArrowUp', 'ArrowDown'])

    $('#search').focus()
  }

  function main() {
    window.app.config = sendMessage('MSG_GET_CONFIG')
    $('document').on('DOMContentLoaded', onDomReady)
  }

  main()
})()
