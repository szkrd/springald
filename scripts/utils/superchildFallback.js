// will we need this?
const spawn = require('child_process').spawn;

function superchildFallback (command) {
  console.error('Superchild fallback NYI');
  spawn(command);
}

module.exports = superchildFallback;
