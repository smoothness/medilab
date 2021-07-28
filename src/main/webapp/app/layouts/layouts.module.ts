import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';
import { LayoutsRoutesModule } from './layouts-routes.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PageRibbonComponent } from './profiles/page-ribbon.component';
import { ActiveMenuDirective } from './navbar/active-menu.directive';
import { MainComponent } from './main/main.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    ActiveMenuDirective,
    FooterComponent,
    NavbarComponent,
    MainComponent,
    PageRibbonComponent,
    UserProfileComponent
  ],
  exports: [
    ActiveMenuDirective,
    FooterComponent,
    NavbarComponent,
    MainComponent,
    PageRibbonComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LayoutsRoutesModule
  ],
})
export class LayoutsModule {}
