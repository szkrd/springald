const fs = require('fs')
const path = require('path')
const os = require('os')
const getConfig = require('../getConfig')

let counter = 0
let config

function isAllowedFile(name) {
  const regTest = (r, n) => new RegExp(r).test(n)
  const incRules = config.includeFiles
  const excRules = config.excludeFiles
  return incRules.every((rule) => regTest(rule, name)) && excRules.every((rule) => !regTest(rule, name))
}

function isAllowedDir(name) {
  const rules = config.excludedDirs
  name = name.split('/').pop()
  return !rules.some((rule) => new RegExp(rule).test(name))
}

// as seen on the interwebz
function walk(dir, done) {
  let results = []

  // TODO investigate {encoding: 'buffer'} further
  fs.readdir(dir, (err, list) => {
    if (err) {
      err.file = dir
      return done(err) // pretty much this is the only hard error that may stop the walking
    }
    let pending = list.length
    const mayEnd = () => {
      if (!--pending) {
        done(null, results)
      }
    }
    if (!pending) {
      return done(null, results)
    }
    list.forEach((file) => {
      const name = file
      file = path.resolve(dir, file)
      fs.stat(file, (err, stat) => {
        if (err) {
          console.error(`Could not stat file "${file}".`, err)
          mayEnd()
          return // skip current loop, but not the whole walking
        }
        if (stat && stat.isDirectory()) {
          if (isAllowedDir(name)) {
            walk(file, (err, res) => {
              if (err) {
                console.error(`Could not read subdirectory "${file}"`)
              } else {
                results = results.concat(res)
              }
              mayEnd()
            })
          } else {
            mayEnd()
          }
        } else {
          const fileNameOnly = path.basename(file)
          if (isAllowedFile(fileNameOnly)) {
            const parsed = path.parse(file)
            results.push({
              id: `d${counter++}`,
              executable: false, // isExec(parsed.ext, stats.mode), <-- shouldn't be, isn't it annoying w samba?
              type: 'DIRITEM',
              path: parsed.dir,
              name: parsed.base,
              command: file, // full path
            })
          }
          mayEnd()
        }
      }) // end stat
    }) // end list forEach
  }) // end readdir
}

// parse the "directories" (section from the config)
async function parseDirs() {
  // first we replace the ~ with the proper home path
  const homeDir = os.homedir()
  config = await getConfig()
  counter = 0
  let dirs = [...new Set(config.directories || [])]
  dirs = dirs.map((dir) => dir.replace(/~/, homeDir).replace(/\\/g, '/')) // TODO normalize for path.sep

  // then check if all the directories exist
  dirs = dirs.filter((dir) => fs.existsSync(dir))
  let processedCount = 0
  const results = []

  // recursively process all the files in these directories
  return new Promise((resolve) => {
    const walkDirCallback = (err, res) => {
      processedCount++
      if (err) {
        console.error(`Directory walker error: could not read directory "${err.file}"!`)
        return
      }
      results.push.apply(results, res)
      if (processedCount === dirs.length) {
        // we will never reject here, since not being able to
        // parse a directory is not a showstopper
        console.info(`Parsed ${dirs.length} dirs and their ${results.length} items from included directories.`)
        resolve(results)
      }
    }
    dirs.forEach((dir) => walk(dir, walkDirCallback))
  })
}

module.exports = parseDirs
