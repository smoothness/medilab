import { Route } from '@angular/router';

import { LoginComponent } from './../view/login.component';

export const LOGIN_ROUTE: Route = {
  path: '',
  component: LoginComponent,
  data: {
    pageTitle: 'login.title',
  },
};
