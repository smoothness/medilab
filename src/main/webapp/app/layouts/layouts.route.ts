import { Route } from '@angular/router';
import { mainRoute } from "./main/main.route";

import { LayoutsComponent } from './layouts.component';

export const layoutsRoute: Route = {
  path: '',
  component: LayoutsComponent,
  children: [
    mainRoute
  ]
};