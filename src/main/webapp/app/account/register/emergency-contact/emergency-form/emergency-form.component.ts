import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { emergencyContactRegisterData } from '../../register.model';

@Component({
  selector: 'medi-emergency-form',
  templateUrl: './emergency-form.component.html',
  styleUrls: ['./emergency-form.component.scss'],
})
export class EmergencyFormComponent {
  @Input() showTitleCount = true;
  public index = 0;
  public emergencyContactForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    secondlastname: [''],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    relationship: ['', [Validators.required]],
  });
  public parentReference: any;

  constructor(private fb: FormBuilder) {
    this.parentReference = '';
  }

  public addContactData({ name, email, phone, relationShip: relationship }: emergencyContactRegisterData): void {
    this.emergencyContactForm.patchValue({
      name: name.split(` `)[0],
      lastname: name.split(` `)[1],
      secondlastname: name.split(` `)[2],
      phone,
      email,
      relationship,
    });
  }

  public removeContact(): void {
    this.parentReference.removeForm(this.index);
  }

  public setInitData(parent: any, pIndex: number): void {
    this.index = pIndex;
    this.parentReference = parent;
  }

  public clearForm(): void {
    this.emergencyContactForm.reset();
  }
}
