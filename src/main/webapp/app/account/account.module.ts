import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { SessionsComponent } from './sessions/sessions.component';
import { PasswordStrengthBarComponent } from './password/password-strength-bar/password-strength-bar.component';
import { ActivateComponent } from './activate/activate.component';
import { PasswordComponent } from './password/password.component';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init.component';
import { PasswordResetFinishComponent } from './password-reset/finish/password-reset-finish.component';
import { SettingsComponent } from './settings/settings.component';
import { accountState } from './account.route';
import { RegisterModule } from './register/register.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(accountState), RegisterModule],
  declarations: [
    ActivateComponent,
    PasswordComponent,
    PasswordStrengthBarComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SessionsComponent,
    SettingsComponent,
  ],
})
export class AccountModule {}
