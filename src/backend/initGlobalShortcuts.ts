import { globalShortcut } from 'electron';
import { log } from '../shared/log';
import { getConfig } from '../shared/config';
import { sendMessageAtBackend_toggleWindow } from './messaging/sendMessageAtBackend';

const initialized = false;

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
      sendMessageAtBackend_toggleWindow();
    };
    const success = globalShortcut.register(key, toggleAction);
    if (!success) {
      log.error(`Global hotkey "${key}" registration failed.`);
    }
  });
}
