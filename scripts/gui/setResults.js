const escapeHtml = require('../utils/escapeHtml');
const underline = require('./multiHtmlUnderline');
const multiSplitSearch = require('../utils/multiSplitSearch');
const store = require('../store');
const context = require('../context');

const os = require('os');
const isWin = /^win/.test(os.platform());

function createName(item, needles) {
  let prefix = '';
  let text = '';
  let separator = isWin ? '\\' : '/';
  if (item.type === 'FB_MENUITEM') { // WIP should I color it instead?
    prefix = 'fb:';
    separator = '/';
  } else if (item.type === 'PATHITEM') {
    prefix = 'p:';
  } else if (item.type === 'DIRITEM') {
    prefix = 'd:';
  }
  text = item.path + separator + item.name;
  if (multiSplitSearch(text, needles)) {
    text = underline(text, needles);
  }
  return prefix + text;
}

function setResults (needles) {
  let items = store.found;
  let els = context.document.querySelectorAll('.result');
  els.forEach(el => el.style.display = 'none');

  for (let i = 0, l = items.length; i < l; i++) {
    let item = items[i];
    let el = context.document.getElementById(`result-${i}`);
    if (!el) {
      return;
    }
    el.style.display = 'block';
    el.innerHTML = escapeHtml(createName(item, needles));
    el.dataset.id = i;
  }
}

module.exports = setResults;
