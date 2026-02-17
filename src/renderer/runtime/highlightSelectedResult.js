const sharedStore = require('../shared/sharedStore');
const { dom } = require('../utils/utils');

function highlightSelectedResult() {
  const { $, $$ } = dom;
  const all = $$('.result');
  if (sharedStore.current < 0) {
    sharedStore.current = 0;
  }
  if (sharedStore.current > all.length - 1) {
    sharedStore.current = all.length - 1;
  }
  const el = $(`#result-${sharedStore.current}`);
  if (el) {
    all.forEach((current) => {
      current.classList.remove('selected');
    });
    el.classList.add('selected');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

module.exports = highlightSelectedResult;
