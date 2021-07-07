import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRatingUser } from '../rating-user.model';
import { RatingUserService } from '../service/rating-user.service';

@Component({
  templateUrl: './rating-user-delete-dialog.component.html',
})
export class RatingUserDeleteDialogComponent {
  ratingUser?: IRatingUser;

  constructor(protected ratingUserService: RatingUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ratingUserService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
