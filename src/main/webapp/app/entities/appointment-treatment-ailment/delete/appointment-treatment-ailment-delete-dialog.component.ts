import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';
import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';

@Component({
  templateUrl: './appointment-treatment-ailment-delete-dialog.component.html',
})
export class AppointmentTreatmentAilmentDeleteDialogComponent {
  appointmentTreatmentAilment?: IAppointmentTreatmentAilment;

  constructor(protected appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.appointmentTreatmentAilmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
