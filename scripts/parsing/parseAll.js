const parseDirs = require('./parseDirs')
const parsePath = require('./parsePath')
const parseFluxboxMenu = require('./parseFluxboxMenu')
const getSearchableText = require('./getSearchableText')
const appLoading = require('../gui/appLoading')
const getConfig = require('../getConfig')
const store = require('../store')

function parseAll() {
  appLoading(true)
  const startedAt = Date.now()
  const config = getConfig()
  const fbMenuFile = config.fluxboxMenuFile
  store.searchItems.length = 0
  return Promise.all([parseFluxboxMenu(fbMenuFile), parsePath(), parseDirs()]).then(
    (itemPacks) => {
      itemPacks.forEach((items) => store.searchItems.push.apply(store.searchItems, items))

      // add the searchable text, which shall be unified for all item types
      // (and it must be available for the search AND the gui)
      store.searchItems.forEach((item) => {
        item.searchableText = getSearchableText(item)
      })
      const endedAt = Date.now()
      console.info(`Parsed ${store.searchItems.length} items in ${endedAt - startedAt} ms.`)
      appLoading(false)
    },
    (err) => {
      console.error(`☠️ Parse error in parser module "${err.module || 'unknown'}"!\n`, err)
    }
  )
}

module.exports = parseAll
