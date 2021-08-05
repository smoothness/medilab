import { Component, OnInit } from '@angular/core';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

@Component({
  selector: 'medi-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  constructor(private appointmentService: AppointmentService) {
    this.appointmentService.notification.asObservable().subscribe((value: any) => {
      console.log('WOW!::::::', value);
      // Do something with value
    });
  }

  ngOnInit(): void {
    console.log('caca!');
  }
}
