import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'method',
  pure: true,
  standalone: true,
})
export class PurifyMethodPipe implements PipeTransform {

  transform<Arg0, Args, R>(arg0: Arg0, method: (a: Arg0, ...arg: Args[]) => R, ...otherArgs: Args[]): R {
    return method(arg0, ...otherArgs);
  }

}
