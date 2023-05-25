import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'method',
  pure: true,
  standalone: true,
})
export class PurifyMethodPipe<Arg0, Args, R> implements PipeTransform {

  transform(arg0: Arg0, method: (a: Arg0, ...arg: Args[]) => R, ...otherArgs: Args[]): R {
    return method(arg0, ...otherArgs);
  }

}
