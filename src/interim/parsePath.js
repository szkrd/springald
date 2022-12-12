const path = require('path')
const os = require('os')
const fs = require('fs')
const fsReaddir = require('fs').promises.readdir
const log = require('./log')
const isExec = require('./isExecutable')
const homeDir = os.homedir()

// skips C:\WINDOWS\* which is not a "healthy thing" to parse
// (lots of files, special permissions etc.)
const IGNORE_WIN_ROOT = true

let counter = 0

// linux only: .desktop files
async function getDesktopFriendlies() {
  const config = window.app.config
  let locations = config.desktopFilesLocation
  if (locations === undefined || locations === null) return []
  if (typeof locations === 'string') locations = [locations]
  if (!Array.isArray(locations)) {
    log.warn(
      'Configuration value "desktopFilesLocation" must be a string ' +
        `or array of strings (was type "${typeof locations}").`
    )
    return []
  }
  if (locations.length === 0) return []
  let files = []
  let readCount = 0
  let deskItemCount = 0
  for (let idx = 0; idx < locations.length; idx++) {
    const location = String(locations[idx]).replace(/^~/, homeDir)
    let currentFiles = []
    try {
      currentFiles = await fsReaddir(location)
      readCount++
    } catch (err) {
      currentFiles = []
    }
    // the old (not string[], only string) version lazily returned only the filenames
    currentFiles = currentFiles.filter((fn) => /\.desktop$/.test(fn))
    currentFiles = currentFiles.map((fn) => ({
      id: `D${deskItemCount++}`,
      executable: true,
      type: 'DESKTOPITEM',
      desktop: true,
      path: location,
      name: fn.replace(/\.desktop$/, ''),
      command: path.join(location, fn), // this should be taken from inside the .desktop file?!
    }))
    files = files.concat(currentFiles)
  }
  if (readCount > 0 && files.length > 0) {
    log.info(`Read ${readCount} location(s) from "desktopFilesLocation", found ${files.length} desktop files.`)
  } else {
    log.info('No .desktop files found.')
  }
  return files
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
  const all = [getDesktopFriendlies(true), ...dirs.map((dir) => readDir(dir))]
  return Promise.all(all).then(
    (packs) => {
      // first item is an array of desktop files, let's use that for the .desktop flag detection
      const desktops = packs[0].map((item) => item.name)

      // since .desktop support is WORK IN PROGRESS, I'll throw all of them away for now
      // TODO: get .desktop's internal content and use the proper launcher command (with support for terminal=true)
      // TODO: remove the "plain" executables (or the .desktop ones) to avoid duplicates (like /usr/bin/foo vs foo.desktop)
      packs.shift()

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
