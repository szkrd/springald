import { messages } from '../../messages';
import { backendEventBus } from './backendEventBus';

/** Sends message from backend to backend using the **eventbus**. */
export function sendMessageAtBackend(messageId: keyof typeof messages, payload?) {
  if (!messages[messageId]) throw new Error('Unknown message id!');
  return backendEventBus.emit(messageId, payload);
}
