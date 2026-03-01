import { ipcRenderer } from 'electron';
import { IMessageKey, messages } from '../../backend/messages';

export function sendMessage(messageId: IMessageKey, payload?) {
  if (!messages[messageId]) throw new Error('Unknown message id!');
  return ipcRenderer.sendSync(messageId, payload);
}
