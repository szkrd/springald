import { constants } from './renderer/constants';
import { openWithApp } from './renderer/runtime/openWithApp';
import { parseAll } from './renderer/runtime/parseAll';
import { runtime } from './renderer/runtime/runtime';
import { sendMessage } from './renderer/runtime/sendMessage';
import { sharedConfig } from './renderer/shared/sharedConfig';
import { sharedStore } from './renderer/shared/sharedStore';
import { $ } from './renderer/utils/dom';
import { escapeHtml } from './renderer/utils/string';
import { getConfig } from './shared/getConfig';
import { log } from './shared/log';

const { MAX_VISIBLE_ITEM_COUNT } = constants;

let config = sendMessage('MSG_GET_CONFIG');
Object.assign(sharedConfig, config);
let electronLayoutFixed = false;

function resetInputFields() {
  onSearchChange('');
  onAppChange('');
  ($.getById('search') as HTMLInputElement)!.value =
    ($.getById('app') as HTMLInputElement).value =
    sharedStore.withApp =
    $.getById('ghost')!.innerHTML =
      '';
  $.getById('search')!.focus();
}

function reparse() {
  runtime.setAppLoading(true);
  return getConfig(config.dataPath, true) // probably you've added new dirs in your local config, so let's reread the cfg
    .then((cfg) => {
      sendMessage('MSG_REFRESH_CONFIG', cfg);
      config = cfg;
      Object.assign(sharedConfig, cfg);
      return parseAll();
    })
    .finally(() => runtime.setAppLoading(false));
}

function launch() {
  if (!sharedStore.found.length) {
    return false;
  }
  const item = sharedStore.found[sharedStore.current];
  if (!item) {
    return false;
  }
  openWithApp(item, sharedStore.ghost || sharedStore.withApp, config);
  // after successful launch, when the user reopens the window, should we preselect the text?
  if (config.autoSelectAll) {
    ($.getById('search') as HTMLInputElement)!.select();
  }
  // reset manually changed app only (pure ghosts can stay, those were programmatic)
  if (($.getById('app') as HTMLInputElement)!.value) {
    ($.getById('app') as HTMLInputElement)!.value = sharedStore.withApp = $.getById('ghost')!.innerHTML = '';
    sharedStore.ghost = null;
  }
  return true;
}

function onDocumentKey(e) {
  if (!electronLayoutFixed) {
    // if the app starts hidden and shown later,
    // then the body's top is outside the viewport for some reason
    $.getById('current')!.style.display = 'block';
    electronLayoutFixed = true;
  }
  if (e.key === 'Enter') {
    if (launch()) sendMessage('MSG_TOGGLE_WINDOW');
  }
  if (e.key === 'F12' && e.shiftKey) {
    // do NOT use the log wrapper here, we don't want this end up in the buffer
    log.noBufferLog({ renderer: log.getBuffer(), backend: sendMessage('MSG_GET_LOG_BUFFER') });
  }
  if (e.key === 'F12' && !e.shiftKey) {
    sendMessage('MSG_TOGGLE_DEV_TOOLS');
  }
  if (e.key === 'F5') {
    reparse();
  }
  if (e.key === 'c' && e.altKey) {
    sendMessage('MSG_CENTER_WINDOW');
  }
  if (e.key === 'c' && e.ctrlKey) {
    resetInputFields();
  }
  if (e.key === 'q' && e.ctrlKey) {
    sendMessage('MSG_QUIT');
  }
  if (e.key === 'Escape') {
    sendMessage('MSG_TOGGLE_WINDOW');
  }
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key)) {
    e.stopPropagation();
    if (e.key === 'ArrowUp') {
      sharedStore.current = (sharedStore.current - 1) % sharedStore.found.length;
    } else if (e.key === 'ArrowDown') {
      sharedStore.current = (sharedStore.current + 1) % sharedStore.found.length;
    } else if (e.key === 'PageUp') {
      sharedStore.current = Math.max(sharedStore.current - MAX_VISIBLE_ITEM_COUNT, 0);
    } else if (e.key === 'PageDown') {
      sharedStore.current = Math.min(sharedStore.current + MAX_VISIBLE_ITEM_COUNT, sharedStore.found.length - 1);
    }
    runtime.highlightSelectedResult();
    setCurrentAndApp();
  }
}

