const path = require('path')
const fs = require('fs')
const consts = require('../consts')
const isExec = require('../utils/isExec')

let counter = 0

// linux only: get global .desktop files
function getDesktopFriendlies() {
  const location = consts.DESKTOP_FILES_LOCATION
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
      const desktops = packs.shift()
      packs.forEach((pack) => result.push.apply(result, pack))
      if (desktops.length) {
        result.forEach((fn) => {
          if (desktops.includes(fn.name)) {
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
