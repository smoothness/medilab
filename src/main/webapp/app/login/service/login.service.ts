import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Account } from './../../core/auth/account.model';
import { AccountService } from './../../core/auth/account.service';
import { AuthServerProvider } from './../../core/auth/auth-session.service';
import { ApplicationConfigService } from './../../core/config/application-config.service';
import { Login } from './../login.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private applicationConfigService: ApplicationConfigService,
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider
  ) {}

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logoutUrl(): string {
    return this.applicationConfigService.getEndpointFor('api/logout');
  }

  logoutInClient(): void {
    this.accountService.authenticate(null);
  }

  logout(): Observable<any> {
    return this.authServerProvider.logout();
  }
}
