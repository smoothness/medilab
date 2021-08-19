import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'language',
  pure: false,
})
export class LanguagePipe implements PipeTransform {
  public language: any = {
    es: 'userManagement.langPipe.es',
    en: 'userManagement.langPipe.en',
  };

  constructor(private translateService: TranslateService) {}

  transform(value: any): unknown {
    return this.translateService.instant(this.language[value]);
  }
}
