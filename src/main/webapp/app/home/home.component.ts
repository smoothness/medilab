import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AccountService} from 'app/core/auth/account.service';
import {Account} from 'app/core/auth/account.model';

import {PatientService} from 'app/entities/patient/service/patient.service';
import {Patient} from 'app/entities/patient/patient.model';

import {DoctorService} from 'app/entities/doctor/service/doctor.service';
import {Doctor} from 'app/entities/doctor/doctor.model';

import {EmergencyContactService} from 'app/entities/emergency-contact/service/emergency-contact.service';
import {EmergencyContact, IEmergencyContact} from 'app/entities/emergency-contact/emergency-contact.model';

@Component({
  selector: 'medi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  patient: Patient | null = null;
  doctor: Doctor | null = null;
  emergencyContacts: IEmergencyContact | null = null;
  emergencyContact: EmergencyContact | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService,
              private patientService: PatientService,
              private doctorService: DoctorService,
              private emergencyContactService: EmergencyContactService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.patientService
      .find(Number(this.account?.login))
      .pipe(takeUntil(this.destroy$))
      .subscribe(patient => {
          this.patient = patient.body;
        }
      );

    this.doctorService
      .find(Number(this.account?.login))
      .pipe(takeUntil(this.destroy$))
      .subscribe(doctor => {
          this.doctor = doctor.body;
        }
      );
    this.emergencyContactService
      .find(Number(this.account?.login))
      .pipe(takeUntil(this.destroy$))
      .subscribe(emergencyContact => {
          this.emergencyContacts = emergencyContact.body;
        }
      );
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
