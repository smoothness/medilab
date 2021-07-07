import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PatientComponent } from '../list/patient.component';
import { PatientDetailComponent } from '../detail/patient-detail.component';
import { PatientUpdateComponent } from '../update/patient-update.component';
import { PatientRoutingResolveService } from './patient-routing-resolve.service';

const patientRoute: Routes = [
  {
    path: '',
    component: PatientComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PatientDetailComponent,
    resolve: {
      patient: PatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PatientUpdateComponent,
    resolve: {
      patient: PatientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PatientUpdateComponent,
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
