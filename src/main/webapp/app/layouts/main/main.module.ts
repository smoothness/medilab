import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../shared/shared.module';
import { HomeModule } from './../../home/home.module';

import { MainComponent } from './main.component';
import { LayoutsModule } from '../layouts.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, SharedModule, LayoutsModule, HomeModule],
  exports: [HomeModule],
})
export class MainModule {}
