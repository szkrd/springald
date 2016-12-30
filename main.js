const superchild = require('superchild');
const gui = require('nw.gui');
const win = gui.Window.get();
const template = require('./scripts/template.js');
const config = require('./config.json'); // TODO allow config json overrides
const parseFluxboxMenu = require('./scripts/parseFluxboxMenu');
const setResults = require('./scripts/gui/setResults')(document);
const escapeHtml = require('./scripts/utils/escapeHtml');
const store = require('./scripts/store');

let $ = id => document.getElementById(id);

let searchItems = [];

function hide () {
  win.hide();
  store.visible = false;
}

function show () {
  win.show();
  store.visible = true;
  $('search').select();
}

function toggle () {
  if (store.visible) {
    hide();
  } else {
    show();
  }
}

function setupTray () {
  let tray = new nw.Tray({
    title: 'Tray',
    icon: 'assets/icon.png'
  });
  let menu = new nw.Menu();
  menu.append(new nw.MenuItem({
    type: 'normal',
    label: 'quit',
    click: () => {
      win.close();
    }
  }));
  tray.menu = menu;
  tray.on('click', toggle);
}

function appLoading (state) {
  document.body.className = state ? 'loading' : '';
}

function setCurrent () {
  if (!store.found.length || !store.found[store.current]) {
    return;
  }
  $('current').textContent = store.found[store.current].command;
}

function markCurrentResult () {
  let all = document.querySelectorAll('.result');
  if (store.current < 0) {
    store.current = 0;
  }
  if (store.current > all.length - 1) {
    store.current = all.length - 1;
  }
  let el = $(`result-${store.current}`);
  if (el) {
    all.forEach(current => current.className = current.className.replace(/ selected/g, '').trim());
    el.className += ' selected';
  }
}

function setWindowSize () {
  const MAX_ITEM_COUNT = 6;
  let style = window.getComputedStyle($('current'), null);
  let itemHeight = parseInt(style.height.replace(/px/, ''), 10);
  let itemMax = Math.min(store.found.length, MAX_ITEM_COUNT);
  win.height = itemHeight + itemHeight * itemMax;
}

function onSearchChange (e) {
  let val = (e.target.value || '').trim();
  let found = store.found = searchItems.filter(item => {
    if (!val) {
      return false;
    }
    if (item.name.indexOf(val) > -1) {
      return true;
    }
    if (item.path.indexOf(val) > -1) {
      return true;
    }
  });
  setCurrent();
  setResults(val);
  markCurrentResult();
  setWindowSize();
}

function onDocumentKey (e) {
  if (e.key == 'Enter') {
    launch();
    win.minimize();
  }
  if (e.key == 'Escape') {
    hide();
  }
  if (e.key == 'q' && e.ctrlKey) {
    win.close();
  }
  if (e.key === 'ArrowUp') {
    e.stopPropagation();
    store.current = (store.current - 1) % store.found.length;
    markCurrentResult();
    setCurrent();
  }
  if (e.key === 'ArrowDown') {
    e.stopPropagation();
    store.current = (store.current + 1) % store.found.length;
    markCurrentResult();
    setCurrent();
  }
}

function onWinMinimize () {
  hide();
}

function onDomReady () {
  document.body.innerHTML = template;
  setWindowSize();
  appLoading(true);
  $('search').focus();
  $('search').addEventListener('input', onSearchChange);

  parseFluxboxMenu()
    .then(items => {
      searchItems.push.apply(searchItems, items);
      appLoading(false);
    });
}

function launch() {
  if (!store.found.length) {
    return false;
  }
  let item = store.found[store.current];
  if (!item) {
    return false;
  }
  if (item.executable) {
    superchild(item.command);
  } else {
    gui.Shell.openItem(item.command);
  }
  win.minimize();
}

function setGlobalShortcut () {
  let option = {
    key: config.toggleKey,
    active: toggle,
    failed: (msg) => {
      console.error(`Failed to register hotkey "${config.toggleKey}"`);
    }
  };
  let shortcut = new nw.Shortcut(option);
  nw.App.registerGlobalHotKey(shortcut);
}

function run() {
  setupTray();
  setGlobalShortcut();
  win.on('minimize', onWinMinimize);
  document.addEventListener('keyup', onDocumentKey);
  document.addEventListener('DOMContentLoaded', onDomReady);
  hide();
}

// ----

run();
