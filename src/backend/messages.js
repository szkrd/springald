// list of the ipc message names (object keys for IDE help); the rest are just docs
// this file is also INCLUDED IN THE RENDERER PROCESS
const messages = {
  MSG_GET_CONFIG: '',
  MSG_HIDE_WINDOW: '',
  // payload: { width, height }
  MSG_RESIZE_WINDOW: '',
}

Object.keys(messages).forEach((key) => {
  messages[key] = key
})

module.exports = messages
