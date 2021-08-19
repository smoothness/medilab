import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { MedicalExamsService } from '../entities/medical-exams/service/medical-exams.service';
import { AppointmentTreatmentAilmentService } from 'app/entities/appointment-treatment-ailment/service/appointment-treatment-ailment.service';

import { Account } from 'app/core/auth/account.model';
import { Doctor, Patient } from './../core/auth/account.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { IMedicalExams } from '../entities/medical-exams/medical-exams.model';
import { IAppointmentTreatmentAilment } from 'app/entities/appointment-treatment-ailment/appointment-treatment-ailment.model';

@Component({
  selector: 'medi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: any = {};
  account: Account | null = null;

  appointmentsDoctor: any[] = [];
  appointmentsPatient: any[] = [];

  closeModal: string | undefined;

  updatedDate = new FormControl('');
  appointmentToChangeDate: IAppointment | null = null;

  patientMedicalExams: IMedicalExams[] = [];
  patientDiagnosis: IAppointmentTreatmentAilment[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    protected modalService: NgbModal,
    private doctorService: DoctorService,
    private accountService: AccountService,
    private patientService: PatientService,
    private sweetAlertService: SweetAlertService,
    private appointmentService: AppointmentService,
    private medicalExamsService: MedicalExamsService,
    private appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
) {}

  public get isPatient(): boolean {
    return this.currentUser instanceof Patient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }

  public get isAdmin(): boolean {
    return this.currentUser instanceof Account;
  }

  public get notificationUser(): any {
    return this.currentUser; /* eslint-disable-line @typescript-eslint/no-unsafe-return */
  }

  ngOnInit(): void {
    this.authenticatedAccount();
  }

  /**
   * @description this method is responsible for bringing the authenticated user.
   */
  public authenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
      this.getAppointmentsByUser();
    });
  }

  /**
   * @description This method is responsible for bringing all the appointments according to the role of the authenticated user
   */
  public getAppointmentsByUser(): void {
    if (this.isPatient) {
      this.getAppointmentsPatient();
      this.getMedicalExams();
      this.getPatientDiagnoses();
    }else if(this.isDoctor) {
      this.getAppointmentsDoctor();
    }
  }

  /**
   * @description this method brings up all pending appointments of a patient.
   */
  public getAppointmentsPatient(): void {
    this.appointmentService.findPatientAppointments(this.currentUser.patientId).subscribe((appointments: any) => {
      let index = 0;
      this.appointmentsPatient = appointments.body;
      this.formatDoctorData(this.appointmentsPatient).subscribe(data => {
        this.appointmentsPatient[index].doctor = data;
        index++;
      });
    });
  }

  /**
   * @description this method formats the patients of the appointments
   * @param {Object} appointments
   * @return {Observable}
   */
  public formatPatientData(appointments: any): Observable<any> {
    return new Observable(subscriber => {
      for (const appointment of appointments[Symbol.iterator]()) {
        this.patientService.find(appointment.patient.id).subscribe(patient => {
          subscriber.next(patient.body);
        });
      }
    });
  }

  /**
   * @description this method brings up all pending appointments of a doctor.
   */
  public getAppointmentsDoctor(): void {
    this.appointmentService.findDoctorAppointments(this.currentUser.doctorId).subscribe((appointments: any) => {
      let index = 0;
      this.appointmentsDoctor = appointments.body;
      this.formatPatientData(this.appointmentsDoctor).subscribe(data => {
        this.appointmentsDoctor[index].patient = data;
        index++;
      });
    });
  }

  /**
   * @description this method formats the doctors of the appointments
   * @param {Object} appointments
   * @return {Observable}
   */
  public formatDoctorData(appointments: any): Observable<any> {
    return new Observable(subscriber => {
      for (const appointment of appointments[Symbol.iterator]()) {
        this.doctorService.find(appointment.doctor.id).subscribe(doctor => {
          subscriber.next(doctor.body);
        });
      }
    });
  }

  /**
   * @description this method brings up all medical exams of a patient.
   */
  public getMedicalExams(): void {
    this.medicalExamsService.findByPatient(this.currentUser.patientId).subscribe((patientMedicalExams: any) => {
      this.patientMedicalExams = patientMedicalExams.body;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getToken(newToken: string): void {
    this.currentUser.setToken(newToken);
    this.authenticatedAccount();
  }

  public getPatientDiagnoses(): void {
    this.appointmentTreatmentAilmentService.findByPatient(this.currentUser.patientId).subscribe((res: any) => {
      this.patientDiagnosis = res.body;
    });
  }

  openChangeDateModal(content: any, clickedElementIndex: any): void {
    if (this.appointmentsDoctor.length) {
      this.appointmentToChangeDate = this.appointmentsDoctor[clickedElementIndex];
    }
    this.modalService.open(content);
  }

  handleChangeDate(): void {
    const newAppointment = {
      ...this.appointmentToChangeDate,
      date: this.updatedDate.value,
      updated: true,
    };
    this.appointmentService.update(newAppointment).subscribe(() => {
      this.sweetAlertService
        .showMsjSuccess('home.messages.updatedAppointmentDatetitle', 'home.messages.updatedAppointmentDateMsj')
        .then(() => {
          this.getAppointmentsDoctor();
          this.modalService.dismissAll();
        });
    });
  }

  public updateList(update: boolean): void {
    if (update){
      this.getAppointmentsDoctor();
    }
  }

}
