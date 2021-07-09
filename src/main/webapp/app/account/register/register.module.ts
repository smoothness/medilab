import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { RegisterComponent } from './register.component';


@NgModule({
  declarations: [
    PersonalInfoComponent,
    ContactInfoComponent,
    EmergencyContactComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
  ],
  exports: [
    PersonalInfoComponent,
    ContactInfoComponent,
    EmergencyContactComponent,
    RegisterComponent
  ]
})
export class RegisterModule { }
