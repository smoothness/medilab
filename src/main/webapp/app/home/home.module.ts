import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
