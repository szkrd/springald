import { Menu, Tray } from 'electron';
import { getConfig } from '../interim/getConfig';
import { sendMessageAtBackend } from './modules/messages/sendMessageAtBackend';

const initialized = false;
let tray: Tray;

/**
 * Creates or returns the already created electron tray icon.
 */
export async function initTray(): Promise<Tray> {
  if (initialized) {
    return tray;
  }
  const config = await getConfig();
  let iconFileName = 'icon-16x16.png';
  if (config.trayIconSize === 'large') {
    iconFileName = 'icon-64x64.png';
  }
  tray = new Tray('assets/' + iconFileName);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'toggle window', type: 'normal', click: () => sendMessageAtBackend('MSG_TOGGLE_WINDOW') },
    { label: 'quit', type: 'normal', click: () => sendMessageAtBackend('MSG_QUIT') },
  ]);
  tray.addListener('click', () => sendMessageAtBackend('MSG_TOGGLE_WINDOW'));
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Springald');
  return tray;
}
