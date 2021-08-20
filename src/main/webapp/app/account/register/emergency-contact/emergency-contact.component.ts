import {
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnInit,
  ComponentFactory,
  ComponentRef,
  ViewChild,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';


import { EmergencyFormComponent } from './emergency-form/emergency-form.component';
import { EmergencyContact } from './../register.model';

@Component({
  selector: 'medi-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss'],
})
export class EmergencyContactComponent implements OnInit {
  @ViewChild('containerForms', { static: true, read: ViewContainerRef })
  public formsParent!: ViewContainerRef;
  @Input() emergencyContacts: any[] = [];
  public formContactsComponents: ComponentRef<EmergencyFormComponent>[] = [];

  constructor(private formCreator: ComponentFactoryResolver) {}

  public get formsContacts(): FormGroup[] {
    return Array.from(this.formContactsComponents, component => component.instance.emergencyContactForm);
  }

  public get formsContactsValid(): boolean {
    return this.formsContacts.every(form => form.valid === true);
  }

  public get contacts(): EmergencyContact[] {
    return Array.from(this.formsContacts, form => new EmergencyContact(form.value));
  }

  public get formComponentRef(): ComponentRef<EmergencyFormComponent> {
    return this.formsParent.createComponent(this.formFactory);
  }

  public get formFactory(): ComponentFactory<EmergencyFormComponent> {
    return this.formCreator.resolveComponentFactory(EmergencyFormComponent);
  }

  public ngOnInit(): void {
    this.createComponent();
  }

  public createComponent(): void {
    const formComponent = this.formsParent.createComponent(this.formFactory);
    formComponent.instance.setInitData(this, this.formContactsComponents.length);
    this.formContactsComponents.push(formComponent);
  }

  public removeForm(pIndex: number): void {
    for (let i = 0; i < this.formContactsComponents.length; i++) {
      const currentEl = this.formContactsComponents[i];
      if (i === pIndex) {
        currentEl.destroy();
        this.formContactsComponents.splice(pIndex, 1);
      }
    }
  }

  public resetComponent(): void {
    this.formContactsComponents[0].instance.clearForm();
    this.removeForm(1);
    this.removeForm(2);
  }
}
