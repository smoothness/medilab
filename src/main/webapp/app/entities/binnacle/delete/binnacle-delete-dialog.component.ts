import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBinnacle } from '../binnacle.model';
import { BinnacleService } from '../service/binnacle.service';

@Component({
  templateUrl: './binnacle-delete-dialog.component.html',
})
export class BinnacleDeleteDialogComponent {
  binnacle?: IBinnacle;

  constructor(protected binnacleService: BinnacleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.binnacleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
