import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UpdatePasswordComponent } from './update-password/update-password.component';

export const passwordRoute: Route = {
  path: 'password',
  component: UpdatePasswordComponent,
  data: {
    pageTitle: 'global.menu.account.password',
  },
  canActivate: [UserRouteAccessService],
};
