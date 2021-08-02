import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AilmentComponent } from '../list/ailment.component';
import { AilmentDetailComponent } from '../detail/ailment-detail.component';
import { AilmentUpdateComponent } from '../update/ailment-update.component';
import { AilmentRoutingResolveService } from './ailment-routing-resolve.service';
import { AilmentReportComponent } from '../report/ailment-report.component';

const ailmentRoute: Routes = [
  {
    path: '',
    component: AilmentComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AilmentDetailComponent,
    resolve: {
      ailment: AilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AilmentUpdateComponent,
    resolve: {
      ailment: AilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AilmentUpdateComponent,
    resolve: {
      ailment: AilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'ailment-report',
    component: AilmentReportComponent,
    resolve: {
      ailment: AilmentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ailmentRoute)],
  exports: [RouterModule],
})
export class AilmentRoutingModule {}
