const log = require('./log')
const parseDirs = require('./parseDirs')
const parsePath = require('./parsePath')
const parseFluxboxMenu = require('./parseFluxboxMenu')
const getSearchableText = require('./getSearchableText')

function parseAll(searchItems) {
  searchItems = searchItems || []
  searchItems.length = 0
  const startedAt = Date.now()
  const config = window.app.config
  const fbMenuFile = config.fluxboxMenuFile
  return Promise.all([parseFluxboxMenu(fbMenuFile), parsePath(), parseDirs()]).then(
    (itemPacks) => {
      itemPacks.forEach((items) => searchItems.push.apply(searchItems, items))

      // add the searchable text, which shall be unified for all item types
      // (and it must be available for the search AND the gui)
      searchItems.forEach((item) => {
        item.searchableText = getSearchableText(item)
      })
      const endedAt = Date.now()
      log.info(`Parsed ${searchItems.length} items in ${endedAt - startedAt} ms.`)
      return searchItems
    },
    (err) => {
      log.error(`☠️ Parse error in parser module "${err.module || 'unknown'}"!\n`, err)
    }
  )
}

module.exports = parseAll
