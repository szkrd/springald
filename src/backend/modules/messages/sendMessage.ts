import { messages } from '../../messages';
import { eventBus } from './eventBus';

export function sendMessage(messageId: keyof typeof messages, payload?) {
  if (!messages[messageId]) throw new Error('Unknown message id!');
  return eventBus.emit(messageId, payload);
}
