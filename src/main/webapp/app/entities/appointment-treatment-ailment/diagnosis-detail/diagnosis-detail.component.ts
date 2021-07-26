import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';

@Component({
  selector: 'medi-diagnosis-detail',
  templateUrl: './diagnosis-detail.component.html',
  styleUrls: ['./diagnosis-detail.component.scss']
})
export class DiagnosisDetailComponent implements OnInit {
  appointmentTreatmentAilment: any | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointmentTreatmentAilment }) => {
      this.appointmentTreatmentAilment = appointmentTreatmentAilment;
    });

    console.log("pedro" , this.appointmentTreatmentAilment)
  }

  previousState(): void {
    window.history.back();
  }

}
