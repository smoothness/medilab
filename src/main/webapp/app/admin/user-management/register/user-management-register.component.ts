import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertServiceService } from 'app/shared/services/sweet-alert-service.service';

import { UserManagementService } from './../service/user-management.service';

@Component({
  selector: 'medi-register',
  templateUrl: './user-management-register.component.html',
  styleUrls: ['./user-management-register.component.scss'],
})
export class UserManagementRegisterComponent implements OnInit {
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
  });

  constructor(
    private userService: UserManagementService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private sweetAlert: SweetAlertServiceService
  ) {}

  get currentGroup(): any {
    return this.getGroupAt(this.currentStep);
  }

  ngOnInit(): string {
    return 'text';
  }

  previousStep(): void {
    this.currentStep--;
  }

  nextStep(): void {
    this.currentStep++;
  }

  registerUser(): void {
    console.log(this.registerForm.value);
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.registerForm.controls).map(groupName => this.registerForm.get(groupName)) as FormGroup[];

    return groups[index];
  }
}
