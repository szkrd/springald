;(function () {
  const int = window.app.interim
  const { sendMessage } = int
  const { dom } = window.app.utils
  const str = window.app.utils.string
  const { $, $$ } = dom
  const { store } = window.app
  const rt = window.app.runtime
  const config = (window.app.config = sendMessage('MSG_GET_CONFIG'))

  function initStore() {
    Object.assign(store, {
      visible: true,
      current: 0,
      ghost: null,
      searchItems: [],
      found: [],
    })
  }

  function resetInputFields() {
    onSearchChange('')
    onAppChange('')
    $('#search').value = $('app').value = store.withApp = $('ghost').innerHTML = ''
    $('#search').focus()
  }

  function launch() {
    if (!store.found.length) {
      return false
    }
    const item = store.found[store.current]
    if (!item) {
      return false
    }
    int.openWithApp(item, store.ghost || store.withApp, config).catch(rt.handleError)
    // reset manually changed app only (pure ghosts can stay, those were programmatic)
    if ($('#app').value) {
      $('#app').value = store.withApp = $('#ghost').innerHTML = ''
      store.ghost = null
    }
    return true
  }

  function onDocumentKey(e) {
    if (e.key === 'Enter') {
      if (launch()) sendMessage('MSG_TOGGLE_WINDOW')
    }
    if (e.key === 'F12') {
      sendMessage('MSG_TOGGLE_DEV_TOOLS')
    }
    if (e.key === 'F5') {
      rt.setAppLoading(true)
      parseAll().finally(() => rt.setAppLoading(false))
    }
    if (e.key === 'c' && e.altKey) {
      sendMessage('MSG_CENTER_WINDOW')
    }
    if (e.key === 'c' && e.ctrlKey) {
      resetInputFields()
    }
    if (e.key === 'Escape') {
      sendMessage('MSG_TOGGLE_WINDOW')
    }
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
      e.stopPropagation()
      if (e.key === 'ArrowUp') {
        store.current = (store.current - 1) % store.found.length
      } else if (e.key === 'ArrowDown') {
        store.current = (store.current + 1) % store.found.length
      } else if (e.key === 'PageUp') {
        store.current = Math.max(store.current - MAX_VISIBLE_ITEM_COUNT, 0)
      } else if (e.key === 'PageDown') {
        store.current = Math.min(store.current + MAX_VISIBLE_ITEM_COUNT, store.found.length - 1)
      }
      rt.highlightSelectedResult()
      setCurrentAndApp()
    }
  }

  function setCurrentAndApp() {
    if (!store.found.length || !store.found[store.current]) {
      return
    }
    const found = store.found[store.current]
    $('#current').textContent = found.command
    // if you haven't modified the app field, then "prefill" it with ghost text
    // (searchableText is the pretty text, like "d:~/foo/bar/baz.txt")
    if (!$('#app').value && Object.keys(config.openWith || {}).length > 0) {
      const appGhostText = rt.getPreferredOpenWith(found.searchableText)
      onAppChange(appGhostText)
    }
  }

  function onAppChange(e) {
    const val = (typeof e === 'string' ? e : e.target.value || '').trim()
    const longEnoughToTrigger = val.length > 1
    let matchingApp
    store.withApp = val
    if (longEnoughToTrigger) {
      const desktopItems = store.searchItems.filter((item) => item.desktop)
      // if we can't find it in the desktop friendly list, then try harder
      matchingApp =
        desktopItems.find((item) => item.name.startsWith(val)) ||
        store.searchItems.find((item) => item.name.startsWith(val) && item.executable)
    }
    $('#ghost').innerHTML = matchingApp ? str.escapeHtml(matchingApp.name) : ''
    store.ghost = matchingApp || null
  }

  function onSearchChange(e) {
    const val = (typeof e === 'string' ? e : e.target.value || '').trim()
    const words = val ? val.split(config.logicalAndSeparator) : []
    store.found = rt.filterSearchItems(store.searchItems, words)
    store.current = 0
    setCurrentAndApp()
    rt.renderResults(words)
    rt.highlightSelectedResult()
    rt.setWindowSize()
  }

  function onDomReady() {
    initStore()
    rt.setAppLoading(true)
    int
      .parseAll()
      .then((result) => {
        rt.setAppLoading(false)
        store.searchItems = result
      })
      .catch(rt.handleError)

    $('body').classList.add(`theme-${config.theme}`)
    $('body').innerHTML = rt.renderPage()

    // add a helper class to the body, so that we can move the focus
    // indicator line below the focused input with css animation
    dom.inputFocusClassToBody('#search')
    dom.inputFocusClassToBody('#app')

    // disable jumping to start / end of input.value
    dom.disableKeyDownForElement('#search', ['ArrowUp', 'ArrowDown'])
    dom.disableKeyDownForElement('#app', ['ArrowUp', 'ArrowDown'])

    $('#search').focus()
    $('document').on('keyup', onDocumentKey)
    $('#search').on('input', onSearchChange)
    $('#app').on('input', onAppChange)
  }

  function main() {
    $(onDomReady)
  }

  // ---

  main()
})()
