import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { registerRoute } from './account/register/register.route';

import { DEBUG_INFO_ENABLED } from './app.constants';
import { LayoutsRoutesModule } from './layouts/layouts-routes.module';
import { activateRoute } from './account/activate/activate.route';
import { passwordResetFinishRoute } from './account/password-reset/finish/password-reset-finish.route';
import { passwordResetInitRoute } from './account/password-reset/init/password-reset-init.route';

const mainRoutes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
  },
  {
    path: 'token',
    loadChildren: () => import('./get-patient-by-token/get-patient-by-token.module').then(m => m.GetPatientByTokenModule),
  },
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  },
  registerRoute,
  activateRoute,
  passwordResetFinishRoute,
  passwordResetInitRoute,
  ...errorRoute,
];

@NgModule({
  imports: [RouterModule.forRoot(mainRoutes), LayoutsRoutesModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
