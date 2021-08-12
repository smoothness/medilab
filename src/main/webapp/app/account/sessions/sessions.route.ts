import { Route } from '@angular/router';

import { UserRouteAccessService } from './../../core/auth/user-route-access.service';
import { SessionsComponent } from './sessions.component';

export const sessionsRoute: Route = {
  path: 'sessions',
  component: SessionsComponent,
  data: {
    pageTitle: 'global.menu.account.sessions',
  },
  canActivate: [UserRouteAccessService],
};
