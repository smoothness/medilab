import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'truefalse',
  pure: false
})
export class TruefalsePipe implements PipeTransform {
  constructor(private translateService: TranslateService){}

  transform(value: any): unknown {
    return value ? this.translateService.instant("medilabApp.ailment.active") : this.translateService.instant("medilabApp.ailment.inactive");
  }

}
