const spawn = require('child_process').spawn;

// right now not needed, it's just a dummy
function superchildFallback (command) {
  spawn(command);
}

module.exports = superchildFallback;
