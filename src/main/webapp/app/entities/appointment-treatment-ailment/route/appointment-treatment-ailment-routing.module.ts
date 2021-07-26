import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AppointmentTreatmentAilmentComponent } from '../list/appointment-treatment-ailment.component';
import { AppointmentTreatmentAilmentDetailComponent } from '../detail/appointment-treatment-ailment-detail.component';
import { AppointmentTreatmentAilmentUpdateComponent } from '../update/appointment-treatment-ailment-update.component';
import { AppointmentTreatmentAilmentRoutingResolveService } from './appointment-treatment-ailment-routing-resolve.service';
import { DiagnosisDetailComponent } from '../diagnosis-detail/diagnosis-detail.component';

const appointmentTreatmentAilmentRoute: Routes = [
  {
    path: '',
    component: AppointmentTreatmentAilmentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppointmentTreatmentAilmentDetailComponent,
    resolve: {
      appointmentTreatmentAilment: AppointmentTreatmentAilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppointmentTreatmentAilmentUpdateComponent,
    resolve: {
      appointmentTreatmentAilment: AppointmentTreatmentAilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppointmentTreatmentAilmentUpdateComponent,
    resolve: {
      appointmentTreatmentAilment: AppointmentTreatmentAilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'detailview/:id',
    component: DiagnosisDetailComponent,
    resolve: {
      appointmentTreatmentAilment: AppointmentTreatmentAilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appointmentTreatmentAilmentRoute)],
  exports: [RouterModule],
})
export class AppointmentTreatmentAilmentRoutingModule {}
