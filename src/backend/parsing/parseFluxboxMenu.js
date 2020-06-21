const os = require('os')
const path = require('path')
const fs = require('fs').promises

let counter = 0
const homeDir = os.homedir()

function parse(s, depth = []) {
  return new Promise((resolve) => {
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
        const command = line.replace(/[^{]*{/, '').replace(/([^\\])}.*/, '$1')
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

async function parseFluxboxMenu(fileName, depth = []) {
  depth = Array.from(depth)
  fileName = (fileName || '').replace(/~/, homeDir)
  const menuFile = fileName || path.join(homeDir, '.fluxbox', 'menu')
  let result = []
  if (!fileName) return result
  try {
    await fs.access(menuFile)
  } catch (err) {
    console.info(`Fluxbox menu file "${fileName}" not found or not accessible.`) // not found
    return result
  }
  let contents
  try {
    contents = await fs.readFile(menuFile, 'utf8')
  } catch (err) {
    console.error(`Could not read fluxbox menu file at "${fileName}"`, err) // not readable
    return result
  }
  try {
    result = await parse(contents, depth)
  } catch (err) {
    console.error('Could not parse fluxbox menu file.', err) // not parsable
    return result
  }
  console.info(`Parsed ${result.length} items from fluxbox menu.`)
  return result
}

module.exports = parseFluxboxMenu
