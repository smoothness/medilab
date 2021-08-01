import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EmergencyContactService } from '../service/emergency-contact.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

import { EmergencyFormComponent } from '../../../account/register/emergency-contact/emergency-form/emergency-form.component';

import { ContactData, IEmergencyContact } from '../emergency-contact.model';

@Component({
  selector: 'medi-emergency-contact-register',
  templateUrl: './emergency-contact-register.component.html',
  styleUrls: ['./emergency-contact-register.component.scss'],
})
export class EmergencyContactRegisterComponent {
  @Input() patientId = -1;
  @ViewChild('formElement', { static: true, read: EmergencyFormComponent })
  public container!: EmergencyFormComponent;
  public emergencyContactData?: any;

  public constructor(
    protected emergencyContactService: EmergencyContactService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public sweetAlertService: SweetAlertService
  ) {}

  public get contactForm(): FormGroup {
    return this.container.emergencyContactForm;
  }

  public get contactData(): ContactData {
    return <ContactData>this.contactForm.value;
  }

  public get formatContactData(): IEmergencyContact {
    return {
      name: `${this.contactData.name} ${this.contactData.lastname} ${this.contactData.secondlastname || ''}`,
      phone: this.contactData.phone,
      email: this.contactData.email,
      relationShip: this.contactData.relationship,
      patient: {
        id: this.patientId,
      },
    };
  }

  public previousState(): void {
    window.history.back();
  }

  public save(): void {
    this.emergencyContactService.create(this.formatContactData).subscribe(
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
}
