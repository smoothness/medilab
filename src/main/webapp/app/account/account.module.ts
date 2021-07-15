import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RegisterModule } from './register/register.module';
import { PasswordModule } from './password/password.module';

import { SharedModule } from './../shared/shared.module';
import { SessionsComponent } from './sessions/sessions.component';
import { ActivateComponent } from './activate/activate.component';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init.component';
import { PasswordResetFinishComponent } from './password-reset/finish/password-reset-finish.component';
import { SettingsComponent } from './settings/settings.component';
import { accountState } from './account.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(accountState), RegisterModule, PasswordModule],
  declarations: [ActivateComponent, PasswordResetInitComponent, PasswordResetFinishComponent, SessionsComponent, SettingsComponent],
})
export class AccountModule {}
