import { NgModule } from '@angular/core';

import { SharedModule } from "../shared/shared.module";

import { ViewPatientByTokenComponent } from './view/view-patient-by-token.component';
import { GetPatientByTokenComponent } from "./get/get-patient-by-token.component";
import {RouterModule} from "@angular/router";
import {GET_PATIENT_TOKEN_ROUTE} from "./route/get-patient-by-token.route";
import { PatientModule } from "../entities/patient/patient.module";

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(GET_PATIENT_TOKEN_ROUTE),
    PatientModule,
  ],
  declarations: [
    GetPatientByTokenComponent,
    ViewPatientByTokenComponent
  ],

})
export class GetPatientByTokenModule { }
