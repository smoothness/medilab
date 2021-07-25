import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { Patient } from 'app/entities/patient/patient.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { Doctor } from 'app/entities/doctor/doctor.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { Status } from 'app/entities/enumerations/status.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { EmergencyContactService } from 'app/entities/emergency-contact/service/emergency-contact.service';
import { EmergencyContact, IEmergencyContact } from 'app/entities/emergency-contact/emergency-contact.model';
import { EmergencyContactDeleteDialogComponent } from '../entities/emergency-contact/delete/emergency-contact-delete-dialog.component';

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
  authority: string | undefined;
  appointments: IAppointment[] | undefined = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private emergencyContactService: EmergencyContactService,
    private router: Router,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        this.authority = account?.authorities[0];
        console.log('Autority: ', this.authority);
      });

    this.patientService
      .find(Number(this.account?.login))
      .pipe(takeUntil(this.destroy$))
      .subscribe(patientNew => {
        this.patient = patientNew.body;
      });

    this.doctorService
      .find(Number(this.account?.login))
      .pipe(takeUntil(this.destroy$))
      .subscribe(doctor => {
        this.doctor = doctor.body;
      });

    this.emergencyContactService
      .find(Number(this.account?.login))
      .pipe(takeUntil(this.destroy$))
      .subscribe(emergencyContactNew => {
        if (emergencyContactNew.body?.id === this.account?.login) {
          this.emergencyContact = emergencyContactNew.body;
        }
      });

    this.appointmentService.query().subscribe(data => {
      this.appointments = data.body?.filter(app => app.doctor?.id === this.account?.id);
    });

    this.loadAllEmergencyContact();
  }

  trackId(index: number, item: IEmergencyContact): number {
    return item.id!;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  cancelAppointment(appointment: IAppointment): void {
    appointment.status = Status.CANCELED;
    this.appointmentService.update(appointment).subscribe(function (response) {
      console.log('response of server:', response);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteEmergencyContact(emergencyContact: IEmergencyContact): void {
    const modalRef = this.modalService.open(EmergencyContactDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
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
      },
      () => {
        this.isLoadingEmergencyContact = false;
      }
    );
  }
}
