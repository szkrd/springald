const path = require('path');
const osenv = require('osenv');
const gui = require('nw.gui');
const win = gui.Window.get();
const renderTemplate = require('./scripts/gui/renderTemplate');
const parseAll = require('./scripts/parsing/parseAll');
const setResults = require('./scripts/gui/setResults');
const escapeHtml = require('./scripts/utils/escapeHtml');
const getConfig = require('./scripts/getConfig');
const openItem = require('./scripts/openItem');
const store = require('./scripts/store');
const context = require('./scripts/context');

let config;
let $ = id => document.getElementById(id);
context.window = window;
context.document = document;
context.gui = gui;
context.app = nw.App;

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
  let height = itemHeight + itemHeight * itemMax;
  height += store.found.length ? itemHeight : 0;
  win.height = height;
}

function onSearchChange (e) {
  let val = (e.target.value || '').trim();
  let found = store.found = store.searchItems.filter(item => {
    if (!val) {
      return false;
    }
    if (item.type === 'PATHITEM') {
      if (item.command.indexOf(val) > -1) {
        return true;
      }
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
  if (e.key === 'Enter') {
    launch();
    win.minimize();
  }
  if (e.key === config.refreshKey) {
    parseAll();
  }
  if (e.key === 'Escape') {
    hide();
  }
  if (e.key === 'q' && e.ctrlKey) {
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
  document.body.innerHTML = renderTemplate();
  setWindowSize();
  $('search').focus();
  $('search').addEventListener('input', onSearchChange);
  parseAll();
}

function launch() {
  if (!store.found.length) {
    return false;
  }
  let item = store.found[store.current];
  if (!item) {
    return false;
  }
  openItem(item);
  hide();
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
  config = getConfig();
  setupTray();
  setGlobalShortcut();
  win.on('minimize', onWinMinimize);
  document.addEventListener('keyup', onDocumentKey);
  document.addEventListener('DOMContentLoaded', onDomReady);
  hide();
}

// ----

run();
