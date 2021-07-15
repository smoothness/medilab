import { Route } from '@angular/router';

import { HOME_ROUTE } from './../../home/home.route';

import { MainComponent } from './main.component';

export const mainRoute: Route = {
  path: 'main',
  component: MainComponent,
  children: [HOME_ROUTE],
};
