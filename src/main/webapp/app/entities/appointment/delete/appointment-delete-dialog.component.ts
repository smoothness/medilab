import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';

@Component({
  templateUrl: './appointment-delete-dialog.component.html',
})
export class AppointmentDeleteDialogComponent {
  appointment?: IAppointment;

  constructor(protected appointmentService: AppointmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appointmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
