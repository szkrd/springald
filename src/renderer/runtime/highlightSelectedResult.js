;(function () {
  function highlightSelectedResult() {
    const { $, $$ } = window.app.utils.dom
    const { store } = window.app
    const all = $$('.result')
    if (store.current < 0) {
      store.current = 0
    }
    if (store.current > all.length - 1) {
      store.current = all.length - 1
    }
    const el = $(`#result-${store.current}`)
    if (el) {
      all.forEach((current) => {
        current.classList.remove('selected')
      })
      el.classList.add('selected')
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  window.app.runtime.highlightSelectedResult = highlightSelectedResult
})()
