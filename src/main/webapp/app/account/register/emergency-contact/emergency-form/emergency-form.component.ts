import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { EmergencyContact } from './../../register.model';

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

  removeContact(): void {
    this.parentReference.removeForm(this.index);
  }

  setInitData(parent: any, pIndex: number): void {
    this.index = pIndex;
    this.parentReference = parent;
  }
}
