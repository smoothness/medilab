import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyContact } from '../emergency-contact.model';
import { EmergencyContactService } from '../service/emergency-contact.service';

@Component({
  templateUrl: './emergency-contact-delete-dialog.component.html',
})
export class EmergencyContactDeleteDialogComponent {
  emergencyContact?: IEmergencyContact;

  constructor(protected emergencyContactService: EmergencyContactService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emergencyContactService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
