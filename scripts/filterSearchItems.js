const multiSplitSearch = require('./utils/multiSplitSearch');

function filterSearchItems (items, needles) {
  let getScore = text => multiSplitSearch(text, needles);
  return items.filter(item => {
    if (!needles || !needles.length) {
      return false;
    }
    // path item command has both the name and the path
    if (item.type === 'PATHITEM') {
      if (getScore(item.command)) {
        return true;
      }
    }
    // otherwise use both separately (fb menu command text is not relevant)
    if (getScore(item.name) || getScore(item.path)) {
      return true;
    }
  });
}

module.exports = filterSearchItems;
