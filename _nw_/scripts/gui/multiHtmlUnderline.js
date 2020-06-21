const escapeRex = require('../utils/escapeRex')
const consts = require('../consts')

function multiHtmlUnderline(text, needles) {
  const prefix = consts.U_PREFIX
  const postfix = consts.U_POSTFIX
  needles = Array.isArray(needles) ? [...new Set(needles)] : [needles]
  needles.forEach((needle) => {
    text = text.replace(new RegExp(escapeRex(needle), 'gi'), (match) => prefix + match + postfix)
  })
  return text
}

module.exports = multiHtmlUnderline
