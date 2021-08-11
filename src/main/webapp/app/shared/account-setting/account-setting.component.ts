import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../login/service/login.service';
import {AccountService} from "../../core/auth/account.service";

@Component({
  selector: 'medi-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss'],
})
export class AccountSettingComponent {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private ngZone: NgZone,
    private accountService: AccountService,
    ) {}

  logout(): void {
    this.loginService.logout().subscribe(
      {
        complete: () => {
          this.accountService.authenticate(null);
          this.ngZone.run(() =>
            this.router.navigateByUrl('/')
          );
        }
      }
    );
  }
}
