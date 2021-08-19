import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../shared/shared.module';
import { RegisterModule } from './../../account/register/register.module';

import { UserManagementComponent } from './list/user-management.component';
import { UserManagementDetailComponent } from './detail/user-management-detail.component';
import { UserManagementUpdateComponent } from './update/user-management-update.component';
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
    UserManagementRegisterComponent,
    UserManagementComponent,
    UserManagementDetailComponent,
    UserManagementUpdateComponent,
    LanguagePipe,
    RolePipe,
  ],
  exports: [ UserManagementComponent]
})
export class UserManagementModule {}
