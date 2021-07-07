import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RatingUserComponent } from '../list/rating-user.component';
import { RatingUserDetailComponent } from '../detail/rating-user-detail.component';
import { RatingUserUpdateComponent } from '../update/rating-user-update.component';
import { RatingUserRoutingResolveService } from './rating-user-routing-resolve.service';

const ratingUserRoute: Routes = [
  {
    path: '',
    component: RatingUserComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RatingUserDetailComponent,
    resolve: {
      ratingUser: RatingUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RatingUserUpdateComponent,
    resolve: {
      ratingUser: RatingUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RatingUserUpdateComponent,
    resolve: {
      ratingUser: RatingUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ratingUserRoute)],
  exports: [RouterModule],
})
export class RatingUserRoutingModule {}
