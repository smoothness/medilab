import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'invoicePipe',
  pure: false,
})
export class InvoicePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: any): unknown {
    if (value === 'PENDING') {
      return this.translateService.instant('medilabApp.invoice.pending');
    } else if (value === 'CANCELED') {
      return this.translateService.instant('medilabApp.invoice.canceled');
    } else {
      return this.translateService.instant('medilabApp.invoice.paid');
    }
  }
}
