// TODO win32 not supported
import context from './context'
import getConfig from './getConfig'
const os = require('os')
const superchild = require('superchild')

// TODO support for withApp parameter
// see for example: https://github.com/sindresorhus/opn
// TODO return false on error
function openItem(item, withApp) {
  const config = getConfig()
  const gui = context.gui
  const isWin = /^win/.test(os.platform())
  const defaultParamsForProcesses = { cwd: os.homedir() }

  // WIP: on windows we just launch the command, sorry
  if (isWin) {
    gui.Shell.openItem(item.command)
    return true
  }

  // shortcut for open with default file manager
  if (withApp === config.appShortcuts.showItemInFolder) {
    gui.Shell.showItemInFolder(item.command)
    return true
  }

  // open in terminal (preferred terminal emulator can be set in config.terminalCommand)
  if (withApp === config.appShortcuts.launchInTerminal) {
    const command = config.terminalCommand.replace(/%CMD%/, item.command)
    superchild(command, defaultParamsForProcesses)
    return true
  }

  // desktops, pathexecs or fluxbox commands (the latter is kinda weird I guess)
  // this of course can create interesting scenarios (like opening a fluxbox
  // command with a mediaplayer, but let's assume the user knows what he or she does)
  if (typeof withApp === 'object' && withApp !== null && withApp.command) {
    superchild(`${withApp.command} "${item.command}"`)
    return true
  }

  // xdg open will not launch shellscripts for instance
  if (item.executable) {
    superchild(item.command, defaultParamsForProcesses)
    return true
  } else {
    gui.Shell.openItem(item.command)
    return true
  }
}

export default openItem
