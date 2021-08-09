import { Component } from '@angular/core';

@Component({
  selector: 'medi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isNavbarCollapsed = true;

  /**
   * @description This method is in charge of changing the collapse state of the menu
   */
  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }
}
