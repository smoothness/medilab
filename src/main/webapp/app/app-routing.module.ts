import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';

import { DEBUG_INFO_ENABLED } from './app.constants';
import { LayoutsRoutesModule } from './layouts/layouts-routes.module';

const mainRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  ...errorRoute,
];

@NgModule({
  imports: [
    RouterModule.forRoot( mainRoutes, { enableTracing: DEBUG_INFO_ENABLED }),
    LayoutsRoutesModule
  ],
  exports: [
    RouterModule
  ],
})
export class AppRoutingModule {}
