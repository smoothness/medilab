import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITreatment } from '../treatment.model';
import { TreatmentService } from '../service/treatment.service';

@Component({
  templateUrl: './treatment-delete-dialog.component.html',
})
export class TreatmentDeleteDialogComponent {
  treatment?: ITreatment;

  constructor(protected treatmentService: TreatmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.treatmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
