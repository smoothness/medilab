import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AccountService } from './../../core/auth/account.service';
import { DoctorService } from '../../entities/doctor/service/doctor.service';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { PatientService } from '../../entities/patient/service/patient.service';
import { UserManagementService } from "../../admin/user-management/service/user-management.service";

import { LANGUAGES } from './../../config/language.constants';
import { Doctor, Patient } from '../../core/auth/account.model';


@Component({
  selector: 'medi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  account!: any;
  success = false;
  languages = LANGUAGES;
  isOwner = false;
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
    private router: Router,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private accountService: AccountService,
    private patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private userService: UserManagementService,
    private sweetAlertService: SweetAlertService
  ) {}

  public get contactInfoForm(): any {
    return this.settingsForm.get('contactInfo');
  }

  public get personalInfoForm(): any {
    return this.settingsForm.get('personalInfo');
  }

  public ngOnInit(): void {
    this.getByUrl();
  }

  public getByUrl(): void {
    this.activatedRoute.data.subscribe(({ user }) => {
      if(user === undefined) {
        this.getCurrentUser();
        this.isOwner = true;
      } else {
        this.account = user;
        this.setFormData();
      }
    });
  }

  public getCurrentUser(): void {
    this.accountService.formatUserIdentity().subscribe((account: any) => {
      if (account) {
        this.account = account;
        this.setFormData();
      }
    });
  }

  public save(): void {
    if (this.isOwner) {
      this.savePersonalUpdate();
    }else{
      this.saveUserUpdate();
    }
  }

  public saveUserUpdate(): void {
    this.success = false;
    this.updateAccountData();

    this.userService.update(this.account).subscribe((res) => {
      if (this.account instanceof Patient) {
        this.patientService.updatePatientProfile(this.account).subscribe(() => {
          this.updateLanguage();
          this.sweetAlertService.showMsjSuccess('reset.done', 'settings.messages.success').then(() => {
            this.router.navigate(['/main']);
          });
        });
      } else if (this.account instanceof Doctor) {
        this.doctorService.updateDoctorProfile(this.account).subscribe(() => {
          this.updateLanguage();
          this.sweetAlertService.showMsjSuccess('reset.done', 'settings.messages.success').then(() => {
            this.router.navigate(['/main']);
          });
        });
      } else {
        this.updateLanguage();
        this.sweetAlertService.showMsjSuccess('reset.done', 'settings.messages.success').then(() => {
          this.router.navigate(['/main']);
        });
      }
    });
  }

  savePersonalUpdate(): void {
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
