import { Component, Input, OnInit } from '@angular/core';
import { IAppointment } from 'app/entities/appointment/appointment.model';
// import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

@Component({
  selector: 'medi-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  @Input() public user: any;
  expanded = false;
  allAppointments: any[] = [];
  updatedAppointments: any[] = [];
  canceledAppointments: any[] = [];

  constructor(private appointmentService: AppointmentService, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.initNotifications();
  }

  initNotifications(): void {
    this.appointmentService.query().subscribe((appointments: any) => {
      this.allAppointments = appointments.body.filter((appointment: IAppointment) => {
        console.log('el appointment 🚀', appointment);
        console.log('el user 💩', this.user);
        if (appointment.patient && appointment.patient.id === this.user.patientId) {
          console.log('BINGO 🐶');
          if (appointment.doctor) {
            this.doctorService.find(Number(appointment.doctor.id)).subscribe(doctor => {
              appointment.doctor = Object.assign({}, appointment.doctor, doctor.body);
            });
          }
          return appointment;
        }
        return;
      });
      this.sortAppointments();
    });
  }

  sortAppointments(): void {
    this.allAppointments.forEach((appointment: any) => {
      if (appointment.updated) {
        this.updatedAppointments.push(appointment);
      }
      if (appointment.canceled) {
        this.canceledAppointments.push(appointment);
      }
    });
  }
}

// eslint-disable-next-line @angular-eslint/use-lifecycle-interface
//   public ngOnChanges(change: any): void {
//     if (change) {
//       this.user = change.user.currentValue.patientId;
//       this.initNotifications();
//     };
//  }
