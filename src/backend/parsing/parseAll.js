const parseDirs = require('./parseDirs')
const parsePath = require('./parsePath')
const parseFluxboxMenu = require('./parseFluxboxMenu')
const getSearchableText = require('./getSearchableText')
const getConfig = require('../getConfig')

async function parseAll() {
  // NW appLoading(false)
  let items = []
  const startedAt = Date.now()
  const config = await getConfig()
  const fbMenuFile = config.fluxboxMenuFile
  try {
    // the individual parsers must do their own error handling, do NOT break the Promise.all group
    const itemGroups = await Promise.all([parseFluxboxMenu(fbMenuFile), parsePath(), parseDirs()])
    items = itemGroups.flat()
  } catch (err) {
    console.error('Unexpected parse error.', err)
    return items
  }

  // add the searchable text, which shall be unified for all item types
  // (and it must be available for the search AND the gui)
  items.forEach((item) => {
    item.searchableText = getSearchableText(item)
  })
  const endedAt = Date.now()
  console.info(`Parsed all ${items.length} items in ${endedAt - startedAt} ms.`)
  // NW appLoading(false)
  return items
}

module.exports = parseAll
