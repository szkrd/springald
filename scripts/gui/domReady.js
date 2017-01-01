// OBSOLETE / PENDING

const context = require('../context');

// dom ready as promise
function domReady () {
  return new Promise((resolve, reject) => {
    context.document.addEventListener('DOMContentLoaded', () => {
      resolve();
    });
  });
}

module.exports = domReady;
