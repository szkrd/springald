const { globalShortcut } = require('electron')
const getConfig = require('../interim/getConfig')
const sendMessage = require('./modules/messages/sendMessage')

let initialized = false

// electron may crash on mac if the unregister all is called
// on app exit, so _maybe_ we won't really need this
function free() {
  globalShortcut.unregisterAll()
}
const globalShortcuts = { free }

async function initGlobalShortcuts() {
  if (initialized) return globalShortcuts
  const config = await getConfig()
  const key = config.toggleKey
  const success = globalShortcut.register(key, () => {
    sendMessage('MSG_TOGGLE_WINDOW')
  })
  if (!success) {
    console.error(`Global hotkey "${key}" registration failed.`)
  }
  return globalShortcuts
}

module.exports = initGlobalShortcuts
