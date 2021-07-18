import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truefalse'
})
export class TruefalsePipe implements PipeTransform {

  transform(value: any): unknown {
    return value ? "Yes" : "No";
  }

}
