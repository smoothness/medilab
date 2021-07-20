import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertServiceService } from './../../../shared/services/sweet-alert-service.service';
import { UserManagementService } from './../service/user-management.service';

@Component({
  selector: 'medi-register',
  templateUrl: './user-management-register.component.html',
  styleUrls: ['./user-management-register.component.scss'],
})
export class UserManagementRegisterComponent {
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
    userType: ['', [Validators.required]],
    doctorCode: [''],
    specialty: [''],
  });
  roles = [
    { name: 'Seleccione un tipo de usuario', abbrev: '' },
    { name: 'Médico', abbrev: 'ROLE_USER' },
    { name: 'Paciente', abbrev: 'ROLE_PATIENT' },
  ];

  constructor(
    private userService: UserManagementService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertServiceService
  ) {}

  public get isUser(): boolean {
    let isUser = false;
    if (this.registerForm.value.userType === 'ROLE_USER') {
      isUser = true;
    }
    return isUser;
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

  public registerUser(): void {
    console.log(this.registerForm.value);
  }

  public validateUser(): void {
    console.log(this.registerForm.value);
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.registerForm.controls).map(groupName => this.registerForm.get(groupName)) as FormGroup[];
    return groups[index];
  }
}
