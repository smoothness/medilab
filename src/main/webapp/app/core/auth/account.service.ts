import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { StateStorageService } from './../../core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account, Patient, Doctor } from './../../core/auth/account.model';
import {PatientService} from "../../entities/patient/service/patient.service";
import {DoctorService} from "../../entities/doctor/service/doctor.service";

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account | null>;

  constructor(
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {}

  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => of(null)),
        tap((account: Account | null) => {
          this.authenticate(account);

          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          // unless user have choosed other language in the current session
          if (!this.sessionStorageService.retrieve('locale') && account) {
            this.translateService.use(account.langKey);
          }

          if (account) {
            this.navigateToStoredUrl();
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  formatUserIdentity(): Observable<{}>{
    return new Observable<{}>(subscriber => {
      this.identity().subscribe(
        (account) => {
          if(account?.authorities[0] === "ROLE_PATIENT"){
            this.patientService.findOneByInternalUser(account.id).subscribe((res: any) => {
              console.log("JUAN PEREZ", res);
              res.body.internalUser = account;
              subscriber.next(new Patient(res.body));
              subscriber.complete();
            });
          }else{
            if(account?.authorities[0] === "ROLE_USER"){
              if(account.authorities[1] === "ROLE_ADMIN"){
                subscriber.next(new Account(<any>account));
                subscriber.complete();
              }else{
                this.doctorService.findByInternalUser(account.id).subscribe((res: any) => {
                  res.body.internalUser = account;
                  subscriber.next(new Doctor(res.body));
                  subscriber.complete();
                })
              }
            }

          }
        }
      )
    })
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  retrieveUserById(userId: number): Observable<{}> {
    return this.http.get(this.getUrl(`api/user/${userId}`));
  }

  private getUrl(url: string): string {
    return this.applicationConfigService.getEndpointFor(url);
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
