// list of the ipc message names (object keys for IDE help); the rest are just docs
// this file is also INCLUDED IN THE RENDERER PROCESS
const messages = {
  MSG_QUIT: '',
  // get the config by the *backend* process
  MSG_GET_CONFIG: '',
  // get the backend log buffer (so that we can show it in the renderer process)
  MSG_GET_LOG_BUFFER: '',
  // send a config object for the backend (which can cache it for itself)
  MSG_REFRESH_CONFIG: '',
  MSG_HIDE_WINDOW: '',
  // payload: { width, height }
  MSG_RESIZE_WINDOW: '',
  MSG_CENTER_WINDOW: '',
  MSG_TOGGLE_WINDOW: '',
  MSG_TOGGLE_DEV_TOOLS: '',
}

Object.keys(messages).forEach((key) => {
  messages[key] = key
})

module.exports = messages
