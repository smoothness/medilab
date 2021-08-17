import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbAccordion} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'medi-treatment-register',
  templateUrl: './treatment-register.component.html',
  styleUrls: ['./treatment-register.component.scss']
})
export class TreatmentRegisterComponent {
  @ViewChild('acc', {static: true }) public acc?: NgbAccordion;
  public showTitle = false;
  public parentReference: any;
  public index = 0;
  public isVisible = false;
  public registerForm: FormGroup = this.fb.group({
    medicines: ['',[Validators.required]],
    duration: ['',[Validators.required]],
    specifications: ['',[Validators.required]],
    removed: [false]
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

  public get panelId(): string {
    return `panel${this.index}`;
  }

  public setInitData(parent: any, pIndex: number): void {
    this.parentReference = parent;
    this.updateIndex(pIndex)
  }

  public removeForm(): void {
    this.parentReference.removeForm(this.index);
  }

  public toggleIconState(): void {
    this.isVisible = !this.isVisible;
  }

  public updateIndex(index: number): void {
    this.index = index;
  }
}
