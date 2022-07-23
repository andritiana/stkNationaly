import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export function sameValidator(
  controlPath1: string,
  controlPath2: string
): ValidatorFn {
  return (control) => {
    if (control instanceof FormControl) {
      throw new Error(
        'The "sameValidator" validator must be used on a FormGroup'
      );
    } else if (control instanceof FormGroup) {
      const [value1, value2] = [controlPath1, controlPath2].map(
        (path) => control.get(path).value
      );
      if (value1 === value2) {
        return null;
      } else {
        return {
          same: true,
        };
      }
    }
  };
}
