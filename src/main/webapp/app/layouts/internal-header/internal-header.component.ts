import { Component, OnInit } from '@angular/core';
import { VERSION } from './../../app.constants';

@Component({
  selector: 'medi-internal-header',
  templateUrl: './internal-header.component.html',
  styleUrls: ['./internal-header.component.scss'],
})
export class InternalHeaderComponent implements OnInit {
  isNavbarCollapsed = true;
  version = '';

  ngOnInit(): void {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION;
    }
  }

  /**
   * @description This method is in charge of changing the collapse state of the menu
   */
  public collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }
}
