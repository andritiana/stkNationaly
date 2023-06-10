import { distinctUntilChanged } from 'rxjs';
import { strictDeepEqual } from 'fast-equals';

export const distinctUntilChangedDeep = <T, K>(keySelector?: (v: T) => K) =>
  keySelector
    ? distinctUntilChanged<T, K>((prev, curr) => strictDeepEqual(prev, curr), keySelector)
    : distinctUntilChanged<T>((prev, curr) => strictDeepEqual(prev, curr));
