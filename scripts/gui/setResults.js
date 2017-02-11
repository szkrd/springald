const escapeHtml = require('../utils/escapeHtml');
const underline = require('./multiHtmlUnderline');
const multiSplitSearch = require('../utils/multiSplitSearch');
const store = require('../store');
const context = require('../context');

function createName (item, needles) {
  let text = item.searchableText;
  if (multiSplitSearch(text, needles)) {
    text = underline(text, needles);
  }
  return text;
}

function setResults (needles) {
  let items = store.found;
  let els = context.document.querySelectorAll('.result');
  els.forEach(el => { el.style.display = 'none'; });

  for (let i = 0, l = items.length; i < l; i++) {
    let item = items[i];
    let el = context.document.getElementById(`result-${i}`);
    if (!el) {
      return;
    }
    el.style.display = 'block';
    el.innerHTML = escapeHtml(createName(item, needles));
    el.dataset.id = item.id;
  }
}

module.exports = setResults;
