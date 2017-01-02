const parsePath = require('./parsePath');
const parseFluxboxMenu = require('./parseFluxboxMenu');
const appLoading = require('../gui/appLoading');
const store = require('../store');

function parseAll () {
  appLoading(true);
  store.searchItems.length = 0;
  return Promise.all([parseFluxboxMenu(), parsePath()])
    .then((itemPacks) => {
      itemPacks.forEach(items => store.searchItems.push.apply(store.searchItems, items));
      appLoading(false);
    });
}

module.exports = parseAll;
