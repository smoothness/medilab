import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRating } from '../rating.model';
import { RatingService } from '../service/rating.service';

@Component({
  templateUrl: './rating-delete-dialog.component.html',
})
export class RatingDeleteDialogComponent {
  rating?: IRating;

  constructor(protected ratingService: RatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ratingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
