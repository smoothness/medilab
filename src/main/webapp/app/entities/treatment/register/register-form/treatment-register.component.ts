import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'medi-treatment-register',
  templateUrl: './treatment-register.component.html',
  styleUrls: ['./treatment-register.component.scss']
})
export class TreatmentRegisterComponent {
  public showTitle = false;
  public parentReference: any;
  public index = 0;
  public registerForm: FormGroup = this.fb.group({
    medicines: ['',[Validators.required]],
    duration: ['',[Validators.required]],
    specifications: ['',[Validators.required]]
  });

  constructor(private fb: FormBuilder) {
    this.parentReference = '';
  }

  public get formState(): boolean {
    return this.registerForm.invalid;
  }

  public get treatmentFormData(): any {
    return this.registerForm.value;
  }

  public setInitData(parent: any, pIndex: number): void {
    this.parentReference = parent;
    this.updateIndex(pIndex)
  }

  public removeForm(): void {
    this.parentReference.removeForm(this.index);
  }

  public updateIndex(index: number): void {
    this.index = index;
  }

}
