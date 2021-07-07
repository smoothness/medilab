import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDoctor } from '../doctor.model';
import { DoctorService } from '../service/doctor.service';

@Component({
  templateUrl: './doctor-delete-dialog.component.html',
})
export class DoctorDeleteDialogComponent {
  doctor?: IDoctor;

  constructor(protected doctorService: DoctorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.doctorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
