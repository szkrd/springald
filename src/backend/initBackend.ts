import { app } from 'electron';
import { log } from '../interim/log';
import { getConfig } from '../interim/getConfig';
import { initTray } from './initTray';
import { initWindow } from './initWindow';
import { initGlobalShortcuts } from './initGlobalShortcuts';
import { handleMessage } from './modules/messages/handleMesssage';
import { isCoord } from './utils/isCoord';
import { unixSocket } from './modules/unixSocket';

let initialized = false;
let backend; // win, tray, config

/**
 * Get position and set position fails before/after
 * a resize, so the window slowly moves towards 0 0, maybe because
 * of the non 1:1 desktop size I have, but I'm not sure (it doesn't
 * happen in a vm, only on the "real" hardware (a thinkpad t480s).
 */
function fixPosition() {
  const cfg = backend.config;
  if (isCoord(cfg.fixPosition)) backend.win.setPosition(...cfg.fixPosition);
}

/**
 * Just like fix position, "sometimes" on linux the height calculation
 * is off by a couple of pixels and of course this doesn't happen in a vm
 */
function fixSizing(obj) {
  const cfg = backend.config;
  if (isCoord(cfg.modifyResize)) {
    obj.width += cfg.modifyResize[0];
    obj.height += cfg.modifyResize[1];
  }
  return obj;
}

/**
 * Setup backend message listener.
 * The **renderer** can use its `sendMessages` to have the backend execute commands.
 * Some of these are also used as unix socket messages.
 *
 * Do NOT forget to set these message is _messages.ts_ along with a helpful comment about what it does!
 */
function setupMessageListener() {
  const handlers = {
    quit: () => {
      if (unixSocket && typeof unixSocket.destroy === 'function') unixSocket.destroy();
      app.quit();
    },
    getConfig: () => backend.config,
    getLogBuffer: () => log.getBuffer(),
    refreshConfig: getConfig.inject,
    resizeWindow: (payload) => {
      const { width, height } = fixSizing(payload);
      backend.win.setSize(width, height);
      fixPosition();
    },
    toggleWindow: () => {
      backend.win.toggle();
    },
    centerWindow: () => {
      backend.win.center();
    },
    toggleDevTools: () => {
      backend.win.toggleDevTools();
    },
  };
  handleMessage('MSG_QUIT', handlers.quit);
  handleMessage('MSG_GET_CONFIG', handlers.getConfig);
  handleMessage('MSG_GET_LOG_BUFFER', handlers.getLogBuffer);
  handleMessage('MSG_REFRESH_CONFIG', handlers.refreshConfig);
  handleMessage('MSG_RESIZE_WINDOW', handlers.resizeWindow);
  handleMessage('MSG_TOGGLE_WINDOW', handlers.toggleWindow);
  handleMessage('MSG_CENTER_WINDOW', handlers.centerWindow);
  handleMessage('MSG_TOGGLE_DEV_TOOLS', handlers.toggleDevTools);
  unixSocket.create(handlers);
  process.on('SIGINT', handlers.quit);
}

export async function initBackend() {
  if (!app.requestSingleInstanceLock()) {
    throw Object.assign(new Error('Already running! This is a single instance app.'), {
      alreadyRunning: true,
    });
  }
  if (initialized) return backend;
  const config = await getConfig(app.getPath('userData'));
  const tray = await initTray();
  const store = {};
  const globalShortcuts = await initGlobalShortcuts();
  const win = await initWindow();
  backend = { config, tray, store, win, globalShortcuts };
  setupMessageListener();
  initialized = true;
  return backend;
}
