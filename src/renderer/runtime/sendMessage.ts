import { ipcRenderer } from 'electron';
import { IMessageKey, messages } from '../../backend/messages';
import { IAppConfig } from '../../shared/config';
import { ILogBuffer } from '../../shared/log';
import { IWidthHeight } from '../../backend/messaging/handleMesssage';

export function sendMessage(messageId: IMessageKey, payload?: any) {
  if (!messages[messageId]) throw new Error('Unknown message id!');
  return ipcRenderer.sendSync(messageId, payload);
}

export function sendMessage_getConfig(): IAppConfig {
  return sendMessage('MSG_GET_CONFIG');
}

export function sendMessage_centerWindow(): void {
  sendMessage('MSG_CENTER_WINDOW');
}

export function sendMessage_getLogBuffer(): ILogBuffer {
  return sendMessage('MSG_GET_LOG_BUFFER');
}

export function sendMessage_quit(): void {
  sendMessage('MSG_QUIT');
}

export function sendMessage_refreshConfig(config: IAppConfig) {
  sendMessage('MSG_REFRESH_CONFIG', config);
}

export function sendMessage_resizeWindow({ width, height }: IWidthHeight): void {
  sendMessage('MSG_RESIZE_WINDOW', { width, height });
}

export function sendMessage_toggleDevTools(): void {
  sendMessage('MSG_TOGGLE_DEV_TOOLS');
}

export function sendMessage_toggleWindow(): void {
  sendMessage('MSG_TOGGLE_WINDOW');
}
