;(function () {
  const { $ } = window.app.utils.dom

  // returns a preferred opener app text for the app field ghost text
  // (like `vscode` for markdown files)
  function getPreferredOpenWith(text = '') {
    const rules = window.app.config.openWith
    const rexs = Object.keys(rules)
    for (let i = 0; i < rexs.length; i++) {
      const rex = new RegExp(rexs[i])
      const cmd = rules[rexs[i]]
      if (rex.test(text)) {
        return cmd
      }
    }
    return ''
  }

  window.app.runtime.getPreferredOpenWith = getPreferredOpenWith
})()
