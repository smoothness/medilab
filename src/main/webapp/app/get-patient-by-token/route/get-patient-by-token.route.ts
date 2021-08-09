import { Routes } from '@angular/router';

import { ViewPatientByTokenComponent } from './../view/view-patient-by-token.component';
import { GetPatientByTokenComponent } from './../get/get-patient-by-token.component';
import {ViewPatientService} from "../service/view-patient.service";

export const GET_PATIENT_TOKEN_ROUTE: Routes = [
  {
    path: 'get',
    component: GetPatientByTokenComponent,
    data: {
      pageTitle: 'token.title',
    }
  },
  {
    path: 'view',
    component: ViewPatientByTokenComponent,
    data: {
      pageTitle: 'token.view.title',
    },
    resolve: {
      patient:  ViewPatientService
    },
  }
  ];
