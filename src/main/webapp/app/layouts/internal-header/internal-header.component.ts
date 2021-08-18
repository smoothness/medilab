import { Component, OnInit } from '@angular/core';
import { VERSION } from './../../app.constants';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'medi-internal-header',
  templateUrl: './internal-header.component.html',
  styleUrls: ['./internal-header.component.scss'],
})
export class InternalHeaderComponent implements OnInit {
  currentUser: any = {};
  isNavbarCollapsed = true;
  version = '';

  constructor(private accountService: AccountService) {}

  public get notificationUser(): any {
    return this.currentUser; /* eslint-disable-line @typescript-eslint/no-unsafe-return */
  }

  ngOnInit(): void {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION;
    }
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
    });
  }

  /**
   * @description This method is in charge of changing the collapse state of the menu
   */
  public collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }
}
