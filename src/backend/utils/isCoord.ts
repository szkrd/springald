/** Checks if value is number[] with two items */
export function isCoord(val: [number, number]) {
  return Array.isArray(val) && val.length === 2 && val.every((item) => typeof item === 'number');
}
