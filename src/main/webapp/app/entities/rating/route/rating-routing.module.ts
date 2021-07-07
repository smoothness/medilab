import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RatingComponent } from '../list/rating.component';
import { RatingDetailComponent } from '../detail/rating-detail.component';
import { RatingUpdateComponent } from '../update/rating-update.component';
import { RatingRoutingResolveService } from './rating-routing-resolve.service';

const ratingRoute: Routes = [
  {
    path: '',
    component: RatingComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RatingDetailComponent,
    resolve: {
      rating: RatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RatingUpdateComponent,
    resolve: {
      rating: RatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RatingUpdateComponent,
    resolve: {
      rating: RatingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ratingRoute)],
  exports: [RouterModule],
})
export class RatingRoutingModule {}
