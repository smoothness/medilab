import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { LANGUAGES } from '../../config/language.constants';

@Component({
  selector: 'medi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isNavbarCollapsed = true;
  languages = LANGUAGES;

  constructor(private translateService: TranslateService, private sessionStorageService: SessionStorageService) {}

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }
}
