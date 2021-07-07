import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BinnacleComponent } from '../list/binnacle.component';
import { BinnacleDetailComponent } from '../detail/binnacle-detail.component';
import { BinnacleUpdateComponent } from '../update/binnacle-update.component';
import { BinnacleRoutingResolveService } from './binnacle-routing-resolve.service';

const binnacleRoute: Routes = [
  {
    path: '',
    component: BinnacleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BinnacleDetailComponent,
    resolve: {
      binnacle: BinnacleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BinnacleUpdateComponent,
    resolve: {
      binnacle: BinnacleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BinnacleUpdateComponent,
    resolve: {
      binnacle: BinnacleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(binnacleRoute)],
  exports: [RouterModule],
})
export class BinnacleRoutingModule {}
