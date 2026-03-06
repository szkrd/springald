import { access, readFile } from 'fs/promises';
import { log } from '../log';
import { constants } from 'fs';

export async function readJsonFile(fileName: string, quietIfMissing = false): Promise<Record<string, any> | null> {
  try {
    await access(fileName, constants.F_OK);
  } catch {
    if (!quietIfMissing) {
      log.error(`File "${fileName}" doesn't exist.`);
    }
    return null;
  }
  try {
    await access(fileName);
  } catch {
    log.error(`No access to file "${fileName}".`);
    return null;
  }
  let contents: string;
  try {
    contents = await readFile(fileName, 'utf8');
  } catch {
    log.error(`Could not read file "${fileName}".`);
    return null;
  }
  let parsed: Record<string, any>;
  try {
    parsed = JSON.parse(contents);
  } catch (err) {
    log.error(`Could not parse json "${fileName}".`, err);
    return null;
  }
  return parsed;
}
