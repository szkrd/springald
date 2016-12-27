let $ = require('../utils/getElementById');
let escapeHtml = require('../utils/escapeHtml');

// TODO proper html underline?
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
  if (item.type === 'FB_MENUITEM') {
    s = 'fb:'
  }
  s += item.path + '/' + item.name;
  let pos = s.indexOf(needle); // TODO multiple needles?
  if (pos > -1) {
    s = s.substring(0, pos) + underline(s.substring(pos, pos + needle.length)) + s.substring(pos + needle.length);
  }
  return s;
}

module.exports = document => {
  console.log(1);
  $ = $(document);
  console.log(2);

  return (items, needle) => {
    if (!items || !items.length) {
      let els = document.querySelectorAll('.result');
      els.forEach(el => el.style.display = 'none');
      return;
    }

    for (let i = 0, l = items.length; i < l; i++) {
      let item = items[i];
      let el = $(`result-${i}`);
      if (!el) {
        return;
      }
      el.style.display = 'block';
      // el.textContent = createName(item, needle);
      el.innerHTML = escapeHtml(createName(item, needle));
      el.dataset.id = i;
    }
  }
};