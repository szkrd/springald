const escapeHtml = require('../utils/escapeHtml');
const store = require('../store');
const context = require('../context');

const os = require('os');
const isWin = /^win/.test(os.platform());

function underline(s, fancy = true) {
  if (fancy) {
    return `<u>${s}</u>`;
  }
  let arr = s.split('');
  s = arr.join('\u0332');
  if (s) {
    return s + '\u0332';
  }
  return '';
}

function createName(item, needle) {
  let s = '';
  let separator = isWin ? '\\' : '/';
  if (item.type === 'FB_MENUITEM') { // WIP should I color it instead?
    s = 'fb:';
    separator = '/';
  } else if (item.type === 'PATHITEM') {
    s = 'p:';
  } else if (item.type === 'DIRITEM') {
    s = 'd:';
  }
  s += item.path + separator + item.name;
  let pos = s.indexOf(needle); // TODO multiple needles?
  if (pos > -1) {
    s = s.substring(0, pos) + underline(s.substring(pos, pos + needle.length)) + s.substring(pos + needle.length);
  }
  return s;
}

function setResults (needle) {
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
    el.innerHTML = escapeHtml(createName(item, needle));
    el.dataset.id = i;
  }
}

module.exports = setResults;
