// main must be in the topmost directory, otherwise the require paths will be a bit wonky
const gui = require('nw.gui');
const win = gui.Window.get();
const template = require('./scripts/template.js');
const $ = require('./scripts/utils/getElementById')(document); // node context vs browser context
const parseFluxboxMenu = require('./scripts/parseFluxboxMenu');
const setResults = require('./scripts/gui/setResults')(document);
const escapeHtml = require('./scripts/utils/escapeHtml');
const setupTray = require('./scripts/gui/setupTray')(win);
const store = require('./scripts/store');

let searchItems = [];

function appLoading (state) {
  document.body.className = state ? 'loading' : '';
}

function onSearchChange (e) {
  let val = (e.target.value || '').trim();
  let found = searchItems.filter(item => {
    if (item.name.indexOf(val) > -1) {
      return true;
    }
    if (item.path.indexOf(val) > -1) {
      return true;
    }
  });
  $('current').textContent = found && found.length ? found[0].command : '';
  setResults(found, val);
}

setupTray();

win.on('minimize', function() {
  this.hide();
  store.visible = false;
});

document.addEventListener('keyup', e => {
    if (e.keyCode == 27) {
      win.minimize();
    }
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = template;
  appLoading(true);
  $('search').focus();

  $('search').addEventListener('input', onSearchChange);

  parseFluxboxMenu()
    .then(items => {
      searchItems.push.apply(searchItems, items);
      appLoading(false);
    })
});

/*
// leftovers from a playground

const exec = require('child_process').exec;
var os = require('os');
document.write('You are running on ', os.platform());



//tray = null;

var btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  gui.Shell.openItem('icon.png')
  exec('notepad main.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
})

// ----
// main.js stuff

 var option = {
 key : "Ctrl+Shift+A",
 active : function() {
 console.log("Global desktop keyboard shortcut: " + this.key + " active.");
 },
 failed : function(msg) {
 // :(, fail to register the |key| or couldn't parse the |key|.
 console.log(msg);
 }
 };

 // Create a shortcut with |option|.
 var shortcut = new nw.Shortcut(option);

 // Register global desktop shortcut, which can work without focus.
 nw.App.registerGlobalHotKey(shortcut);

 // If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
 // will get an "active" event.

 // You can also add listener to shortcut's active and failed event.
 shortcut.on('active', function() {
 console.log("Global desktop keyboard shortcut: " + this.key + " active.");
 });

 shortcut.on('failed', function(msg) {
 console.log(msg);
 });

 // Unregister the global desktop shortcut.
 //nw.App.unregisterGlobalHotKey(shortcut);

 nw.Window.open('index.html', {}, function(win) {});

*/