function setCurrentAndApp() {
  if (!sharedStore.found.length || !sharedStore.found[sharedStore.current]) {
    return;
  }
  const found = sharedStore.found[sharedStore.current];
  $.getById('current')!.textContent = found.command;
  // if you haven't modified the app field, then "prefill" it with ghost text
  // (searchableText is the pretty text, like "d:~/foo/bar/baz.txt")
  if (!($.getById('app') as HTMLInputElement)!.value && Object.keys(config.openWith || {}).length > 0) {
    const forAsIs = runtime.getPreferredOpenWith(found.searchableText); // first we match against the visible text
    const forCommand = runtime.getPreferredOpenWith(found.command); // if that fails, then we fall back to the command (=path+name)
    const appGhostText = forAsIs || forCommand;
    onAppChange(appGhostText);
  }
}

function onAppChange(e) {
  const val = (typeof e === 'string' ? e : e.target.value || '').trim();
  const longEnoughToTrigger = val.length > 1;
  let matchingApp;
  sharedStore.withApp = val;
  if (longEnoughToTrigger) {
    const desktopItems = sharedStore.searchItems.filter((item) => item.desktop);
    // if we can't find it in the desktop friendly list, then try harder
    matchingApp =
      desktopItems.find((item) => item.name.startsWith(val)) ||
      sharedStore.searchItems.find((item) => item.name.startsWith(val) && item.executable);
  }
  $.getById('ghost')!.innerHTML = matchingApp ? escapeHtml(matchingApp.name) : '';
  sharedStore.ghost = matchingApp || null;
}

function onSearchChange(e) {
  const val = (typeof e === 'string' ? e : e.target.value || '').trim();
  const words = val ? val.split(config.logicalAndSeparator) : [];
  sharedStore.found = runtime.filterSearchItems(sharedStore.searchItems, words);
  sharedStore.current = 0;
  setCurrentAndApp();
  runtime.renderResults(words);
  runtime.highlightSelectedResult();
  runtime.setWindowSize();
}

// +--------------------+
// | DOM CONTENT LOADED |
// +--------------------+
$.getDocument().addEventListener('DOMContentLoaded', () => {
  log.info('App renderer activated. You can access app internals inside renderer via "window.app".');
  $.getWindow().addEventListener('error', runtime.handleError);
  runtime.setAppLoading(true);
  parseAll()
    .then((result) => {
      runtime.setAppLoading(false);
      sharedStore.searchItems = result;
    })
    .catch(runtime.handleError);

  $.getBody().classList.add(`theme-${config.theme}`);
  $.getBody().innerHTML = runtime.renderPage();

  // add a helper class to the body, so that we can move the focus
  // indicator line below the focused input with css animation
  $.inputFocusClassToBody('search');
  $.inputFocusClassToBody('app');

  // disable jumping to start / end of input.value
  $.disableKeyDownForElement('search', ['ArrowUp', 'ArrowDown']);
  $.disableKeyDownForElement('app', ['ArrowUp', 'ArrowDown']);

  $.getById('search')?.focus();
  $.getDocument().addEventListener('keyup', onDocumentKey);
  $.getById('search')?.addEventListener('input', onSearchChange);
  $.getById('app')?.addEventListener('input', onAppChange);

  // if we had errors in the backend's log buffer, then let's show that
  // (this of course can be checked by launching from the commandline)
  const backendLogBuffer = sendMessage('MSG_GET_LOG_BUFFER');
  if (log.getErrorCount(backendLogBuffer)) {
    log.noBufferWarn(
      [
        '!!!',
        'There has been errors during the backend startup:',
        '(you can access the combined log buffer with shift+F12)',
        '!!!',
      ].join('\n'),
      backendLogBuffer,
    );
  }
});
