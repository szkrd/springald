const os = require('os');
const isWin = /^win/.test(os.platform());

// this will be the text we can search against
function getSearchableText (item) {
  let prefix = '';
  let text = '';
  let separator = isWin ? '\\' : '/';
  if (item.type === 'FB_MENUITEM') {
    prefix = 'fb:';
    separator = '/';
  } else if (item.type === 'PATHITEM') {
    prefix = 'p:';
  } else if (item.type === 'DIRITEM') {
    prefix = 'd:';
  }
  return (prefix + item.path + separator + item.name)
    .replace(/\/+/g, '/'); // fb root level and extra separator
}

module.exports = getSearchableText;
