import {Component, OnInit} from '@angular/core';
import {AppointmentService} from "../service/appointment.service";
import { Doctor, Patient } from "../../../core/auth/account.model";
import {AccountService} from "../../../core/auth/account.service";
import {PatientService} from "../../patient/service/patient.service";
import {DoctorService} from "../../doctor/service/doctor.service";
import {Observable} from "rxjs";

@Component({
  selector: 'medi-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.scss']
})
export class AppointmentHistoryComponent implements OnInit {
  currentUser: any;
  appointments: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private accountService: AccountService,
    private patientService: PatientService,
    private doctorService: DoctorService,
  ) { }

  public get isPatient(): boolean {
    return this.currentUser instanceof Patient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }


  ngOnInit(): void {
    this.authenticatedAccount()
  }

  /**
   * @description this method is responsible for bringing the authenticated user.
   */
  public authenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
      this.getAppointmentHistoryByUser();
    });
  }

  public getAppointmentHistoryByUser(): void {
    if(this.isPatient){
      this.getPatientAppointmentHistory();
    }else if(this.isDoctor){
      this.getDoctorAppointmentHistory();
    }else{
      this.getAppointmentHistory();
    }
  }

  public getPatientAppointmentHistory(): void {
    this.appointmentService.findPatientAppointmentsHistory(this.currentUser.patientId).subscribe((appointments: any) => {
      let index = 0;
      this.appointments = appointments.body;
      this.formatDoctorData(this.appointments).subscribe(data => {
        this.appointments[index].doctor = data;
        index++;
      });
    });
  }

  public formatDoctorData(appointments: any): Observable<any> {
    return new Observable(subscriber => {
      for (const appointment of appointments[Symbol.iterator]()) {
        this.doctorService.find(appointment.doctor.id).subscribe(doctor => {
          subscriber.next(doctor.body);
        });
      }
    });
  }

  public getDoctorAppointmentHistory(): void {
    this.appointmentService.findDoctorAppointmentsHistory(this.currentUser.doctorId).subscribe((appointments: any) => {
      let index = 0;
      this.appointments = appointments.body;
      this.formatPatientData(this.appointments).subscribe(data => {
        this.appointments[index].patient = data;
        index++;
      });
    });
  }

  public formatPatientData(appointments: any): Observable<any> {
    return new Observable(subscriber => {
      for (const appointment of appointments[Symbol.iterator]()) {
        this.patientService.find(appointment.patient.id).subscribe(patient => {
          subscriber.next(patient.body);
        });
      }
    });
  }

  public getAppointmentHistory(): void {
    this.appointmentService.findAppointmentsHistory().subscribe((appointments: any) => {
      let index = 0;
      this.appointments = appointments.body;
      this.formatDoctorData(this.appointments).subscribe(data => {
        this.appointments[index].doctor = data;
        index++;
      });
      let index2 = 0;
      this.formatPatientData(this.appointments).subscribe(data => {
        this.appointments[index2].patient = data;
        index2++;
      });
    });
  }

}
