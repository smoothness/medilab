import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { UserManagementService } from './../service/user-management.service';
import { User } from './user.model';
import { EmergencyFormComponent } from '../../../account/register/emergency-contact/emergency-form/emergency-form.component';
import { EmergencyContact } from '../../../account/register/register.model';
import { HttpErrorResponse } from '@angular/common/http';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from '../../../config/error.constants';

@Component({
  selector: 'medi-register',
  templateUrl: './user-management-register.component.html',
  styleUrls: ['./user-management-register.component.scss'],
})
export class UserManagementRegisterComponent {
  @ViewChild(EmergencyFormComponent) contact?: any;
  currentStep = 0;
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
    role: ['', [Validators.required]],
    doctorCode: [''],
    specialty: [''],
  });
  roles = [
    { name: 'userManagement.selectRole', abbrev: '' },
    { name: 'userManagement.roleDoctor', abbrev: 'ROLE_USER' },
    { name: 'userManagement.rolePatient', abbrev: 'ROLE_PATIENT' },
    { name: 'userManagement.roleAdmin', abbrev: 'ROLE_ADMIN' },
  ];

  constructor(
    private userService: UserManagementService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertService
  ) {}

  public get isUser(): boolean {
    let isUser = false;
    if (this.registerForm.value.role === 'ROLE_USER') {
      isUser = true;
    }
    return isUser;
  }

  public get isPatient(): boolean {
    let isPatient = false;
    if (this.registerForm.value.role === 'ROLE_PATIENT') {
      isPatient = true;
    }
    return isPatient;
  }

  public get currentGroup(): any {
    return this.getGroupAt(this.currentStep);
  }

  public nextStep(): void {
    this.currentStep++;
  }

  public previousStep(): void {
    this.currentStep--;
  }

  public registerUser(newUser: User): void {
    this.userService.registerUser(newUser).subscribe(
      () => {
        this.sweetAlertService.showMsjSuccess('register.messages.success', 'register.messages.successInternal').then(() => {
          this.registerForm.reset();
          this.contact.clearForm();
        });
      },
      response => this.processError(response)
    );
  }

  validateUserData(contact: any): void {
    const newUser: User = new User(this.registerForm.value);

    if (this.registerForm.value.role === 'ROLE_PATIENT') {
      newUser.emergencyContact = new EmergencyContact(contact.emergencyContactForm.value);
    }

    this.registerUser(newUser);
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
