const context = require('../context')

function appLoading(state) {
  context.document.body.classList[state ? 'add' : 'remove']('loading')
}

module.exports = appLoading
