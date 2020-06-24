;(function () {
  const int = window.app.interim
  const { sendMessage } = int
  const { dom } = window.app.utils
  const { $ } = dom
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
    $('#ghost').innerHTML = matchingApp ? escapeHtml(matchingApp.name) : ''
    store.ghost = matchingApp || null
  }

  function onSearchChange(e) {
    const val = (typeof e === 'string' ? e : e.target.value || '').trim()
    const words = val ? val.split(config.logicalAndSeparator) : []
    store.found = rt.filterSearchItems(store.searchItems, words)
    console.log(store.found)
    store.current = 0
    setCurrentAndApp()
    // setResults(needles)
    // markCurrentResult()
    // setWindowSize()
  }

  function onDomReady() {
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
    $('#search').on('input', onSearchChange)
    $('#app').on('input', onAppChange)
  }

  function main() {
    initStore()
    $(onDomReady)
  }

  // ---

  main()
})()
