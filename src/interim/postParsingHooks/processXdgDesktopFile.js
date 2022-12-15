const { readFile } = require('fs').promises

async function processXdgDesktopFile(item) {
  const fn = item.command
  let contents = ''
  contents = await readFile(fn, 'utf-8') // TODO try catch and err.meta (like .module)
  const lines = contents.split(/\n/)
  const xdgObj = {}
  let currentGroup = ''
  lines.forEach((line) => {
    line = line.trim()
    // skip comments and empty lines
    if (!line || line.startsWith('#')) return
    // groups
    if (line.startsWith('[') && line.endsWith(']')) currentGroup = line.substring(1, line.length - 1)
    // process only "[Desktop Entry]" groups
    if (currentGroup !== 'Desktop Entry') return
    const splits = line.split(/=(.*)/s) // TODO handle escaping?
    if (splits.length > 1 && !splits[0].includes('[')) {
      let val = splits[1]
      if (val === 'true') val = true
      if (val === 'false') val = false
      xdgObj[splits[0]] = val
    }
  })
  // do not show hidden desktop apps
  if (xdgObj.NoDisplay) item.hidden = true
  // append "real" name to search text and add special "x" prefix
  if (xdgObj.Name) item.searchableText = `x${item.searchableText} (${xdgObj.Name})`
  return item
}

module.exports = processXdgDesktopFile
