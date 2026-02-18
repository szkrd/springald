import { access, readFile } from 'fs/promises';
import { log } from '../log';

export async function readJsonFile(fileName) {
  try {
    await access(fileName);
  } catch {
    return null;
  }
  let contents = null;
  try {
    contents = await readFile(fileName, 'utf8');
  } catch {
    log.error(`Could not read file "${fileName}"`);
    return null;
  }
  try {
    contents = JSON.parse(contents);
  } catch (err) {
    log.error(`Could not parse json "${fileName}"`, err);
    return null;
  }
  return contents;
}
