import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILineComment } from '../line-comment.model';
import { LineCommentService } from '../service/line-comment.service';

@Component({
  templateUrl: './line-comment-delete-dialog.component.html',
})
export class LineCommentDeleteDialogComponent {
  lineComment?: ILineComment;

  constructor(protected lineCommentService: LineCommentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lineCommentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
