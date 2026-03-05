import { ipcMain } from 'electron';
import { IMessageKey, messages } from '../messages';
import { backendEventBus } from './backendEventBus';
import { IAppConfig } from '../../shared/config.types';
import { ILogBuffer } from '../../shared/log';

export interface IWidthHeight {
  width: number;
  height: number;
}

type IMessageHandlerQuit = () => void;
type IMessageHandlerGetConfig = () => IAppConfig;
type IMessageHandlerGetLogBuffer = () => ILogBuffer;
type IMessageHandlerRefreshConfig = (newConfig: IAppConfig) => void;
type IMessageHandlerResizeWindow = (payload: IWidthHeight) => void;
type IMessageHandlerToggleWindow = () => void;
type IMessageHandlerCenterWindow = () => void;
type IMessageHandlerToggleDevTools = () => void;

type IMessageHandlerAny =
  | IMessageHandlerQuit
  | IMessageHandlerGetConfig
  | IMessageHandlerGetLogBuffer
  | IMessageHandlerRefreshConfig
  | IMessageHandlerResizeWindow
  | IMessageHandlerToggleWindow
  | IMessageHandlerCenterWindow
  | IMessageHandlerToggleDevTools;

export interface IMessageHandlers {
  quit: IMessageHandlerQuit;
  getConfig: IMessageHandlerGetConfig;
  getLogBuffer: IMessageHandlerGetLogBuffer;
  refreshConfig: IMessageHandlerRefreshConfig;
  resizeWindow: IMessageHandlerResizeWindow;
  toggleWindow: IMessageHandlerToggleWindow;
  centerWindow: IMessageHandlerCenterWindow;
  toggleDevTools: IMessageHandlerToggleDevTools;
}

const registered: string[] = [];

/** Handles message from the backend **and** the renderer. */
export function handleMessage(messageId: IMessageKey, callback: IMessageHandlerAny) {
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
