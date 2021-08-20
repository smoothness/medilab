import { Routes } from '@angular/router';

import { Authority } from './config/authority.constants';
import { UserRouteAccessService } from './core/auth/user-route-access.service';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: '',
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./entities/entity-routing.module').then(m => m.EntityRoutingModule),
  },
  {
    path: 'account',
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
  },
];
