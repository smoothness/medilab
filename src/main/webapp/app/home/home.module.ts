import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([HOME_ROUTE])
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
