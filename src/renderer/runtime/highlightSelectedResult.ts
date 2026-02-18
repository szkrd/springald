import { sharedStore } from '../shared/sharedStore';
import { $ } from '../utils/dom';

export function highlightSelectedResult() {
  const all = document.querySelectorAll('.result');
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
