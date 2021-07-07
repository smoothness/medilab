import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAilment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';

@Component({
  templateUrl: './ailment-delete-dialog.component.html',
})
export class AilmentDeleteDialogComponent {
  ailment?: IAilment;

  constructor(protected ailmentService: AilmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ailmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
