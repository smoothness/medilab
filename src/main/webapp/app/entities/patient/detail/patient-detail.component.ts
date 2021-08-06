import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from './../../../core/auth/account.model';
import { AilmentService } from '../../ailment/service/ailment.service';
import { IMedicalExams } from "../../medical-exams/medical-exams.model";
import {MedicalExamsService} from "../../medical-exams/service/medical-exams.service";

@Component({
  selector: 'medi-patient-detail',
  templateUrl: './patient-detail.component.html',
})
export class PatientDetailComponent implements OnInit {
  patient: any = {};
  ailments: any = [];
  patientMedicalExams: IMedicalExams[] = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private ailmentService: AilmentService,
    private medicalExamsService: MedicalExamsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.patient = new Patient(patient);
      this.getMedicalExams();
      this.ailmentService.findAllAilmentsPacient(this.patient.patientId).subscribe(pacientAilments => {
        this.ailments = pacientAilments.body;
      });
    });
  }

  public getMedicalExams(): void {
    this.medicalExamsService.findByPatient(this.patient.patientId).subscribe((patientMedicalExams: any) => {
      this.patientMedicalExams = patientMedicalExams.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
