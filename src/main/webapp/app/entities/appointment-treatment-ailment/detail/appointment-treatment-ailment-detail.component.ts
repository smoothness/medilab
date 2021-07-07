import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';

@Component({
  selector: 'medi-appointment-treatment-ailment-detail',
  templateUrl: './appointment-treatment-ailment-detail.component.html',
})
export class AppointmentTreatmentAilmentDetailComponent implements OnInit {
  appointmentTreatmentAilment: IAppointmentTreatmentAilment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointmentTreatmentAilment }) => {
      this.appointmentTreatmentAilment = appointmentTreatmentAilment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
