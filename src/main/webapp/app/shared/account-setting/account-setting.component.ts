import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'app/login/login.service';

@Component({
  selector: 'medi-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss'],
})
export class AccountSettingComponent {
  constructor(private loginService: LoginService, private router: Router, private ngZone: NgZone) {}

  logout(): void {
    this.loginService.logout();
    this.ngZone.run(() => {
      this.router.navigateByUrl('/');
    });
  }
}
