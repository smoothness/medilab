import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommentUser } from '../comment-user.model';
import { CommentUserService } from '../service/comment-user.service';

@Component({
  templateUrl: './comment-user-delete-dialog.component.html',
})
export class CommentUserDeleteDialogComponent {
  commentUser?: ICommentUser;

  constructor(protected commentUserService: CommentUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commentUserService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
