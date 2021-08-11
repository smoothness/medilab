import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { LANGUAGES } from '../../config/language.constants';

@Component({
  selector: 'medi-language-setting',
  templateUrl: './language-setting.component.html',
  styleUrls: ['./language-setting.component.scss'],
})
export class LanguageSettingComponent {
  @Output() menuEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  languages = LANGUAGES;

  constructor(private sessionStorageService: SessionStorageService, private translateService: TranslateService) {}

  /**
   * @description This method is responsible for changing the language of the application
   * @param {desc} languageKey
   */
  public changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
    this.menuEvent.emit(true);
  }
}
