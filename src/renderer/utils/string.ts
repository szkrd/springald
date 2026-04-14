import { constants } from '../constants';
const { U_PREFIX, U_POSTFIX } = constants;

export function escapeRegExp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

/** Escape html, but allow underline tags. */
export function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(new RegExp(escapeRegExp(U_PREFIX), 'g'), '<u>')
    .replace(new RegExp(escapeRegExp(U_POSTFIX), 'g'), '</u>');
}

/**
 * Encapsulates string with double quotes if it has spaces (and is not yet qoted).
 * Multiple texts are encapsulated and then joined.
 */
export function quoteSpaces(...texts: string[]) {
  // TODO check on linux with quotes in filename; those will break possibly, quiestion is are they escaped already or do I have to do smg about them
  return texts
    .map((text) => (/\s/.test(text) && !(text.startsWith('"') && text.endsWith('"')) ? `"${text}"` : text))
    .join(' ');
}
