import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { registerRoute } from './account/register/register.route';

import { DEBUG_INFO_ENABLED } from './app.constants';
import { LayoutsRoutesModule } from './layouts/layouts-routes.module';
import { activateRoute } from "./account/activate/activate.route";
import { passwordResetFinishRoute } from "./account/password-reset/finish/password-reset-finish.route";

const mainRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  registerRoute,
  activateRoute,
  passwordResetFinishRoute,
  ...errorRoute,
];

@NgModule({
  imports: [RouterModule.forRoot(mainRoutes, { enableTracing: DEBUG_INFO_ENABLED }), LayoutsRoutesModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
