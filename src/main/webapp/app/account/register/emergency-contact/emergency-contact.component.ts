import { 
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnInit, 
  ComponentFactory,
  ComponentRef,
  ViewChild
} from '@angular/core';
import { EmergencyFormComponent } from './emergency-form/emergency-form.component';

@Component({
  selector: 'medi-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss']
})
export class EmergencyContactComponent implements OnInit {
  //@ViewChild('viewContainerRef', { read: ViewContainerRef }) vcr!: ViewContainerRef;
  public formContacts: EmergencyFormComponent[] = [];

  constructor(private formCreator: ComponentFactoryResolver, public vcr: ViewContainerRef) {}

  get contacts(): {}[] {
    const contacts: {}[] = Array.from(this.formContacts, el => (<{}>el.emergencyContactForm.value));
    return contacts;
  }

  get formComponentRef(): ComponentRef<EmergencyFormComponent> {
    return this.vcr.createComponent(this.formFactory);
  }

  get formFactory(): ComponentFactory<EmergencyFormComponent> {
    return this.formCreator.resolveComponentFactory(EmergencyFormComponent);
  }

  ngOnInit(): void {
    this.createComponent();
  }

  createComponent(): void { 
    const formComponent = this.formComponentRef.instance;
    formComponent.setInitData(this, this.formContacts.length)
    this.formContacts.push(formComponent);
  }

  removeForm(pIndex: number): void {
    for (let i = 0; i < this.formContacts.length; i++) {
      const currentContact = this.formContacts[i];
      
      if (i === pIndex) {
        this.vcr.remove(pIndex);
        this.formContacts.splice(pIndex, 1);
      }
    }
  }

}
