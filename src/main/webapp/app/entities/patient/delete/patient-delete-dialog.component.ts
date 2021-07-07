import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatient } from '../patient.model';
import { PatientService } from '../service/patient.service';

@Component({
  templateUrl: './patient-delete-dialog.component.html',
})
export class PatientDeleteDialogComponent {
  patient?: IPatient;

  constructor(protected patientService: PatientService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.patientService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
