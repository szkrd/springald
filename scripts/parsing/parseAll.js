const parseDirs = require('./parseDirs');
const parsePath = require('./parsePath');
const parseFluxboxMenu = require('./parseFluxboxMenu');
const getSearchableText = require('./getSearchableText');
const appLoading = require('../gui/appLoading');
const store = require('../store');

function parseAll () {
  appLoading(true);
  store.searchItems.length = 0;
  return Promise.all([parseFluxboxMenu(), parsePath(), parseDirs()])
    .then((itemPacks) => {
      itemPacks.forEach(items => store.searchItems.push.apply(store.searchItems, items));

      // add the searchable text, which shall be unified for all item types
      // (and it must be available for the search AND the gui)
      store.searchItems.forEach(item => item.searchableText = getSearchableText(item));
      appLoading(false);
    });
}

module.exports = parseAll;
