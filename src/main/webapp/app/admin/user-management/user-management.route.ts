import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { User, IUser } from './user-management.model';
import { UserManagementService } from './service/user-management.service';
import { UserManagementRegisterComponent } from './register/user-management-register.component';
import {SettingsComponent} from "../../account/settings/settings.component";

@Injectable({ providedIn: 'root' })
export class UserManagementResolve implements Resolve<IUser> {
  constructor(private service: UserManagementService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUser> {

    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(new User());
  }
}

export const userManagementRoute: Routes = [
  {
    path: 'new',
    component: UserManagementRegisterComponent,
  },
  {
    path: ':login/edit',
    component: SettingsComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
];
