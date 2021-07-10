import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';


const childRoutes: Routes = [
  {
    path:'personalInfo',
    component: PersonalInfoComponent
  },
  {
    path:'contactInfo',
    component: ContactInfoComponent
  },
  {
    path: 'emergencyContact',
    component: EmergencyContactComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(childRoutes),
  ],
  exports: [RouterModule]

})
export class ChildRoutingModule { }
