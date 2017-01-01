const parseFluxboxMenu = require('./parseFluxboxMenu');
const appLoading = require('./gui/appLoading');
const store = require('./store');

function parseAll () {
  appLoading(true);
  store.searchItems.length = 0;
  parseFluxboxMenu()
    .then(items => {
      store.searchItems.push.apply(store.searchItems, items);
      appLoading(false);
    });
}

module.exports = parseAll;
