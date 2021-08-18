import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './../../core/auth/account.service';
import { PatientService } from '../../entities/patient/service/patient.service';

import { LANGUAGES } from './../../config/language.constants';
import { Doctor, Patient } from '../../core/auth/account.model';
import { DoctorService } from '../../entities/doctor/service/doctor.service';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';

@Component({
  selector: 'medi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  account!: any;
  success = false;
  languages = LANGUAGES;
  settingsForm = this.fb.group({
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
    langKey: [undefined],
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private sweetAlertService: SweetAlertService
  ) {}

  public get contactInfoForm(): any {
    return this.settingsForm.get('contactInfo');
  }

  public get personalInfoForm(): any {
    return this.settingsForm.get('personalInfo');
  }

  public ngOnInit(): void {
    this.accountService.formatUserIdentity().subscribe((account: any) => {
      if (account) {
        this.account = account;
        this.setFormData();
      }
    });
  }

  save(): void {
    this.success = false;
    this.updateAccountData();

    this.accountService.save(this.account.internalUserData).subscribe(() => {
      this.accountService.authenticate(this.account);

      if (this.account instanceof Patient) {
        this.patientService.updatePatientProfile(this.account).subscribe(() => {
          this.updateLanguage();
          this.sweetAlertService.showMsjSuccess('reset.done', 'settings.messages.success');
        });
      } else if (this.account instanceof Doctor) {
        this.doctorService.updateDoctorProfile(this.account).subscribe(() => {
          this.updateLanguage();
          this.sweetAlertService.showMsjSuccess('reset.done', 'settings.messages.success');
        });
      } else {
        this.updateLanguage();
        this.sweetAlertService.showMsjSuccess('reset.done', 'settings.messages.success');
      }
    });
  }

  private updateLanguage(): void {
    if (this.account.langKey !== this.translateService.currentLang) {
      this.translateService.use(this.account.langKey);
    }
  }

  private setFormData(): void {
    this.personalInfoForm.get('login')?.disable();
    this.personalInfoForm.patchValue({
      login: this.account.login,
      name: this.account.firstName,
      lastname: this.account.lastName,
      secondlastname: this.account.secondSurname,
    });
    this.contactInfoForm.patchValue({
      email: this.account.email,
      phone: this.account.phone,
    });
    this.settingsForm.patchValue({
      langKey: this.account.langKey,
    });
  }

  private updateAccountData(): void {
    this.account.firstName = this.personalInfoForm.get('name')!.value;
    this.account.lastName = this.personalInfoForm.get('lastname')!.value;
    this.account.secondSurname = this.personalInfoForm.get('secondlastname')!.value;

    this.account.email = this.contactInfoForm.get('email')!.value;
    this.account.phone = this.contactInfoForm.get('phone')!.value;

    this.account.langKey = this.settingsForm.get('langKey')!.value;
  }
}
