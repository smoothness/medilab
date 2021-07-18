import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { appRoutes } from './../app.routes';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: appRoutes,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsRoutesModule {}
