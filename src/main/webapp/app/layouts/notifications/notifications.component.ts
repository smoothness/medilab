import { OnInit, OnDestroy, Component } from '@angular/core';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

enum NotificationType {
  CANCEL = 'An appointment was canceled.',
  UPDATE = 'An appointment date was changed.',
}

type Notification = {
  id: number;
  message: NotificationType;
};

@Component({
  selector: 'medi-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notificationIndex = 0;
  notifications: Notification[] = [];
  intervalFunctionIdentifier: any = null;

  constructor(private appointmentService: AppointmentService) {
    // this.appointmentService.notification.asObservable().subscribe((value: any) => {
    //   console.log('WOW!::::::', value);
    //   // Do something with value
    // });
  }

  ngOnInit(): void {
    this.createNotificationInterval();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalFunctionIdentifier);
  }

  createNotificationInterval(): void {
    this.intervalFunctionIdentifier = setInterval(() => {
      console.log('::::::::Notification Center::::::::');
      this.appointmentService.notification.asObservable().subscribe((value: any) => {
        console.log('WOW!::::::', value);
        // this.
      });
    }, 1000);
  }
}
