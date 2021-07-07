import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAppointment } from '../appointment.model';

@Component({
  selector: 'medi-appointment-detail',
  templateUrl: './appointment-detail.component.html',
})
export class AppointmentDetailComponent implements OnInit {
  appointment: IAppointment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointment }) => {
      this.appointment = appointment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
