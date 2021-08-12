import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';

import { LandingComponent } from './landing.component';
import { LANDING_ROUTE } from './landing.route';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, RouterModule.forChild([LANDING_ROUTE]), SharedModule],
})
export class LandingModule {}
