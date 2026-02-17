const constants = require('../constants');
const sharedStore = require('../shared/sharedStore');
const { getScore } = require('../utils/search');
const { escapeRegExp, escapeHtml } = require('../utils/string');
const { dom } = require('../utils/utils');

function underline(text, needles) {
  const consts = constants;
  const prefix = consts.U_PREFIX;
  const postfix = consts.U_POSTFIX;
  needles = Array.isArray(needles) ? [...new Set(needles)] : [needles];
  needles.forEach((needle) => {
    text = text.replace(new RegExp(escapeRegExp(needle), 'gi'), (match) => prefix + match + postfix);
  });
  return text;
}

function createName(item, needles) {
  let text = item.searchableText;
  if (getScore(text, needles) > 0) {
    text = underline(text, needles);
  }
  return text;
}

function renderResults(needles) {
  const items = sharedStore.found;
  const { $, $$ } = dom;
  $$('.result').forEach((el) => {
    el.style.display = 'none';
  });

  for (let i = 0, l = items.length; i < l; i++) {
    const item = items[i];
    const el = $(`#result-${i}`);
    if (!el) {
      return;
    }
    el.style.display = 'block';
    // this will mark elements by their type (in case I want to colorize them):
    // type-UNSET, type-FB_MENUITEM, type-PATHITEM, type-DIRITEM
    el.className = el.className.replace(/type-[A-Z]+/, `type-${item.type}`);
    el.innerHTML = escapeHtml(createName(item, needles));
    el.dataset.id = item.id;
  }
}

module.exports = renderResults;
