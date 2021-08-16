import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'status',
  pure: false,
})
export class StatusPipe implements PipeTransform {
  public states: any = {
    PENDING: 'medilabApp.appointment.pipe.pending',
    CANCELED: 'medilabApp.appointment.pipe.canceled',
    FINISHED: 'medilabApp.appointment.pipe.finished',
  };

  constructor(private translateService: TranslateService) {}

  transform(value: any): unknown {
    return this.translateService.instant(this.states[value]);
  }
}
