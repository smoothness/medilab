import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';

@NgModule({
  declarations: [UpdatePasswordComponent, ConfirmPasswordComponent, PasswordStrengthBarComponent],
  exports: [UpdatePasswordComponent, ConfirmPasswordComponent, PasswordStrengthBarComponent],
  imports: [CommonModule, SharedModule],
})
export class PasswordModule {}
