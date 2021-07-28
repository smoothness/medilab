import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'medi-emergency-form',
  templateUrl: './emergency-form.component.html',
  styleUrls: ['./emergency-form.component.scss'],
})
export class EmergencyFormComponent {
  public index = 0;
  public emergencyContactForm = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    secondlastname: [''],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required]],
    relationship: ['', [Validators.required]],
  });
  public parentReference: any;

  constructor(private fb: FormBuilder) {
    this.parentReference = '';
  }

  public addContactData({
    name,
    email,
    phone,
    relationShip: relationship,
  }: {
    name: string;
    phone: string;
    email: string;
    relationShip: string;
  }): void {
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

  setInitData(parent: any, pIndex: number): void {
    this.index = pIndex;
    this.parentReference = parent;
  }

  clearForm(): void {
    this.emergencyContactForm.reset();
  }
}
