// returns unique items, creates new array
export default function<T>(arr: T[]): T[] {
  return arr.filter((val, i, self) => self.indexOf(val) === i)
}
