import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { LayoutsModule } from '../layouts/layouts.module';

@NgModule({
  imports: [ReactiveFormsModule, SharedModule, RouterModule.forChild([HOME_ROUTE]), LayoutsModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
