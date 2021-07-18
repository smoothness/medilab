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
import {EmergencyContactDeleteDialogComponent} from "../entities/emergency-contact/delete/emergency-contact-delete-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'medi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  patient: Patient | null = null;
  doctor: Doctor | null = null;
  emergencyContacts: IEmergencyContact[] | null = null;
  emergencyContact: EmergencyContact | null = null;
  isLoadingEmergencyContact = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService,
              private patientService: PatientService,
              private doctorService: DoctorService,
              private emergencyContactService: EmergencyContactService,
              private router: Router,
              protected modalService: NgbModal) {
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
      .subscribe(emergencyContactNew => {
          if (emergencyContactNew.body?.id === this.account?.login) {
            this.emergencyContact = emergencyContactNew.body;
            console.log({emergencyContactNew});
          }
        }
      );
    this.loadAllEmergencyContact();
  }

  trackId(index: number, item: IEmergencyContact): number {
    return item.id!;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteEmergencyContact(emergencyContact: IEmergencyContact): void {
    const modalRef = this.modalService.open(EmergencyContactDeleteDialogComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.emergencyContact = emergencyContact;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAllEmergencyContact();
      }
    });
  }

  loadAllEmergencyContact(): void {
    this.isLoadingEmergencyContact = true;

    this.emergencyContactService.query().subscribe(
      (res: HttpResponse<IEmergencyContact[]>) => {
        this.isLoadingEmergencyContact = false;
        this.emergencyContacts = res.body ?? [];
        this.filter();
      },
      () => {
        this.isLoadingEmergencyContact = false;
      }
    );
  }

  filter(): void {
    console.log(this.emergencyContacts);
    // this.emergencyContacts = this.emergencyContacts?.filter((emergencyContacts) =>
    // emergencyContacts.patient?.id === this.account?.login);
  }
}
