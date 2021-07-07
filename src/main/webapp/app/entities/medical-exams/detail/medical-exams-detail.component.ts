import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedicalExams } from '../medical-exams.model';

@Component({
  selector: 'medi-medical-exams-detail',
  templateUrl: './medical-exams-detail.component.html',
})
export class MedicalExamsDetailComponent implements OnInit {
  medicalExams: IMedicalExams | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicalExams }) => {
      this.medicalExams = medicalExams;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
