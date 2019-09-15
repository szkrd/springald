let superchild
try {
  // win32 not supported
  superchild = require('superchild')
} catch (err) {
  superchild = require('./utils/superchildFallback')
}
const os = require('os')
const context = require('./context')
const getConfig = require('./getConfig')

// TODO support for withApp parameter
// see for example: https://github.com/sindresorhus/opn
// TODO return false on error
function openItem(item, withApp) {
  const config = getConfig()
  const gui = context.gui
  const isWin = /^win/.test(os.platform())

  // WIP
  if (isWin) {
    gui.Shell.openItem(item.command)
    return true
  }

  if (withApp === config.appShortcuts.showItemInFolder) {
    gui.Shell.showItemInFolder(item.command)
    return true
  }

  // desktops, pathexecs or fluxbox commands (the latter is kinda weird I guess)
  // this of course can create interesting scenarios (like opening a fluxbox
  // command with a mediaplayer, but let's assume the user knows what he or she does)
  if (typeof withApp === 'object' && withApp !== null && withApp.command) {
    // TODO fix win32
    superchild(`${withApp.command} "${item.command}"`)
    return true
  }

  // xdg open will not launch shellscripts for instance
  if (item.executable) {
    superchild(item.command, { cwd: os.homedir() })
    return true
  } else {
    gui.Shell.openItem(item.command)
    return true
  }
}

module.exports = openItem
