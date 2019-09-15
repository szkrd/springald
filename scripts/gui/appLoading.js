const context = require('../context')

function appLoading(state) {
  context.document.body.className = state ? 'loading' : ''
}

module.exports = appLoading
