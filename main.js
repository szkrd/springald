/* global nw:false */
const gui = require('nw.gui')
const win = gui.Window.get()
const renderTemplate = require('./scripts/gui/renderTemplate')
const parseAll = require('./scripts/parsing/parseAll')
const setResults = require('./scripts/gui/setResults')
const escapeHtml = require('./scripts/utils/escapeHtml')
const inputFocusClassToBody = require('./scripts/utils/inputFocusClassToBody')
const disableKeyDownForElement = require('./scripts/utils/disableKeyDownForElement')
const getConfig = require('./scripts/getConfig')
const filterSearchItems = require('./scripts/filterSearchItems')
const openItem = require('./scripts/openItem')
const store = require('./scripts/store')
const context = require('./scripts/context')
const log = require('./scripts/utils/log')
const tray = require('./scripts/modules/tray')
const socket = require('./scripts/modules/socket')

const MAX_VISIBLE_ITEM_COUNT = 6
let unixServer = null
let config = null
let globalToggleShortcut = null
const $ = (id) => document.getElementById(id)
context.window = window
context.document = document
context.gui = gui
context.app = nw.App
context.dataPath = nw.App.dataPath.replace(/[/\\]Default[/\\]?$/, '')

function hide() {
  win.hide()
  store.visible = false
}

function show() {
  if (config.centerOnShow) {
    win.setPosition('center')
  }
  win.show()
  win.restore() // this is kinda erratic with gnome desktop
  store.visible = true
  $('search').select()
}

function toggle() {
  if (store.visible) {
    hide()
  } else {
    show()
  }
}

function setCurrent() {
  if (!store.found.length || !store.found[store.current]) {
    return
  }
  $('current').textContent = store.found[store.current].command
  $('app').value = 'code'
}

function markCurrentResult() {
  const all = document.querySelectorAll('.result')
  if (store.current < 0) {
    store.current = 0
  }
  if (store.current > all.length - 1) {
    store.current = all.length - 1
  }
  const el = $(`result-${store.current}`)
  if (el) {
    all.forEach((current) => {
      current.classList.remove('selected')
    })
    el.classList.add('selected')
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

// resizable must be true in pcakge.json for gnome, otherwise
// the window manager will ignore resize requests
function setWindowSize() {
  const style = window.getComputedStyle($('current'), null)
  const itemHeight = parseInt(style.height.replace(/px/, ''), 10)
  const itemMax = Math.min(store.found.length, MAX_VISIBLE_ITEM_COUNT)
  let height = itemHeight + itemHeight * itemMax
  height += store.found.length ? itemHeight : 0
  win.resizeTo(config.winWidth || 600, height)
}

function onSearchChange(e) {
  const val = (e.target.value || '').trim()
  const needles = val ? val.split(config.logicalAndSeparator) : []
  store.found = filterSearchItems(store.searchItems, needles)
  store.current = 0
  setCurrent()
  setResults(needles)
  markCurrentResult()
  setWindowSize()
}

function onAppChange(e) {
  const val = (e.target.value || '').trim()
  let matchingApp
  store.withApp = val

  // do not trigger for one letter
  if (val.length > 1) {
    const desktopItems = store.searchItems.filter((item) => item.desktop)
    // if we can't find it in the desktop friendly list, then try harder
    matchingApp =
      desktopItems.find((item) => item.name.startsWith(val)) ||
      store.searchItems.find((item) => item.name.startsWith(val) && item.executable)
  }

  $('ghost').innerHTML = matchingApp ? escapeHtml(matchingApp.name) : ''
  store.ghost = matchingApp || null
}

function onDocumentKey(e) {
  if (e.key === 'Enter') {
    launch()
    hide()
  }
  if (e.key === config.refreshKey) {
    parseAll()
  }
  if (e.key === 'c' && e.ctrlKey) {
    win.setPosition('center')
  }
  if (e.key === 'Escape') {
    hide()
  }
  if (e.key === 'q' && e.ctrlKey) {
    win.close()
  }
  if (config.development && e.key === 'r' && e.ctrlKey) {
    reload()
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
    markCurrentResult()
    setCurrent()
  }
}

function onWinMinimize() {
  hide()
}

function onDomReady() {
  document.body.className = `theme-${config.theme}`
  document.body.innerHTML = renderTemplate()
  setWindowSize()

  // add a helper class to the body, so that we can move the focus
  // indicator line below the focused input with css animation
  inputFocusClassToBody('search')
  inputFocusClassToBody('app')

  // disable jumping to start / end of input.value
  disableKeyDownForElement('search', ['ArrowUp', 'ArrowDown'])
  disableKeyDownForElement('app', ['ArrowUp', 'ArrowDown'])

  $('search').focus()
  $('search').addEventListener('input', onSearchChange)
  $('app').addEventListener('input', onAppChange)
  parseAll()
}

function launch() {
  if (!store.found.length) {
    return false
  }
  const item = store.found[store.current]
  if (!item) {
    return false
  }
  openItem(item, store.ghost || store.withApp)
  $('app').value = store.withApp = $('ghost').innerHTML = ''
  store.ghost = null
  hide()
}

function setGlobalShortcut() {
  const option = {
    key: config.toggleKey,
    active: toggle,
    failed: (msg) => {
      console.error(`Failed to register hotkey "${config.toggleKey}"`)
    },
  }
  globalToggleShortcut = new nw.Shortcut(option)
  nw.App.registerGlobalHotKey(globalToggleShortcut)
}

function removeGlobalShortcut() {
  nw.App.unregisterGlobalHotKey(globalToggleShortcut)
  globalToggleShortcut = null
}

// tear down
function onWinClose() {
  const close = () => this.close(true)
  this.hide()
  if (unixServer) {
    unixServer.close(close)
  } else {
    close()
  }
}

function reload() {
  // tray and global shortcuts are "outside" the reloadable window
  tray.destroy()
  removeGlobalShortcut()
  // not sure if these are needed, but better be safe than leak memory
  win.removeListener('minimize', onWinMinimize)
  win.removeListener('close', onWinClose)
  document.removeEventListener('keyup', onDocumentKey)
  document.removeEventListener('DOMContentLoaded', onDomReady)
  document.body.className = ''
  document.body.innerHTML = ''
  // flush node's require cache
  for (const cacheItem in require.cache) {
    delete require.cache[cacheItem]
  }
  socket.destroy(() => {
    config = null
    unixServer = null
    win.reload() // finally kaboom
  })
}

function run() {
  config = getConfig()
  socket.create({ show, hide, toggle, reload, config, gui })
  tray.create({ toggle, gui })
  setGlobalShortcut()
  win.on('minimize', onWinMinimize)
  win.on('close', onWinClose)
  document.addEventListener('keyup', onDocumentKey)
  document.addEventListener('DOMContentLoaded', onDomReady)
  // we could disable the context menu for config.development
  // but the proper way is to have "chromium-args": "--disable-devtools"
  // in package.json (for a prod build, plus removing the copy-paste menu is not nice)
  hide()
  if (config.showOnStartup || config.development) {
    setTimeout(show, 0) // rendered size determines the screen position
  }
}

// ----

run()
