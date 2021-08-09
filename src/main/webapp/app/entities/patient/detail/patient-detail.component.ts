import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from './../../../core/auth/account.model';
import { AilmentService } from '../../ailment/service/ailment.service';
import { IMedicalExams } from "../../medical-exams/medical-exams.model";
import { MedicalExamsService } from "../../medical-exams/service/medical-exams.service";

@Component({
  selector: 'medi-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  @Input() patient?: Patient;
  isLoaded = false;
  ailments: any = [];
  patientMedicalExams: IMedicalExams[] = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private ailmentService: AilmentService,
    private medicalExamsService: MedicalExamsService,
  ) {}

  ngOnInit(): void {
    if (!this.patient){
      this.getByUrl();
    }else{
      this.getMedicalExams();
      this.getAilments();
    }
  }

  public getByUrl(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.patient = new Patient(patient);
      this.getMedicalExams();
      this.getAilments();
    });
  }

  public getAilments(): void {
    this.ailmentService.findAllAilmentsPacient(<number>this.patient?.patientId).subscribe(pacientAilments => {
      this.ailments = pacientAilments.body;
      this.isLoaded = true;
    });
  }

  public getMedicalExams(): void {
    this.medicalExamsService.findByPatient(<number>this.patient?.patientId).subscribe((patientMedicalExams: any) => {
      this.patientMedicalExams = patientMedicalExams.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
