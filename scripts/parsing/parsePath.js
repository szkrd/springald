const path = require('path')
const fs = require('fs')
const consts = require('../consts')
const isExec = require('../utils/isExec')

let counter = 0

// linux only: get global .desktop files, strip the "extensions"
// and return only the basename part (no path either)
function getDesktopFriendlies() {
  const location = consts.DESKTOP_FILES_LOCATION // TODO use an array
  return new Promise((resolve, reject) => {
    fs.readdir(location, (err, files) => {
      if (err) {
        return resolve([])
      }
      return resolve(files.filter((fn) => /\.desktop$/.test(fn)).map((fn) => fn.replace(/\.desktop$/, '')))
    })
  })
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
        console.error(`☠️ Could not read location "$\{location}", skipping.`)
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
          if (err) {
            // on Ubuntu some packages may leave broken symlinks behind, so
            // getting a file not found error is not that uncommon
            // in that case go and delete that file yourself...
            console.error(`☠️ Could not stat path "${file}", skipping!`)
            resolve([])
            return
          }
          processCount++
          if (stats.isFile()) {
            const parsed = path.parse(file)
            // on the path non executables are not interesting
            if (isExec(parsed.ext, stats.mode) && !isLocalNodeBin(file)) {
              results.push({
                id: `p${counter++}`,
                executable: true,
                parameters: '', // TODO / NYI
                type: 'PATHITEM',
                path: parsed.dir,
                name: parsed.base,
                desktop: false,
                command: file // full path
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
  const result = []
  const pathItems = process.env.PATH.split(path.delimiter)
  let dirs = [...new Set(pathItems)]
  if (pathItems.length !== dirs.length) {
    console.warn('You have duplicate items in your PATH!')
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
      // has a desktop file, so we would like to prioritize that
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
        // omit marked nulls, this will leave us with a list
        // .desktop files that do more than just reference
        // an executable with the same name. The problem with these
        // desktop files is that their "Name=" section may not be particularly descriptive,
        // nevertheless it would be nice to parse the contents of these files
        // and add them to the list of files we already have:
        //
        // `gnome-keyboard-panel.desktop` =>
        // {
        //   name: 'Keyboard',
        //   executable: '?/?/gnome-control-center', // <- path has to be looked up in the found executables' list
        //   parameters: 'keyboard',
        //   ...
        // }
        const remainingDesktopBaseNames = desktops.filter((baseName) => baseName)
        if (remainingDesktopBaseNames.length) {
          console.info(`NYI: ${remainingDesktopBaseNames.length} unprocessed .desktop files were ignored.`) // NYI
        }
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
