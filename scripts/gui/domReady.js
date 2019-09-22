// OBSOLETE / PENDING

import context from '../context'

// dom ready as promise
function domReady() {
  return new Promise((resolve, reject) => {
    context.document.addEventListener('DOMContentLoaded', () => {
      resolve()
    })
  })
}

export default domReady
