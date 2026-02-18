import { globalShortcut } from 'electron';
import { log } from '../interim/log';
import { getConfig } from '../interim/getConfig';
import { sendMessage } from './modules/messages/sendMessage';

const initialized = false;

// electron may crash on mac if the unregister all is called
// on app exit, so _maybe_ we won't really need this
function free() {
  globalShortcut.unregisterAll();
}
const globalShortcuts = { free };

export async function initGlobalShortcuts() {
  if (initialized) return globalShortcuts;
  const config = await getConfig();
  let keys = config.toggleKey;
  if (typeof keys === 'string') {
    keys = [keys];
  }
  keys.forEach((key) => {
    const toggleAction = () => {
      sendMessage('MSG_TOGGLE_WINDOW');
    };
    const success = globalShortcut.register(key, toggleAction);
    if (!success) {
      log.error(`Global hotkey "${key}" registration failed.`);
    }
  });

  return globalShortcuts;
}
