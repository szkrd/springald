import { log } from '../../shared/log';
import { sharedConfig } from '../shared/sharedConfig';
import { getSearchableText } from './parsing/getSearchableText';
import { parseDirs } from './parsing/parseDirs';
import { parseFluxboxMenu } from './parsing/parseFluxboxMenu';
import { parsePath } from './parsing/parsePath';
import { processPostParseHooks } from './parsing/postParsingHooks/processPostParseHooks';

export interface IParseModuleError extends NodeJS.ErrnoException {
  /** Location where the parser failed. Directory parsing error is not a show-stopper, that will never reject. */
  module: 'parseFluxboxMenu' | 'parsePath';
}

export interface ISearchItem {
  /** ID of the item: type prefix (fb, p, d) + number. Ex.: `"p299"`. */
  id: string; // Ex.: "p299",
  /** Is the file executable? */
  executable: boolean;
  /** Item type: **fluxbox** menu item, item found on **path**, item found in config's **directories** section. Ex.: `"PATHITEM"`. */
  type: 'UNSET' | 'FB_MENUITEM' | 'PATHITEM' | 'DIRITEM';
  /** Path of the file, without the filename itself. Ex.: `"C:/Program Files/Git/mingw64/bin"`. */
  path: string;
  /** Filename part. Ex.: `"curl.exe"`. */
  name: string;
  /** Is this a linux _.desktop_ file? */
  desktop?: boolean;
  /** Executable command. Ex.: `"C:/Program Files/Git/mingw64/bin/curl.exe"`. */
  command: string;
  /** Searchable text. Usually a marker prefix and the full path+filename combo. Ex.: `"p:C:/Program Files/Git/mingw64/bin/curl.exe"`. */
  searchableText?: string;
  /**
   * Fairly late (post-parse) in the parsing we can decide to mark items as unneeded (for example `NoDisplay` in xdg desktop files);
   * Since we mutate the search item at this point, deleting will take place in a later step, the `hidden` prop piggybacks here.
   */
  hidden?: boolean;
}

export async function parseAll(searchItems: ISearchItem[] = []) {
  searchItems = searchItems || [];
  searchItems.length = 0;
  const startedAt = Date.now();
  const config = sharedConfig;
  const fbMenuFile = config.fluxboxMenuFile;
  const dirCount = Array.isArray(config.directories) ? config.directories.length : 0;

  // tha main parsing (fluxbox, paths, dirs)
  const promises = [
    config.fluxboxMenuFile === false ? null : parseFluxboxMenu(fbMenuFile as string),
    config.skipPathParsing === true ? null : parsePath(),
    dirCount === 0 ? null : parseDirs(),
  ];

  let itemPacks: (ISearchItem[] | null)[] = [null, null, null]; // 0:fb, 1:path, 2:dir
  try {
    itemPacks = await Promise.all(promises);
    console.log('debug', itemPacks);
  } catch (err) {
    log.error(`☠️ Parse error in parser module "${(err as IParseModuleError).module || 'unknown'}"!\n`, err);
  }

  // collect stats for log info
  const count = (val) => (Array.isArray(val) ? val.length : 0);
  const counts = { flux: count(itemPacks[0]), path: count(itemPacks[1]), dirs: count(itemPacks[2]) };

  // flatten results
  itemPacks.forEach((items) => {
    if (items) {
      searchItems.push.apply(searchItems, items);
    }
  });

  // add the searchable text, which shall be unified for all item types
  // (and it must be available for the search AND the gui)
  searchItems.forEach((item) => {
    item.searchableText = getSearchableText(item);
  });

  if (config.betaFeatures) {
    try {
      await processPostParseHooks(searchItems);
    } catch (err) {
      log.error(`☠️ Post parsing hook error!\n`, err);
    }
  }

  // remove nulls and hidden files
  searchItems = searchItems.filter((x) => x).filter((item) => !item.hidden);

  const endedAt = Date.now();
  log.info(
    `Parsed ${searchItems.length} items in ${endedAt - startedAt} ms.\n` +
      `(fluxbox: ${counts.flux}, paths: ${counts.path}, dirs: ${counts.dirs})`,
  );
  return searchItems;
}
