const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g

function escapeRegExp(str) {
  return str.replace(matchOperatorsRe, '\\$&')
}

module.exports = escapeRegExp
