const log = require('./log')
const parseDirs = require('./parseDirs')
const parsePath = require('./parsePath')
const parseFluxboxMenu = require('./parseFluxboxMenu')
const getSearchableText = require('./getSearchableText')
const processPostParseHooks = require('./postParsingHooks/processPostParseHooks')

async function parseAll(searchItems) {
  searchItems = searchItems || []
  searchItems.length = 0
  const startedAt = Date.now()
  const config = window.app.config
  const fbMenuFile = config.fluxboxMenuFile
  const dirCount = Array.isArray(config.directories) ? config.directories.length : 0

  // tha main parsing (fluxbox, paths, dirs)
  const promises = [
    config.fluxboxMenuFile === false ? null : parseFluxboxMenu(fbMenuFile),
    config.skipPathParsing === true ? null : parsePath(),
    dirCount === 0 ? null : parseDirs(),
  ]

  let itemPacks = []
  try {
    itemPacks = await Promise.all(promises)
  } catch (err) {
    log.error(`☠️ Parse error in parser module "${err.module || 'unknown'}"!\n`, err)
  }

  // collect stats for log info
  const count = (val) => (Array.isArray(val) ? val.length : 0)
  const counts = { flux: count(itemPacks[0]), path: count(itemPacks[1]), dirs: count(itemPacks[2]) }

  // flatten results
  itemPacks.forEach((items) => searchItems.push.apply(searchItems, items))

  // add the searchable text, which shall be unified for all item types
  // (and it must be available for the search AND the gui)
  searchItems.forEach((item) => {
    item.searchableText = getSearchableText(item)
  })

  if (config.betaFeatures) {
    try {
      await processPostParseHooks(searchItems)
    } catch (err) {
      log.error(`☠️ Post parsing hook error!\n`, err)
    }
  }

  // remove nulls and hidden files
  searchItems = searchItems.filter((x) => x).filter((item) => !item.hidden)

  const endedAt = Date.now()
  log.info(
    `Parsed ${searchItems.length} items in ${endedAt - startedAt} ms.\n` +
      `(fluxbox: ${counts.flux}, paths: ${counts.path}, dirs: ${counts.dirs})`
  )
  return searchItems
}

module.exports = parseAll
