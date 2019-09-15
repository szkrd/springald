const context = require('../context')

function getElementById(elementId) {
  return context.document.getElementById(elementId)
}

module.exports = getElementById
