import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../shared/shared.module';
import { RegisterModule } from './../../account/register/register.module';

import { UserManagementComponent } from './list/user-management.component';
import { UserManagementDetailComponent } from './detail/user-management-detail.component';
import { UserManagementUpdateComponent } from './update/user-management-update.component';
import { UserManagementDeleteDialogComponent } from './delete/user-management-delete-dialog.component';
import { UserManagementRegisterComponent } from './register/user-management-register.component';

import { userManagementRoute } from './user-management.route';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule.forChild(userManagementRoute), RegisterModule],
  declarations: [
    UserManagementRegisterComponent,
    UserManagementComponent,
    UserManagementDetailComponent,
    UserManagementUpdateComponent,
    UserManagementDeleteDialogComponent,
  ],
  entryComponents: [UserManagementDeleteDialogComponent],
})
export class UserManagementModule {}
