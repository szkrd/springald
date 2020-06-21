/**
 * get matching open with string from config
 *
 * @param text {string}    plain text
 * @param rules {Object}   object with rex string as key, cmd as value
 * @returns {string}
 */
module.exports = function getOpenWith(text, rules = {}) {
  rules = rules || {}
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
