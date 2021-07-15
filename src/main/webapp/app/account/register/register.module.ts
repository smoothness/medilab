import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { PasswordModule } from '../password/password.module';

import { RegisterComponent } from './register.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { EmergencyFormComponent } from './emergency-contact/emergency-form/emergency-form.component';

@NgModule({
  declarations: [RegisterComponent, PersonalInfoComponent, ContactInfoComponent, EmergencyContactComponent, EmergencyFormComponent],
  imports: [SharedModule, CommonModule, ReactiveFormsModule, PasswordModule],
  exports: [RegisterComponent, PersonalInfoComponent, ContactInfoComponent, EmergencyContactComponent, EmergencyFormComponent],
})
export class RegisterModule {}
