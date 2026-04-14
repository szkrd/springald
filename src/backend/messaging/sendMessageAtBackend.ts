import { IMessageKey, messages } from '../messages';
import { backendEventBus } from './backendEventBus';

/** Sends message from backend to backend using the **eventbus**. */
export function sendMessageAtBackend(messageId: IMessageKey, payload?: any) {
  if (!messages[messageId]) throw new Error('Unknown message id!');
  return backendEventBus.emit(messageId, payload);
}

export function sendMessageAtBackend_toggleWindow(): void {
  sendMessageAtBackend('MSG_TOGGLE_WINDOW');
}

export function sendMessageAtBackend_quit(): void {
  sendMessageAtBackend('MSG_QUIT');
}
