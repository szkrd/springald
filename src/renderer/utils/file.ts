import { platform, homedir } from 'os';
import path from 'path';

const isWin = /^win/.test(platform());
const homeDir = homedir();

/**
 * Determines if a file has executable bit set on Linux,
 * or is an executable by extension (exe, bat, cmd) on Windows.
 */
export function isExecutable(fileExtension: string, fsStatsMode: number) {
  const ox = !!(((fsStatsMode << 6) >> 6) & 1);
  const gx = !!(((fsStatsMode << 3) >> 6) & 1);
  const ux = !!((fsStatsMode >> 6) & 1);
  const exe = /\.(exe|bat|cmd)$/.test(fileExtension);
  return isWin ? exe : ux || gx || ox;
}

/** Returns every directory from the path env var */
export function getPathItems(uniqueOnly = true): string[] {
  const { delimiter } = path;
  const items = (process.env.PATH ?? '').split(delimiter).filter((item) => item.trim());
  return uniqueOnly ? [...new Set(items)] : items;
}

/** Returns duplicate directories from the path env var; it's easy to have duplicates. */
export function getPathDuplicates() {
  const all = getPathItems(false);
  return [...new Set(all.filter((item, index) => all.indexOf(item) !== index))];
}

/**
 * Replaces dirname separators (`\` or `/`) so that they match the OS default.
 * Do NOT use it with filenames where params like `/?` may be present.
 */
export function fixSlashes(fileName: string): string {
  return isWin ? fileName.replace(/\//g, path.sep) : fileName.replace(/\\/g, path.sep);
}

/** Replaces ~ with home dir. */
export function resolveHomeDir(fileName: string) {
  return (fileName || '').replace(/~/, homeDir);
}

/** Replaces home dir with ~. */
export function unresolveHomeDir(fileName: string) {
  return (fileName || '').replace(homedir(), '~');
}

/** Returns filename without extension. */
export function withoutExt(fileName: string) {
  return path.parse(fileName).name;
}
