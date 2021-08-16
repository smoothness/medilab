import { Component, Input, OnInit } from '@angular/core';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { Doctor, Patient } from 'app/core/auth/account.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { PatientService } from 'app/entities/patient/service/patient.service';

@Component({
  selector: 'medi-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  @Input() public user: any;
  expanded = false;
  userType = '';
  allAppointments: any[] = [];
  pendingAppointments: any[] = [];
  updatedAppointments: any[] = [];
  canceledAppointments: any[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.initNotifications();
  }

  withExtendedData(appointment: any): any {
    let extendedAppointment = {};
    this.doctorService.find(Number(appointment.doctor.id)).subscribe(doctor => {
      extendedAppointment = Object.assign(extendedAppointment, appointment, { doctor: doctor.body });
    });
    this.patientService.find(Number(appointment.patient.id)).subscribe(patient => {
      extendedAppointment = Object.assign(extendedAppointment, { patient: patient.body });
    });
    return extendedAppointment;
  }

  getUserType(user: Doctor | Patient | null): string {
    const userType = user instanceof Doctor ? 'doctor' : this.user instanceof Patient ? 'patient' : '';

    this.userType = userType;
    return userType;
  }

  initNotifications(): void {
    this.appointmentService.query().subscribe((appointments: any) => {
      if (appointments.body) {
        appointments.body.forEach((appointment: any) => {
          const userType = this.getUserType(this.user);
          let userTypeId;
          if (userType) {
            userTypeId = `${userType}Id`;
          }
          if (userType && userTypeId && appointment[userType] && appointment[userType]?.id === this.user[userTypeId]) {
            if (appointment.status === 'PENDING') {
              this.pendingAppointments.push(this.withExtendedData(appointment));
            }
            if (appointment.canceled) {
              this.canceledAppointments.push(this.withExtendedData(appointment));
            }
            if (appointment.updated && !appointment.canceled) {
              this.updatedAppointments.push(this.withExtendedData(appointment));
            }
          }
        });
      }
    });
  }
}
