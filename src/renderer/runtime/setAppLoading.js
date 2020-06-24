;(function () {
  const gracePeriod = 500
  let inGracePeriod = false
  let lastActiveInput
  let timer

  function _setAppLoading(enable) {
    if (enable) {
      lastActiveInput = document.activeElement
    }
    document.body.classList[enable ? 'add' : 'remove']('loading')
    if (!enable) {
      lastActiveInput.focus()
    }
  }

  function setAppLoading(enable) {
    if (enable && !inGracePeriod) {
      inGracePeriod = true
      timer = setTimeout(() => {
        inGracePeriod = false
        _setAppLoading(true)
      }, gracePeriod)
      return
    }
    if (!enable && inGracePeriod) {
      inGracePeriod = false
      clearTimeout(timer)
      return
    }
    _setAppLoading(false)
  }

  window.app.runtime.setAppLoading = setAppLoading
})()
