import { Route } from '@angular/router';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';

import { RegisterComponent } from './register.component';

export const registerRoute: Route = {
  path: 'register',
  component: RegisterComponent,
  data: {
    pageTitle: 'register.title',
  },
  children: [
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
    }
  ]
};
