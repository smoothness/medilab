import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmergencyContactComponent } from '../list/emergency-contact.component';
import { EmergencyContactDetailComponent } from '../detail/emergency-contact-detail.component';
import { EmergencyContactUpdateComponent } from '../update/emergency-contact-update.component';
import { EmergencyContactRoutingResolveService } from './emergency-contact-routing-resolve.service';

const emergencyContactRoute: Routes = [
  {
    path: ':id/view',
    component: EmergencyContactDetailComponent,
    resolve: {
      emergencyContact: EmergencyContactRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmergencyContactUpdateComponent,
    resolve: {
      emergencyContact: EmergencyContactRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmergencyContactUpdateComponent,
    resolve: {
      emergencyContact: EmergencyContactRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emergencyContactRoute)],
  exports: [RouterModule],
})
export class EmergencyContactRoutingModule {}
