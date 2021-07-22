import { Routes } from '@angular/router';

import { passwordRoute } from './password/password.route';
import { passwordResetInitRoute } from './password-reset/init/password-reset-init.route';
import { sessionsRoute } from './sessions/sessions.route';
import { settingsRoute } from './settings/settings.route';

const ACCOUNT_ROUTES = [
  passwordRoute,
  passwordResetInitRoute,
  sessionsRoute,
  settingsRoute
];

export const accountState: Routes = [
  {
    path: '',
    children: ACCOUNT_ROUTES,
  },
];
