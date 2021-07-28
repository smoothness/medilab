import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { LayoutsModule } from "../layouts/layouts.module"

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([HOME_ROUTE]),
    LayoutsModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
