const os = require('os')
const spawn = require('child_process').spawn
const { shell } = require('electron')

function spawnProcess(commandLine, options = {}) {
  return new Promise((resolve, reject) => {
    if (!commandLine) return
    const spawnOpt = Object.assign(
      {
        shell: true,
        cwd: os.homedir(),
        detached: true,
      },
      options
    )
    let ret
    try {
      ret = spawn(commandLine, spawnOpt)
    } catch (err) {
      reject(err)
    }
    resolve(ret)
  })
}

// TODO support for withApp parameter
// see for example: https://github.com/sindresorhus/opn
function openWithApp(item, withApp, config) {
  // shortcut for open with default file manager
  if (withApp === config.appShortcuts.showItemInFolder) {
    return shell.showItemInFolder(item.command)
  }

  // open in terminal (preferred terminal emulator can be set in config.terminalCommand)
  if (withApp === config.appShortcuts.launchInTerminal) {
    const command = config.terminalCommand.replace(/%CMD%/, item.command)
    return spawnProcess(command)
  }

  // desktops, pathexecs or fluxbox commands (the latter is kinda weird I guess)
  // this of course can create interesting scenarios (like opening a fluxbox
  // command with a mediaplayer, but let's assume the user knows what he or she does)
  if (typeof withApp === 'object' && withApp !== null && withApp.command) {
    return spawnProcess(`${withApp.command} "${item.command}"`)
  }

  // xdg open will not launch shellscripts for instance
  if (item.executable) {
    return spawnProcess(item.command)
  } else {
    return shell.openPath(item.command)
  }
}

module.exports = openWithApp
