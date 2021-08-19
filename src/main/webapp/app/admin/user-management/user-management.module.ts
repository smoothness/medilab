import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../shared/shared.module';
import { RegisterModule } from './../../account/register/register.module';

import { UserManagementComponent } from './list/user-management.component';
import { UserManagementRegisterComponent } from './register/user-management-register.component';

import { userManagementRoute } from './user-management.route';
import { LanguagePipe } from './pipe/language.pipe';
import { RolePipe } from './pipe/role.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RegisterModule,
    RouterModule.forChild(userManagementRoute),
  ],
  declarations: [
    RolePipe,
    LanguagePipe,
    UserManagementRegisterComponent,
    UserManagementComponent,
  ],
  exports: [ UserManagementComponent ]
})
export class UserManagementModule {}
