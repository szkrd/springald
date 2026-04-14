import { ipcRenderer } from 'electron';
import {
  IMessageId,
  MSG_CENTER_WINDOW,
  MSG_GET_CONFIG,
  MSG_GET_LOG_BUFFER,
  MSG_QUIT,
  MSG_REFRESH_CONFIG,
  MSG_RESIZE_WINDOW,
  MSG_TOGGLE_DEV_TOOLS,
  MSG_TOGGLE_WINDOW,
} from '../../backend/messages';
import { IAppConfig } from '../../shared/config.types';
import { ILogBuffer } from '../../shared/log';
import { IWidthHeight } from '../../backend/messaging/handleMesssage';

function sendMessage(messageId: IMessageId, payload?: any) {
  return ipcRenderer.sendSync(messageId, payload);
}

export function sendMessage_getConfig(): IAppConfig {
  return sendMessage(MSG_GET_CONFIG);
}

export function sendMessage_centerWindow(): void {
  sendMessage(MSG_CENTER_WINDOW);
}

export function sendMessage_getLogBuffer(): ILogBuffer {
  return sendMessage(MSG_GET_LOG_BUFFER);
}

export function sendMessage_quit(): void {
  sendMessage(MSG_QUIT);
}

export function sendMessage_refreshConfig(config: IAppConfig) {
  sendMessage(MSG_REFRESH_CONFIG, config);
}

export function sendMessage_resizeWindow({ width, height }: IWidthHeight): void {
  sendMessage(MSG_RESIZE_WINDOW, { width, height });
}

export function sendMessage_toggleDevTools(): void {
  sendMessage(MSG_TOGGLE_DEV_TOOLS);
}

export function sendMessage_toggleWindow(): void {
  sendMessage(MSG_TOGGLE_WINDOW);
}
