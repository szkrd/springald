const path = require('path')
const fs = require('fs')
const fsReaddir = require('fs').promises.readdir
const log = require('./log')
const isExec = require('./isExecutable')

// skips C:\WINDOWS\* which is not a "healthy thing" to parse
// (lots of files, special permissions etc.)
const IGNORE_WIN_ROOT = true

let counter = 0

// linux only: get global .desktop files, strip the "extensions"
// and return only the basename part (no path either)
async function getDesktopFriendlies() {
  const config = window.app.config
  const location = config.desktopFilesLocation
  let files = []
  try {
    files = await fsReaddir(location)
  } catch (err) {
    files = []
  }
  const onlyDesktopExtensions = (fn) => /\.desktop$/.test(fn)
  const baseNameOnly = (fn) => fn.replace(/\.desktop$/, '')
  return files.filter(onlyDesktopExtensions).map(baseNameOnly)
}

// node injects the project's local bin directory to the path
function isLocalNodeBin(s) {
  return /springald[/\\]node_modules/.test(s)
}

function readDir(location) {
  return new Promise((resolve, reject) => {
    const results = []
    fs.readdir(location, (err, files) => {
      // not a show stopper, but still annoying
      if (err) {
        log.error(`☠️ Could not read location "$\{location}", skipping.`)
        resolve([])
        return
      }

      const itemCount = files.length
      let processCount = 0
      if (!files.length) {
        resolve([])
      }
      files.forEach((file) => {
        file = path.resolve(location, file)
        fs.stat(file, (err, stats) => {
          // on windows uwp reparse points (zero byte executables that
          // setup a security context) are unreadable (https://stackoverflow.com/q/58296925)
          const unreadableError = file.endsWith('.exe') && String(err).startsWith('Error: UNKNOWN:')
          const isUwpApp = file.includes('\\WindowsApps\\')
          const noPermission = String(err).startsWith('Error: EPERM:')
          if (err && !unreadableError && !noPermission && !isUwpApp) {
            // on Ubuntu some packages may leave broken symlinks behind, so
            // getting a file not found error is not that uncommon
            // in that case go and delete that file yourself...
            // TODO this skips the whole dir, probably we _really_ should check if the file is a dead symlink
            log.error(`☠️ Could not stat path "${file}", skipping!`, err)
            resolve([])
            return
          }
          processCount++
          if (stats && stats.isFile()) {
            const parsed = path.parse(file)
            // on the path non executables are not interesting
            if (isExec(parsed.ext, stats.mode) && !isLocalNodeBin(file)) {
              results.push({
                id: `p${counter++}`,
                executable: true,
                type: 'PATHITEM',
                path: parsed.dir,
                name: parsed.base,
                desktop: false,
                command: file, // full path
              })
            }
          }
          if (processCount === itemCount) {
            resolve(results)
          }
        }) // end stat
      }) // end forEach
    }) // end readdir
  }) // end Promise
}

function parsePath() {
  const dl = path.delimiter
  const result = []
  const pathItems = process.env.PATH.split(dl)
  let dirs = [...new Set(pathItems)]
  // let's try to find path duplicates, BUT it's possible that we have duplicates on Windows
  // coming from the git installation and those can not be found (or fixed) in the system properties
  if (pathItems.length !== dirs.length) {
    const duplicates = [...new Set(pathItems.filter((item, index) => pathItems.indexOf(item) !== index))]
    log.warn(`You have duplicate items in your PATH! (${duplicates.join(', ')})`)
  }
  if (IGNORE_WIN_ROOT) {
    dirs = dirs
      .filter((dir) => !/^C:\\WINDOWS\\?$/.test(dir.toUpperCase()))
      .filter((dir) => !/^C:\\WINDOWS\\.*/.test(dir.toUpperCase()))
  }
  dirs = dirs.filter((dir) => fs.existsSync(dir))
  const all = [getDesktopFriendlies(), ...dirs.map((dir) => readDir(dir))]
  return Promise.all(all).then(
    (packs) => {
      // first item is an array of desktop files, let's remove that
      // (in this list `/usr/share/applications/foobar.desktop` is just `foobar`)
      const desktops = packs.shift()

      // then rest are individual executables found in path dirs
      packs.forEach((pack) => result.push.apply(result, pack))

      // if an executable file name has a ".desktop" version then it
      // has a desktop file, so we would like to add it to the "with app"
      // list of openers (since it's meant to be used on the gui for sure)
      //
      // (that was the original scope, but I'm beginning to miss shortcuts
      // that are available in gnome's default search, but not in springald's)
      //
      // (unfortunately .desktop "shortcuts" can have different contents
      // and this method will not deal with those, for example
      // `gnome-keyboard-panel.desktop` launches `gnome-control-center keyboard`
      // which is an executable AND a parameter)
      if (desktops.length) {
        result.forEach((fn) => {
          const idxInDesktopsArray = desktops.indexOf(fn.name)
          if (idxInDesktopsArray > -1) {
            fn.desktop = true
            desktops[idxInDesktopsArray] = null
          }
        })
      }
      return Promise.resolve(result)
    },
    (err) => {
      err.module = 'parsePath'
      return Promise.reject(err)
    }
  )
}

module.exports = parsePath
