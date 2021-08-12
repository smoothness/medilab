import {
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
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
export class TreatmentCreateFormComponent implements OnInit {
  @ViewChild('containerForms', { static: true, read: ViewContainerRef })
  public formsParent!: ViewContainerRef;

  public formTreatmentsComponents: ComponentRef<TreatmentRegisterComponent>[] = [];

  constructor(private formCreator: ComponentFactoryResolver) { }


  public get formFactory(): ComponentFactory<TreatmentRegisterComponent> {
    return this.formCreator.resolveComponentFactory(TreatmentRegisterComponent);
  }

  ngOnInit(): void {
     console.log("");

  }

  public createComponent(): void {
    const formComponent = this.formsParent.createComponent(this.formFactory);
    formComponent.instance.setInitData(this, this.formTreatmentsComponents.length);
    this.formTreatmentsComponents.push(formComponent);
  }
}
