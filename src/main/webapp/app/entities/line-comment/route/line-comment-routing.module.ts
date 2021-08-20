import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LineCommentComponent } from '../list/line-comment.component';
import { LineCommentDetailComponent } from '../detail/line-comment-detail.component';
import { LineCommentUpdateComponent } from '../update/line-comment-update.component';
import { LineCommentRoutingResolveService } from './line-comment-routing-resolve.service';

const lineCommentRoute: Routes = [
  {
    path: ':id/view',
    component: LineCommentDetailComponent,
    resolve: {
      lineComment: LineCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LineCommentUpdateComponent,
    resolve: {
      lineComment: LineCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LineCommentUpdateComponent,
    resolve: {
      lineComment: LineCommentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lineCommentRoute)],
  exports: [RouterModule],
})
export class LineCommentRoutingModule {}
