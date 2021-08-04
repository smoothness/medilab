import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from './../../../core/auth/account.model';
import { AilmentService } from '../../ailment/service/ailment.service';

@Component({
  selector: 'medi-patient-detail',
  templateUrl: './patient-detail.component.html',
})
export class PatientDetailComponent implements OnInit {
  patient: any = {};
  ailments: any = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private ailmentService: AilmentService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.patient = new Patient(patient);
      this.ailmentService.findAllAilmentsPacient(this.patient.patientId).subscribe(pacientAilments => {
        this.ailments = pacientAilments.body;
      });
    });
  }

  previousState(): void {
    window.history.back();
  }
}
