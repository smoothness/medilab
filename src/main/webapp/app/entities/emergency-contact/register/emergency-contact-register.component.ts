import {Component, Input, ViewChild} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEmergencyContact } from '../emergency-contact.model';
import { EmergencyContactService } from '../service/emergency-contact.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import {EmergencyFormComponent} from "../../../account/register/emergency-contact/emergency-form/emergency-form.component";
import {SweetAlertService} from "../../../shared/services/sweet-alert.service";

@Component({
  selector: 'medi-emergency-contact-register',
  templateUrl: './emergency-contact-register.component.html',
  styleUrls: ['./emergency-contact-register.component.scss']
})
export class EmergencyContactRegisterComponent {
  @Input() patientId = -1;
  @ViewChild('formElement', {static: true, read: EmergencyFormComponent})
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
  ) { }

  get contactData(): any{
    return <{}>this.container.emergencyContactForm.value;
  }

  get formatContactData(): any {
    return {
      name: `${<string>this.contactData.name} ${<string>this.contactData.lastname} ${<string>this.contactData.secondlastname}`,
      phone: this.contactData.phone,
      email: this.contactData.email,
      relationShip: this.contactData.relationship,
      patient: {
        id: this.patientId
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.emergencyContactService.create(this.formatContactData));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmergencyContact>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => {
        this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.emergencyContact.success').then(() => {
          this.activeModal.close('register');
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
