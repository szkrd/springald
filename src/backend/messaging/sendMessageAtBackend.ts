import { IMessageId, MSG_QUIT, MSG_TOGGLE_WINDOW } from '../messages';
import { backendEventBus } from './backendEventBus';

/** Sends message from backend to backend using the **eventbus**. */
function sendMessageAtBackend(messageId: IMessageId, payload?: any) {
  return backendEventBus.emit(messageId, payload);
}

export function sendMessageAtBackend_toggleWindow(): void {
  sendMessageAtBackend(MSG_TOGGLE_WINDOW);
}

export function sendMessageAtBackend_quit(): void {
  sendMessageAtBackend(MSG_QUIT);
}
