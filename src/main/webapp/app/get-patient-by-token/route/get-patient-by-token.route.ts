import { Routes } from '@angular/router';

import { ViewPatientByTokenComponent } from './../view/view-patient-by-token.component';
import { GetPatientByTokenComponent } from './../get/get-patient-by-token.component';

export const GET_PATIENT_TOKEN_ROUTE: Routes = [
  {
    path: 'get',
    component: GetPatientByTokenComponent,
    data: {
      pageTitle: 'get.title',
    }
  },
  {
    path: 'view',
    component: ViewPatientByTokenComponent,
    data: {
      pageTitle: 'view.title',
    }
  }
  ];
