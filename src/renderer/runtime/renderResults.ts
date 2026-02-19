import { constants } from '../constants';
import { sharedStore } from '../shared/sharedStore';
import { getScore } from '../utils/search';
import { escapeRegExp, escapeHtml } from '../utils/string';
import { $ } from '../utils/dom';

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

export function renderResults(needles) {
  const items = sharedStore.found;
  $.getByClassName('result').forEach((el) => ((el as HTMLDivElement).style.display = 'none'));

  for (let i = 0, l = items.length; i < l; i++) {
    const item = items[i];
    const el = $.getById(`result-${i}`);
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
