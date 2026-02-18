/**
 * Checks if value is number[] with two items
 * @returns boolean
 */
export function isCoord(val) {
  return Array.isArray(val) && val.length === 2 && val.every((item) => typeof item === 'number');
}
