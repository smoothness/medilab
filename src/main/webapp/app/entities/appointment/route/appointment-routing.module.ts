import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AppointmentComponent } from '../list/appointment.component';
import { AppointmentDetailComponent } from '../detail/appointment-detail.component';
import { AppointmentUpdateComponent } from '../update/appointment-update.component';
import { AppointmentRoutingResolveService } from './appointment-routing-resolve.service';

const appointmentRoute: Routes = [
  {
    path: '',
    component: AppointmentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppointmentDetailComponent,
    resolve: {
      appointment: AppointmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppointmentUpdateComponent,
    resolve: {
      appointment: AppointmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppointmentUpdateComponent,
    resolve: {
      appointment: AppointmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appointmentRoute)],
  exports: [RouterModule],
})
export class AppointmentRoutingModule {}
