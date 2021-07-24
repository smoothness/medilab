import { Routes } from '@angular/router';

import { passwordRoute } from './password/password.route';
import { sessionsRoute } from './sessions/sessions.route';
import { settingsRoute } from './settings/settings.route';

const ACCOUNT_ROUTES = [
  passwordRoute,
  sessionsRoute,
  settingsRoute
];

export const accountState: Routes = [
  {
    path: '',
    children: ACCOUNT_ROUTES,
  },
];
