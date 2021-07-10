import { Route } from '@angular/router';

import { RegisterComponent } from './register.component';

export const registerRoute: Route = {
  path: 'register',
  component: RegisterComponent,
  data: {
    pageTitle: 'register.title',
  },
  loadChildren: () => import('./child-routing.module').then(m => m.ChildRoutingModule)
};
