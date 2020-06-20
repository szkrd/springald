// list of the ipc message names (object keys for IDE help); the rest are just docs
const messages = {
  // returns the full config object
  MSG_GET_CONFIG: '',
}

Object.keys(messages).forEach((key) => {
  messages[key] = key
})

module.exports = messages
