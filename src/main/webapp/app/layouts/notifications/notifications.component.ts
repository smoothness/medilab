import { Component, Input, OnInit } from '@angular/core';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';
import { Doctor, Patient } from 'app/core/auth/account.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IAppointment } from 'app/entities/appointment/appointment.model';

@Component({
  selector: 'medi-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  @Input() public user: any;
  expanded = false;
  userType = '';
  pendingAppointments: any[] = [];
  updatedAppointments: any[] = [];
  canceledAppointments: any[] = [];
  pendingInvoices: any[] = [];
  totalNotificationsLength = 0;
  todayDate: NgbDateStruct;

  constructor(
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {
    const today = new Date();
    this.todayDate = {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    };
  }

  ngOnInit(): void {
    this.initNotifications();
  }

  calculateTotalNotifications(): void {
    this.totalNotificationsLength =
      this.pendingAppointments.length + this.updatedAppointments.length + this.canceledAppointments.length + this.pendingInvoices.length;
  }

  withExtendedData(appointment: any): any {
    let extendedAppointment = appointment;

    if (appointment) {
      this.doctorService.find(Number(appointment?.doctor?.id)).subscribe(doctor => {
        extendedAppointment = Object.assign(extendedAppointment, { doctorExt: doctor.body });
      });
      this.patientService.find(Number(appointment?.patient?.id)).subscribe(patient => {
        extendedAppointment = Object.assign(extendedAppointment, { patientExt: patient.body });
      });
    }

    return extendedAppointment;
  }

  getUserType(user: Doctor | Patient | null): string {
    const userType = user instanceof Doctor ? 'doctor' : this.user instanceof Patient ? 'patient' : '';
    this.userType = userType;
    return userType;
  }

  setNotified(e: any): void {
    const notificationId = e.closest('.notification').id;
    let appointmentToUpdate: IAppointment | null;

    this.appointmentService.find(notificationId).subscribe(appointment => {
      appointmentToUpdate = appointment.body;
      if (appointmentToUpdate) {
        appointmentToUpdate.notified = true;
        this.appointmentService.update(appointmentToUpdate).subscribe(() => true);
      }
    });
  }

  getInvoices(userId: any): void {
    this.invoiceService.findInvoicesByDoctor(userId).subscribe((invoices: any) => {
      invoices.body.forEach((invoice: any) => {
        if (invoice.status === 'PENDING') {
          this.pendingInvoices.push(invoice);
        }
      });

      this.calculateTotalNotifications();
    });
  }

  initNotifications(): void {
    this.appointmentService.query().subscribe((appointments: any) => {
      if (appointments.body) {
        let userTypeId: any;
        appointments.body.forEach((appointment: any) => {
          const userType = this.getUserType(this.user);

          if (userType) {
            userTypeId = `${userType}Id`;
          }

          if (
            userType &&
            userTypeId &&
            appointment[userType] &&
            appointment[userType]?.id === this.user[userTypeId] &&
            !appointment.notified
          ) {
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

        this.getInvoices(this.user[userTypeId]);
      }
    });
  }
}
