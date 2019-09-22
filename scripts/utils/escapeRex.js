const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g

function escapeRegExp(str) {
  return str.replace(matchOperatorsRe, '\\$&')
}

export default escapeRegExp
