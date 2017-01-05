const multiSplitSearch = require('./utils/multiSplitSearch');

const throwAwayLessUseful = true;

// higher score first
function compare (a, b) {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }
  return 0;
}

function filterSearchItems (items, needles) {
  let getScore = text => multiSplitSearch(text, needles);
  if (!needles || !needles.length) {
    return [];
  }
  let filtered = items.filter(item => {
    let score = getScore(item.searchableText);
    if (score) {
      item.score = score; // yay, a mutant kitten died here
      return true;
    }
  });
  filtered = filtered.sort(compare);
  // try to throw away less useful items
  if (needles.length > 1 && throwAwayLessUseful) {
    let highest = (filtered[0] || {}).score || 0;
    filtered = filtered.filter(item => item.score === highest);
  }
  return filtered;
}

module.exports = filterSearchItems;
