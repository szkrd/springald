const { globalShortcut } = require('electron')
const log = require('../interim/log')
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
  let keys = config.toggleKey
  if (typeof keys === 'string') {
    keys = [keys]
  }
  keys.forEach((key) => {
    const toggleAction = () => {
      sendMessage('MSG_TOGGLE_WINDOW')
    }
    const success = globalShortcut.register(key, toggleAction)
    if (!success) {
      log.error(`Global hotkey "${key}" registration failed.`)
    }
  })

  return globalShortcuts
}

module.exports = initGlobalShortcuts
