import context from '../context'

function appLoading(state) {
  context.document.body.classList[state ? 'add' : 'remove']('loading')
}

export default appLoading
