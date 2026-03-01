import { ipcMain } from 'electron';
import { IMessageKey, messages } from '../messages';
import { backendEventBus } from './backendEventBus';

const registered: string[] = [];

/** Handles message from the backend **and** the renderer. */
export function handleMessage(messageId: IMessageKey, callback) {
  if (!messages[messageId]) {
    throw new Error('Unknown message id');
  }
  if (registered.includes(messageId)) {
    throw new Error('Message handler already registered');
  }

  // client / renderer
  ipcMain.on(messageId, (event, payload) => {
    const ret = callback(payload);
    // it seems to me that I _must_ return something...
    // https://github.com/electron/electron/issues/23080
    event.returnValue = ret === undefined ? null : ret;
  });

  // backend
  backendEventBus.on(messageId, callback);
}
