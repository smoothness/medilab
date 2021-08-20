import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { DoctorComponent } from '../list/doctor.component';
import { DoctorDetailComponent } from '../detail/doctor-detail.component';
import { DoctorRoutingResolveService } from './doctor-routing-resolve.service';

const doctorRoute: Routes = [
  {
    path: '',
    component: DoctorComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DoctorDetailComponent,
    resolve: {
      doctor: DoctorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(doctorRoute)],
  exports: [RouterModule],
})
export class DoctorRoutingModule {}
