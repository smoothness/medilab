import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedicalExamsDetailComponent } from '../detail/medical-exams-detail.component';
import { MedicalExamsUpdateComponent } from '../update/medical-exams-update.component';
import { MedicalExamsRoutingResolveService } from './medical-exams-routing-resolve.service';

const medicalExamsRoute: Routes = [
  {
    path: ':id/view',
    component: MedicalExamsDetailComponent,
    resolve: {
      medicalExams: MedicalExamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedicalExamsUpdateComponent,
    resolve: {
      medicalExams: MedicalExamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedicalExamsUpdateComponent,
    resolve: {
      medicalExams: MedicalExamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(medicalExamsRoute)],
  exports: [RouterModule],
})
export class MedicalExamsRoutingModule {}
