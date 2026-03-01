import { ISearchItem } from '../runtime/parseAll';

export interface ISharedStore {
  /** Current value of the "app" input field on the right. */
  withApp: string;
  /** Current selected item index. Arrow Up/Down increases/decreases the value. */
  current: number;
  /** Ghost text of the "app" input field. For example by default for "txt" it is "code.cmd". */
  ghost: ISearchItem | null;
  /** Every item that we will search in. */
  searchItems: ISearchItem[];
  /** List of found searchItems that includes (in any way) the text we are looking for. */
  found: ISearchItem[];
}

export const sharedStore: ISharedStore = {
  withApp: '',
  current: 0,
  ghost: null,
  searchItems: [],
  found: [],
};
