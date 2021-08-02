import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Appointment, IAppointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { AppointmentDeleteDialogComponent } from '../delete/appointment-delete-dialog.component';

import { PatientService } from 'app/entities/patient/service/patient.service';
import { Patient, IPatient } from 'app/entities/patient/patient.model';

import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { Doctor, IDoctor } from 'app/entities/doctor/doctor.model';

import { UserService } from 'app/entities/user/user.service';
import { User, IUser } from 'app/entities/user/user.model';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'medi-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../../../home/home.component.scss'],
})
export class AppointmentComponent implements OnInit {
  account: Account | null = null;
  appointments?: IAppointment[];
  isLoading = false;
  appointmentsPatient: any[] | undefined = [];

  patient: Patient | null = null;
  patients: IPatient[] | null = null;
  isLoadingPatient = false;

  user: User | null = null;
  users: IUser[] | null = null;
  isLoadingUser = false;

  doctor: Doctor | null = null;
  doctors: IDoctor[] | null = null;
  isLoadingDoctor = false;

  constructor(protected appointmentService: AppointmentService,
    protected modalService: NgbModal,
    private accountService: AccountService,
    protected patientService: PatientService,
    protected doctorService: DoctorService,
    protected userService: PatientService) { }

  loadAllAppointments(): void {
    this.isLoading = true;

    this.appointmentService.query().subscribe(
      (res: HttpResponse<IAppointment[]>) => {
        this.isLoading = false;
        this.appointments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );

    console.log("RESULTADO", this.appointments);
  }


  loadAccount(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => {
        this.account = account;
      }
      );
  }

  ngOnInit(): void {
    this.loadAllAppointments();
    this.loadAccount();
    if (this.account?.authorities.includes("ROLE_USER")
      || this.account?.authorities.includes("ROLE_ADMIN")) {
      this.loadDoctor();
      this.loadPatients();
    } if (this.account?.authorities.includes("ROLE_PATIENT")) {
      this.loadPatient();
      this.loadDoctors();
    }
    this.loadUser();
  }

  trackId(index: number, item: IAppointment): number {
    return item.id!;
  }

  delete(appointment: IAppointment): void {
    const modalRef = this.modalService.open(AppointmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appointment = appointment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAllAppointments();
      }
    });
  }

  loadUser(): void {
    this.isLoadingUser = true;
    this.userService.query().subscribe(
      (res: HttpResponse<IUser[]>) => {
        this.isLoadingUser = false;
        this.users = res.body ?? [];
      },
      () => {
        this.isLoadingUser = false;
      }
    );
  }

  loadDoctor(): void {
    this.isLoadingDoctor = true;

    this.doctorService.query().subscribe(
      (res: HttpResponse<IDoctor[]>) => {
        this.isLoadingDoctor = false;
        this.doctors = res.body?.filter(
          data => data.internalUser?.id === this.account?.id
        ) ?? [];

        this.doctor = this.doctors[0];

        this.doctors = res.body?.filter(
          data => data.internalUser?.id === this.account?.id
        ) ?? [];
      },
      () => {
        this.isLoadingDoctor = false;
      }
    );
  }

  loadPatient(): void {
    this.isLoadingPatient = true;

    this.patientService.query().subscribe(
      (res: HttpResponse<IPatient[]>) => {
        this.isLoadingPatient = false;
        this.patients = res.body?.filter(
          data => data.internalUser?.id === this.account?.id
        ) ?? [];
        this.patient = this.patients[0];
      },
      () => {
        this.isLoadingPatient = false;
      }
    );
  }

  loadPatients(): void {
    this.isLoadingPatient = true;

    this.patientService.query().subscribe(
      (res: HttpResponse<IPatient[]>) => {
        this.isLoadingPatient = false;
        this.patients = res.body ?? [];
      },
      () => {
        this.isLoadingPatient = false;
      }
    );
  }

  loadDoctors(): void {
    this.isLoadingDoctor = true;

    this.doctorService.query().subscribe(
      (res: HttpResponse<IDoctor[]>) => {
        this.isLoadingDoctor = false;
        this.doctors = res.body ?? [];
      },
      () => {
        this.isLoadingDoctor = false;
      }
    );
  }


  searchPatientFullName(patientSearching?: Patient): string {
    let accountAux: any;
    this.patients?.forEach(
      data => {
        if (data.id === patientSearching?.id && data.id) {
          accountAux = data.internalUser;
        }
      }
    )
    return String(accountAux.completeName);
  }


  searchDoctorFullName(doctorSearching?: Doctor): string {
    let accountAux: any;
    this.doctors?.forEach(
      data => {
        if (data.id === doctorSearching?.id && data.id) {
          accountAux = data.internalUser;
        }
      }
    )
    return String(accountAux.completeName);
  }
}
