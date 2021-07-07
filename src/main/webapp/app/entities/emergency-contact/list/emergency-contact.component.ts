import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmergencyContact } from '../emergency-contact.model';
import { EmergencyContactService } from '../service/emergency-contact.service';
import { EmergencyContactDeleteDialogComponent } from '../delete/emergency-contact-delete-dialog.component';

@Component({
  selector: 'medi-emergency-contact',
  templateUrl: './emergency-contact.component.html',
})
export class EmergencyContactComponent implements OnInit {
  emergencyContacts?: IEmergencyContact[];
  isLoading = false;

  constructor(protected emergencyContactService: EmergencyContactService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.emergencyContactService.query().subscribe(
      (res: HttpResponse<IEmergencyContact[]>) => {
        this.isLoading = false;
        this.emergencyContacts = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEmergencyContact): number {
    return item.id!;
  }

  delete(emergencyContact: IEmergencyContact): void {
    const modalRef = this.modalService.open(EmergencyContactDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.emergencyContact = emergencyContact;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
