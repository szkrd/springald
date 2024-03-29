const os = require('os')
const spawn = require('child_process').spawn
const path = require('path')
const { shell } = require('electron')

// windows executables may be coming from paths with spaces
function quote(s) {
  return /\s/.test(s) ? `"${s}"` : s
}

function spawnProcess(commandLine, options = {}) {
  if (!commandLine) return
  const spawnOpt = Object.assign(
    {
      shell: true,
      cwd: os.homedir(),
      detached: true,
    },
    options
  )
  log.info('Spawning: ' + commandLine)
  return spawn(commandLine, spawnOpt)
}

function openWithApp(item, withApp, config) {
  const withAppIsObj = typeof withApp === 'object' && withApp !== null

  // shortcut for open with default file manager
  if (withApp === config.appShortcuts.showItemInFolder) {
    log.info('Shell command (show in folder): ' + item.command)
    return shell.showItemInFolder(item.command) // this is NOT a Promise
  }

  // open in terminal (preferred terminal emulator can be set in config.terminalCommand)
  if (withApp === config.appShortcuts.launchInTerminal) {
    const command = config.terminalCommand.replace(/%CMD%/, item.command)
    return spawnProcess(command)
  }

  // hackish way to allow a command to be launched with a filename param,
  // and not the full path+filename combo (honestly, only gtk-launch was this shitty so far,
  // and if I implemented a simple .desktop parser, then I wouldn't really need it...
  // Arch AUR has "dex" (not the editor) which is a .desktop launcher, but that's buggy too)
  const paramOverride = (config.openWithParams || {})[withAppIsObj ? withApp.name : withApp] // for example '-a -b -x -y %NAME%'
  let param = item.command // default is the proper command (which is: path + name = command)
  if (paramOverride) {
    param = paramOverride
    Object.keys(item).forEach((key) => {
      param = param.replaceAll(`%${key.toUpperCase()}%`, quote(item[key])) // replace %FOO% with `item.foo`
    })
  }

  // this is the simple scenario, where the user defined the app name in the config json
  // TODO: would it be useful to have an array of executables?
  // OR define a custom list of executables, like { node: '/usr/bin/node', chrome: '...' }
  if (typeof withApp === 'string' && withApp) {
    return spawnProcess(`${quote(withApp)} ${param}`)
  }

  // desktops, pathexecs or fluxbox commands (the latter is kinda weird I guess)
  // this of course can create interesting scenarios (like opening a fluxbox
  // command with a mediaplayer, but let's assume the user knows what he or she does)
  if (withAppIsObj && withApp.command) {
    return spawnProcess(`${quote(withApp.command)} ${param}`)
  }

  // xdg open will not launch shellscripts for instance
  if (item.executable) {
    return spawnProcess(item.command)
  } else {
    log.info('Shell command (open path): ' + item.command)
    return shell.openPath(item.command) // this is a Promise
  }
}

module.exports = openWithApp
