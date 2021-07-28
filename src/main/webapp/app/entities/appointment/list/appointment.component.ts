import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { AppointmentDeleteDialogComponent } from '../delete/appointment-delete-dialog.component';

import { PatientService } from 'app/entities/patient/service/patient.service';
import { Patient, IPatient } from 'app/entities/patient/patient.model';

import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { Doctor, IDoctor } from 'app/entities/doctor/doctor.model';

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

  patient: Patient | null = null;
  patients: IPatient[] | null = null;
  isLoadingPatient = false;

  doctor: Doctor | null = null;
  doctors: IDoctor[] | null = null;
  isLoadingDoctor = false;

  constructor(protected appointmentService: AppointmentService,
    protected modalService: NgbModal,
    private accountService: AccountService,
    protected patientService: PatientService,
    protected doctorService: DoctorService) { }

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
  }


  loadAllAccount(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => {
        this.account = account;
      }
      );
  }

  ngOnInit(): void {
    this.loadAllAppointments();
    this.loadAllAccount();
    if(this.account?.authorities.includes("ROLE_USER")){
      this.loadDoctor();
    } if (this.account?.authorities.includes("ROLE_PATIENT")){
      this.loadPacient();
    }
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

  loadPacient(): void {
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

  loadDoctor(): void {
    this.isLoadingDoctor = true;

    this.doctorService.query().subscribe(
      (res: HttpResponse<IDoctor[]>) => {
        this.isLoadingDoctor = false;
        this.doctors = res.body?.filter(
          data => data.internalUser?.id === this.account?.id
        ) ?? [];

        this.doctor = this.doctors[0];
      },
      () => {
        this.isLoadingDoctor = false;
      }
    );
  }

}
