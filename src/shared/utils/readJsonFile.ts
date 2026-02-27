import { access, readFile } from 'fs/promises';
import { log } from '../log';

export async function readJsonFile(fileName: string): Promise<string | null> {
  try {
    await access(fileName);
  } catch {
    log.error(`No access to file "${fileName}"`);
    return null;
  }
  let contents: string;
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
