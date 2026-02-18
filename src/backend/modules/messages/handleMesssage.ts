import { ipcMain } from 'electron';
import { messages } from '../../messages';
import { eventBus } from './eventBus';

const registered: string[] = [];

export function handleMessage(messageId: keyof typeof messages, callback) {
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
  eventBus.on(messageId, callback);
}
