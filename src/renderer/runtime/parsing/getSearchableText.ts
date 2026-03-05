import path from 'path';
import { ISearchItem } from '../parseAll';
import { unresolveHomeDir } from '../../utils/file';

/**
 * This will be the text we can search against.
 * Usually something like `prefixChar/dir/dir/dir/fileName.ext`.
 */
export function getSearchableText(item: ISearchItem): string {
  let prefix = '';
  let separator = path.sep;
  let itemPath = item.path;
  if (item.type === 'FB_MENUITEM') {
    // an item found in the fluxbox menu file
    prefix = 'fb:';
    separator = '/';
  } else if (item.type === 'PATHITEM') {
    // an item on the path
    prefix = 'p:';
  } else if (item.type === 'DIRITEM') {
    // an item found in the list of extra directories (config)
    prefix = 'd:';
  }
  if (item.type === 'PATHITEM' || item.type === 'DIRITEM') {
    itemPath = unresolveHomeDir(itemPath);
  }
  return (prefix + itemPath + separator + item.name).replace(/\/+/g, '/'); // fb root level and extra separator
}
