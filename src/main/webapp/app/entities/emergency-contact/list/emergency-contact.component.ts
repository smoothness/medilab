import {Component, Input, OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PatientService} from "../../patient/service/patient.service";
import { EmergencyContactService } from '../service/emergency-contact.service';
import { SweetAlertService} from "../../../shared/services/sweet-alert.service";

import { EmergencyContactUpdateComponent } from "../update/emergency-contact-update.component";
import { EmergencyContactRegisterComponent } from "../register/emergency-contact-register.component";

import { IEmergencyContact } from '../emergency-contact.model';

@Component({
  selector: 'medi-emergency-contact',
  templateUrl: './emergency-contact.component.html',
})
export class EmergencyContactComponent implements OnInit {
  @Input() currentUser: any = {};
  emergencyContacts: IEmergencyContact[] = [];

  constructor(
    protected modalService: NgbModal,
    protected patientService: PatientService,
    protected sweetAlertService: SweetAlertService,
    protected emergencyContactService: EmergencyContactService,
  ) {}

  public get emergencyContactsTotal(): number {
    return this.emergencyContacts.length;
  }

  ngOnInit(): void {
    this.loadAllEmergencyContact();
  }

  /**
   * @description this method takes care of removing an emergency contact
   * @param emergencyContact
   */
  public deleteEmergencyContact(emergencyContact: IEmergencyContact): void {
    this.sweetAlertService
      .showConfirmMsg({
        title: 'medilabApp.deleteConfirm.title',
        text: 'medilabApp.deleteConfirm.text',
        confirmButtonText: 'medilabApp.deleteConfirm.confirmButtonText',
        cancelButtonText: 'medilabApp.deleteConfirm.cancelButtonText',
      })
      .then(res => {
        if (res) {
          this.emergencyContactService.delete(<number>emergencyContact.id).subscribe(() => {
            this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.deleteConfirm.titleSuccess').then(() => {
              this.loadAllEmergencyContact();
            });
          });
        }
      });
  }

  /**
   * @description this method is responsible for displaying the component
   *  to create a new emergency contact of the authenticated patient.
   * @param emergencyContact
   */
  public showCreateContactModal(): void {
    const modalRef = this.modalService.open(EmergencyContactRegisterComponent, { centered: true });
    modalRef.componentInstance.patientId = this.currentUser.patientId;
    modalRef.closed.subscribe(reason => {
      if (reason === 'register') {
        this.loadAllEmergencyContact();
      }
    });
  }

  /**
   * @description This method is responsible for bringing all the emergency contacts of the authenticated patient.
   */
  public loadAllEmergencyContact(): void {
    this.patientService.findOneByInternalUser(this.currentUser.id).subscribe(patient => {
      this.emergencyContactService.findByPatientId(<number>patient.body?.id).subscribe((res: any) => {
        this.emergencyContacts = res.body;
      });
    });
  }

  /**
   * @description this method is responsible for displaying the component
   *  to modify an emergency contact of the authenticated patient.
   * @param emergencyContact
   */
  public showModifyContactModal(emergencyContact: IEmergencyContact): void {
    const modalRef = this.modalService.open(EmergencyContactUpdateComponent, { centered: true });
    modalRef.componentInstance.setEmergencyContactData(emergencyContact);
  }




}
