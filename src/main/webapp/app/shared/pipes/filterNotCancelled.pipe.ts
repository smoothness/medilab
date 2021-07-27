import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNotCancelled',
  pure: false,
})
export class FilterNotCancelled implements PipeTransform {
  transform(items: any[]): any[] {
    return items.filter(item => item.status !== 'CANCELLED');
  }
}
