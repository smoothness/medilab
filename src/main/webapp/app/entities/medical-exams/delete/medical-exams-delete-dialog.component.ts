import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicalExams } from '../medical-exams.model';
import { MedicalExamsService } from '../service/medical-exams.service';

@Component({
  templateUrl: './medical-exams-delete-dialog.component.html',
})
export class MedicalExamsDeleteDialogComponent {
  medicalExams?: IMedicalExams;

  constructor(protected medicalExamsService: MedicalExamsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medicalExamsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
