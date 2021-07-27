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
import { EmergencyFormComponent } from './emergency-form/emergency-form.component';
import { EmergencyContact } from './../register.model';


@Component({
  selector: 'medi-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss'],
})
export class EmergencyContactComponent implements OnInit {
  @ViewChild('containerElement', { static: true, read: ViewContainerRef })
  public container!: ViewContainerRef;
  @Input() emergencyContacts: any[] = [];
  public formContacts: ComponentRef<EmergencyFormComponent>[] = [];

  constructor(private formCreator: ComponentFactoryResolver) {}

  get contacts(): {}[] {
    const contacts: {}[] = Array.from(this.formContacts, el => new EmergencyContact(el.instance.emergencyContactForm.value));
    return contacts;
  }

  get formComponentRef(): ComponentRef<EmergencyFormComponent> {
    return this.container.createComponent(this.formFactory);
  }

  get formFactory(): ComponentFactory<EmergencyFormComponent> {
    return this.formCreator.resolveComponentFactory(EmergencyFormComponent);
  }

  ngOnInit(): void {
    this.createComponent();
  }

  createComponent(): void {
    const formComponent = this.container.createComponent(this.formFactory);
    formComponent.instance.setInitData(this, this.formContacts.length);
    this.formContacts.push(formComponent);
  }

  removeForm(pIndex: number): void {
    for (let i = 0; i < this.formContacts.length; i++) {
      const currentEl = this.formContacts[i];
      if (i === pIndex) {
        currentEl.destroy();
        this.formContacts.splice(pIndex, 1);
      }
    }
  }

  resetComponent(): void {
    this.formContacts[0].instance.clearForm();
    this.removeForm(1);
    this.removeForm(2);
  }
}
