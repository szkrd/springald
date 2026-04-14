// list of the ipc message names; the rest are just docs
// this file is also INCLUDED IN THE RENDERER PROCESS

export const MSG_QUIT = 'MSG_QUIT';

/** get the config by the *backend* process */
export const MSG_GET_CONFIG = 'MSG_GET_CONFIG';

/** get the backend log buffer (so that we can show it in the renderer process) */
export const MSG_GET_LOG_BUFFER = 'MSG_GET_LOG_BUFFER';

/** send a config object for the backend (which can cache it for itself) */
export const MSG_REFRESH_CONFIG = 'MSG_REFRESH_CONFIG';

export const MSG_HIDE_WINDOW = 'MSG_HIDE_WINDOW';

/** payload: { width, height } */
export const MSG_RESIZE_WINDOW = 'MSG_RESIZE_WINDOW';

export const MSG_CENTER_WINDOW = 'MSG_CENTER_WINDOW';

export const MSG_TOGGLE_WINDOW = 'MSG_TOGGLE_WINDOW';

export const MSG_TOGGLE_DEV_TOOLS = 'MSG_TOGGLE_DEV_TOOLS';

export const MSG_TO_RENDERER_WIN_SHOW = 'MSG_TO_RENDERER_WIN_SHOW';

export const IPC_CHANNEL_NAME_FROM_BACKEND_TO_RENDERER = 'backend-to-renderer';

export type IMessageId =
  | typeof MSG_QUIT
  | typeof MSG_GET_CONFIG
  | typeof MSG_GET_LOG_BUFFER
  | typeof MSG_REFRESH_CONFIG
  | typeof MSG_HIDE_WINDOW
  | typeof MSG_RESIZE_WINDOW
  | typeof MSG_CENTER_WINDOW
  | typeof MSG_TOGGLE_WINDOW
  | typeof MSG_TOGGLE_DEV_TOOLS
  | typeof MSG_TO_RENDERER_WIN_SHOW;
