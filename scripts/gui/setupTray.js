const store = require('../store');

module.exports = win => {
  return () => {
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

    // Remove the tray
    tray.on('click', function () {
      if (store.visible) {
        win.hide();
        store.visible = false;
      } else {
        win.show();
        store.visible = true;
      }
    });
  };
};
