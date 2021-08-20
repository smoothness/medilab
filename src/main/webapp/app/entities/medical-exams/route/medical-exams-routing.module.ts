import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedicalExamsUpdateComponent } from '../update/medical-exams-update.component';
import { MedicalExamsRoutingResolveService } from './medical-exams-routing-resolve.service';

const medicalExamsRoute: Routes = [
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
