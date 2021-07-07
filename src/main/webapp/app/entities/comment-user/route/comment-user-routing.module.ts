import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommentUserComponent } from '../list/comment-user.component';
import { CommentUserDetailComponent } from '../detail/comment-user-detail.component';
import { CommentUserUpdateComponent } from '../update/comment-user-update.component';
import { CommentUserRoutingResolveService } from './comment-user-routing-resolve.service';

const commentUserRoute: Routes = [
  {
    path: '',
    component: CommentUserComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommentUserDetailComponent,
    resolve: {
      commentUser: CommentUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommentUserUpdateComponent,
    resolve: {
      commentUser: CommentUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommentUserUpdateComponent,
    resolve: {
      commentUser: CommentUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commentUserRoute)],
  exports: [RouterModule],
})
export class CommentUserRoutingModule {}
