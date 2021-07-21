import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertServiceService } from './../../shared/services/sweet-alert-service.service';
import {Router} from "@angular/router";

import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from './../../config/error.constants';
import { RegisterService } from './register.service';
import { User } from './register.model';

@Component({
  selector: 'medi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild(EmergencyContactComponent) emergencyContact?: any;
  doNotMatch = false;
  error = false;
  currentStep = 0;
  emergencyContacts: any[] = [];
  registerForm = this.fb.group({
    personalInfo: this.fb.group({
      login: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
        ],
      ],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      secondlastname: [''],
      langKey: [this.translateService.currentLang],
    }),
    contactInfo: this.fb.group({
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
    }),
    password: [''],
  });

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertServiceService,
    private router: Router
  ) {}

  public get currentGroup(): any {
    return this.getGroupAt(this.currentStep);
  }

  public nextStep(): void {
    this.currentStep++;
  }

  public previousStep(): void {
    this.currentStep--;
  }

  public registerUser(newEmergencyContacts: any): void {
    const newUser: User = new User(this.registerForm.value);
    newUser.emergencyContact = newEmergencyContacts.contacts;

    this.service.register(newUser).subscribe(
      () => {
        this.sweetAlertService.showMsjSuccess('register.messages.success', 'register.messages.emailConfirm').
        then((res) =>{
          this.registerForm.reset();
          this.emergencyContact.resetComponent();
          window.location.assign('/');
        });;
      },
      response => this.processError(response)
    );
  }

  public validatePassword(password: string): void {
    this.registerForm.patchValue({ password });
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.registerForm.controls).map(groupName => this.registerForm.get(groupName)) as FormGroup[];
    return groups[index];
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.sweetAlertService.showMsjError('register.messages.error.error', 'register.messages.error.userexists');
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.sweetAlertService.showMsjError('register.messages.error.error', 'register.messages.error.emailexists');
    } else {
      this.sweetAlertService.showMsjError('register.messages.error.error', 'register.messages.error.fail');
    }
  }
}
