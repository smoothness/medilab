import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LANGUAGES } from './../../config/language.constants';
import { Account } from './../../core/auth/account.model';
import { AccountService } from './../../core/auth/account.service';
import { ProfileService } from './../../layouts/profiles/profile.service';

@Component({
  selector: 'medi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;

  account: Account | null = null;

  constructor(private accountService: AccountService, private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
    this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
