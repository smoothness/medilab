import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from "./../shared/shared.module";
import { LayoutsRoutesModule } from "./layouts-routes.module";

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PageRibbonComponent } from './profiles/page-ribbon.component';
import { ActiveMenuDirective } from './navbar/active-menu.directive';
import { ErrorComponent } from './error/error.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    ActiveMenuDirective,
    ErrorComponent,
    FooterComponent,
    NavbarComponent,
    MainComponent,
    PageRibbonComponent,
  ],
  exports: [
    ActiveMenuDirective,
    ErrorComponent,
    FooterComponent,
    NavbarComponent,
    MainComponent,
    PageRibbonComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutsRoutesModule,
  ]
})
export class LayoutsModule { }
