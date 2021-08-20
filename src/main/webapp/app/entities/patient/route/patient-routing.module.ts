import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PatientDetailComponent } from '../detail/patient-detail.component';
import { PatientRoutingResolveService } from './patient-routing-resolve.service';

const patientRoute: Routes = [
  {
    path: ':id/view',
    component: PatientDetailComponent,
    resolve: {
      patient: PatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(patientRoute)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
