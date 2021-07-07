import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommentUserComponent } from './list/comment-user.component';
import { CommentUserDetailComponent } from './detail/comment-user-detail.component';
import { CommentUserUpdateComponent } from './update/comment-user-update.component';
import { CommentUserDeleteDialogComponent } from './delete/comment-user-delete-dialog.component';
import { CommentUserRoutingModule } from './route/comment-user-routing.module';

@NgModule({
  imports: [SharedModule, CommentUserRoutingModule],
  declarations: [CommentUserComponent, CommentUserDetailComponent, CommentUserUpdateComponent, CommentUserDeleteDialogComponent],
  entryComponents: [CommentUserDeleteDialogComponent],
})
export class CommentUserModule {}
