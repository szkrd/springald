import { $ } from '../utils/dom';

const gracePeriod = 500;
let inGracePeriod = false;
let lastActiveInput: Element | null;
let timer: number;

function _setAppLoading(enable: boolean) {
  if (enable) {
    lastActiveInput = document.activeElement;
  }
  $.toggleBodyClass('loading', enable);
  if (!enable && lastActiveInput instanceof HTMLElement) {
    lastActiveInput.focus();
  }
}

/** Toggles the "loading" class on the body element with a little debounce. */
export function setAppLoading(enable: boolean) {
  if (enable && !inGracePeriod) {
    inGracePeriod = true;
    timer = window.setTimeout(() => {
      inGracePeriod = false;
      _setAppLoading(true);
    }, gracePeriod);
    return;
  }
  if (!enable && inGracePeriod) {
    inGracePeriod = false;
    clearTimeout(timer);
    return;
  }
  _setAppLoading(false);
}
