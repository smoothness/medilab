import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LineCommentComponent } from './list/line-comment.component';
import { LineCommentDetailComponent } from './detail/line-comment-detail.component';
import { LineCommentUpdateComponent } from './update/line-comment-update.component';
import { LineCommentDeleteDialogComponent } from './delete/line-comment-delete-dialog.component';
import { LineCommentRoutingModule } from './route/line-comment-routing.module';

@NgModule({
  imports: [SharedModule, LineCommentRoutingModule],
  declarations: [LineCommentComponent, LineCommentDetailComponent, LineCommentUpdateComponent, LineCommentDeleteDialogComponent],
  entryComponents: [LineCommentDeleteDialogComponent],
  exports: [LineCommentComponent, LineCommentUpdateComponent, LineCommentDeleteDialogComponent],
})
export class LineCommentModule {}
