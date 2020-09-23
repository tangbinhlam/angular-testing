import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rate',
  pure: true,
})
export class RatePipe implements PipeTransform {
  transform(salary: number, ...args: number[]): unknown {
    return salary / (40 * 52);
  }
}
