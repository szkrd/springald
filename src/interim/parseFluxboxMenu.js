const os = require('os')
const path = require('path')
const fs = require('fs')
const log = require('./log')

let counter = 0
const homeDir = os.homedir()

function parse(s, depth = []) {
  return new Promise((resolve, reject) => {
    s = s.replace(/\r\n/g, '\n')
    const itemPath = depth
    const ret = []
    const lines = s.split(/\n/)
    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i].trim()
      let name = line.replace(/[^(]*\(/, '').replace(/([^\\])\).*/, '$1')

      // submenu
      if (/^\[submenu]/.test(line)) {
        // we ignore the {title} part of the submenu `[submenu] (foo) {foo title}`
        name = name.replace(/\\\)/g, ')') // unescape "\)" to ")"
        itemPath.push(name)
      }

      // end of submenu
      if (/^\[end]/.test(line)) {
        itemPath.pop()
      }

      // executable
      if (/^\[exec]/.test(line)) {
        name = name.replace(/\\\)/g, ')') // unescape "\)" to ")"
        const command = line.replace(/[^{]*\{/, '').replace(/([^\\])}.*/, '$1')
        ret.push({
          id: `f${counter++}`,
          executable: true,
          type: 'FB_MENUITEM',
          path: '/' + itemPath.join('/'),
          name,
          command,
        })
      }

      // included menu
      if (/^\[include]/.test(line)) {
        parseFluxboxMenu(name, itemPath).then((results) => ret.push(...results))
      }
    }
    resolve(ret)
  })
}

function parseFluxboxMenu(fileName, depth = []) {
  depth = Array.from(depth)
  fileName = (fileName || '').replace(/~/, homeDir)
  const menuFile = fileName || path.join(homeDir, '.fluxbox', 'menu')
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(menuFile)) {
      log.info('No fluxbox menu file found.')
      resolve([])
      return
    }
    fs.readFile(menuFile, 'utf8', (err, contents) => {
      if (err) {
        err.module = 'parseFluxboxMenu'
        reject(err)
      } else {
        parse(contents, depth).then((result) => resolve(result))
      }
    })
  })
}

module.exports = parseFluxboxMenu
