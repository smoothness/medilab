import {
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {TreatmentRegisterComponent} from "./register-form/treatment-register.component"

@Component({
  selector: 'medi-treatment-create-form',
  templateUrl: './treatment-create-form.component.html',
  styleUrls: ['./treatment-create-form.component.scss']
})
export class TreatmentCreateFormComponent {
  @Input() showRegisterTitle = false;
  @ViewChild('containerForms', { static: true, read: ViewContainerRef })
  public formsParent!: ViewContainerRef;
  public formTreatmentsComponents: ComponentRef<TreatmentRegisterComponent>[] = [];

  constructor(private formCreator: ComponentFactoryResolver) {

  }

  public get treatmentsData(): any[] {
    return Array.from(this.formTreatmentsComponents, component => component.instance.treatmentFormData);
  }

  public get treatmentsForms(): any[] {
    return Array.from(this.formTreatmentsComponents, component => component.instance.registerForm);
  }

  public get isAllValid(): boolean {
    return this.treatmentsForms.every(form => form.valid === true);
  }

  public get formFactory(): ComponentFactory<TreatmentRegisterComponent> {
    return this.formCreator.resolveComponentFactory(TreatmentRegisterComponent);
  }

  public createComponent(): void {
    const formComponent = this.formsParent.createComponent(this.formFactory);
    formComponent.instance.showTitle = this.showRegisterTitle;
    formComponent.instance.setInitData(this, this.formTreatmentsComponents.length);
    this.formTreatmentsComponents.push(formComponent);
  }

  public removeForm(pIndex: number): void {
    for (let i = 0; i < this.formTreatmentsComponents.length; i++) {
      const currentElement = this.formTreatmentsComponents[i];
      if(i === pIndex) {
        currentElement.destroy();
        this.formTreatmentsComponents.splice(pIndex, 1);
      }
    }
    this.updateFormTreatmentsIndex();
  }

  protected updateFormTreatmentsIndex(): void {
    for (let i = 0; i < this.formTreatmentsComponents.length; i++) {
      const currentElement = this.formTreatmentsComponents[i];
      currentElement.instance.updateIndex(i);
    }
  }
}
