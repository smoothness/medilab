import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from './../../config/error.constants';
import { RegisterService } from './register.service';
import { User } from './register.model';

@Component({
  selector: 'medi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  doNotMatch = false;
  error = false;
  success = false;
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
  });

  constructor(private fb: FormBuilder, private service: RegisterService, private translateService: TranslateService) {}

  get currentGroup(): any {
    return this.getGroupAt(this.currentStep);
  }

  previousStep(): void {
    this.currentStep--;
  }

  nextStep(): void {
    this.currentStep++;
  }

  registerUser(): void {
    const newUser: User = new User(this.registerForm.value);

    this.service.register(newUser).subscribe(
      () => {
        this.success = true;
      },
      response => this.processError(response)
    );
  }

  validatePassword(password: string): void {
    console.log('password: ', password);
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.registerForm.controls).map(groupName => this.registerForm.get(groupName)) as FormGroup[];

    return groups[index];
  }

  // register(): void {
  //   this.doNotMatch = false;
  //   this.error = false;
  //   this.errorEmailExists = false;
  //   this.errorUserExists = false;

  //   const password = this.registerForm.get(['password'])!.value;
  //   if (password !== this.registerForm.get(['confirmPassword'])!.value) {
  //     this.doNotMatch = true;
  //   } else {
  //     const login = this.registerForm.get(['login'])!.value;
  //     const email = this.registerForm.get(['email'])!.value;
  //     this.registerService.save({ login, email, password, langKey: this.translateService.currentLang }).subscribe(
  //       () => (this.success = true),
  //       response => this.processError(response)
  //     );
  //   }
  // }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      // this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      // this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
