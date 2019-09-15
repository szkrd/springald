const path = require('path');
const os = require('os');

// this will be the text we can search against
function getSearchableText (item) {
  let prefix = '';
  let separator = path.sep;
  let homeDir = os.homedir();
  let itemPath = item.path;
  if (item.type === 'FB_MENUITEM') {
    prefix = 'fb:';
    separator = '/';
  } else if (item.type === 'PATHITEM') {
    prefix = 'p:';
  } else if (item.type === 'DIRITEM') {
    prefix = 'd:';
  }
  if (item.type === 'PATHITEM' || item.type === 'DIRITEM') {
    itemPath = itemPath.replace(homeDir, '~');
  }
  return (prefix + itemPath + separator + item.name)
    .replace(/\/+/g, '/'); // fb root level and extra separator
}

module.exports = getSearchableText;
