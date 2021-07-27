import {Component, ViewChild} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEmergencyContact, EmergencyContact } from '../emergency-contact.model';
import { EmergencyContactService } from '../service/emergency-contact.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import {EmergencyFormComponent} from "../../../account/register/emergency-contact/emergency-form/emergency-form.component";
import {SweetAlertService} from "../../../shared/services/sweet-alert.service";


@Component({
  selector: 'medi-emergency-contact-update',
  templateUrl: './emergency-contact-update.component.html',
  styleUrls: ['./emergency-contact-update.component.scss']
})
export class EmergencyContactUpdateComponent {
  @ViewChild('formElement', { static: true, read: EmergencyFormComponent })
  public container!: EmergencyFormComponent;
  public emergencyContactData?: any;

  isSaving = false;

  constructor(
    protected emergencyContactService: EmergencyContactService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    protected fb: FormBuilder,
    public sweetAlertService: SweetAlertService
  ) {}

  setEmergencyContactData(emergencyContact: any): void{
    this.emergencyContactData = emergencyContact;
    this.container.addContactData(emergencyContact);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.overrideEmergencyContactData();
    this.subscribeToSaveResponse(this.emergencyContactService.update(this.emergencyContactData));
  }

  overrideEmergencyContactData(): void {
    this.emergencyContactData.relationShip = this.container.emergencyContactForm.value.relationship;
    this.emergencyContactData.email = this.container.emergencyContactForm.value.email;
    this.emergencyContactData.phone = this.container.emergencyContactForm.value.phone;
    this.emergencyContactData.name =
      `${<string>this.container.emergencyContactForm.value.name} ${<string>this.container.emergencyContactForm.value.lastname} ${<string>this.container.emergencyContactForm.value.secondlastname}`;
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmergencyContact>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => {
        this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.emergencyContact.success').then(() => {
          this.activeModal.dismiss('Cross click');
        });
      },
      () => {
        this.sweetAlertService.showMsjError('register.messages.error.error', 'medilabApp.emergencyContact.error').then(() => {
          this.activeModal.dismiss('Cross click');
        });
      }
    );
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
