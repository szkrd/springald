const fs = require('fs');
const path = require('path');
const distDir = path.join(path.dirname(process.argv[1]), '..', 'dist');
fs.rm(distDir, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error(err);
    process.exitCode = 1;
    return;
  }
});
