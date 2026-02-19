import { globalShortcut } from 'electron';
import { log } from '../interim/log';
import { getConfig } from '../interim/getConfig';
import { sendMessageAtBackend } from './modules/messages/sendMessageAtBackend';

const initialized = false;

/**
 * Electron may crash on mac if the unregister all is called
 * on app exit, so _maybe_ we won't really need this?
 */
function free() {
  globalShortcut.unregisterAll();
}
const globalShortcuts = { free };

/**
 * Registers the global shortcuts.
 * Currently this object has no public interfaces.
 */
export async function initGlobalShortcuts(): Promise<void> {
  if (initialized) {
    return;
  }
  const config = await getConfig();
  let keys = config.toggleKey;
  if (typeof keys === 'string') {
    keys = [keys];
  }
  keys.forEach((key) => {
    const toggleAction = () => {
      sendMessageAtBackend('MSG_TOGGLE_WINDOW');
    };
    const success = globalShortcut.register(key, toggleAction);
    if (!success) {
      log.error(`Global hotkey "${key}" registration failed.`);
    }
  });
}
