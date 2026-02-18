import { ipcRenderer } from 'electron';
import { messages } from '../backend/messages';

export function sendMessage(messageId: keyof typeof messages, payload?) {
  if (!messages[messageId]) throw new Error('Unknown message id!');
  return ipcRenderer.sendSync(messageId, payload);
}
