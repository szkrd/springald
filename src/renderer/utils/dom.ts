/**
 * Useful for swallowing down and up arrow press on input fields
 * (so that we can disable jumping to the beginning or the end of the input value).
 */
function disableKeyDownForElement(elementId: string, keyNames: KeyboardEvent['key'][] = []) {
  $.getById(elementId)?.addEventListener('keydown', (event: KeyboardEvent) => {
    if (keyNames.includes(event.key)) {
      event.preventDefault();
    }
  });
}

/**
 * When an input is focused the body will get a marker class based on that element's id.
 *
 * For example input by id `search` is focused, then body will get a `search-focused` css class.
 */
function inputFocusClassToBody(elementId: 'search' | 'app') {
  const className = `${elementId}-focused`;
  const body = $.getBody();
  $.getById(elementId)?.addEventListener('focus', () => body.classList.add(className));
  $.getById(elementId)?.addEventListener('blur', () => body.classList.remove(className));
}

/** Get the computed height element located by id. */
function getComputedHeightById(elementId: string) {
  const el = $.getById(elementId);
  if (!el) throw Error(`Invalid element #${elementId}`);
  const style = window.getComputedStyle(el, null);
  return parseInt(style.height.replace(/px/, ''), 10);
}

/** Low level DOM wrappers. */
export const $ = {
  getWindow: () => window,
  getDocument: () => document,
  getBody: () => document.body,
  getById: (elementId: string) => document.getElementById(elementId),
  getByClassName: (selector: string) => document.querySelectorAll('.' + selector),
  getComputedHeightById,
  disableKeyDownForElement,
  inputFocusClassToBody,
};
