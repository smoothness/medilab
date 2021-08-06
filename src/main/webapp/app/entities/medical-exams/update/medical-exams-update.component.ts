import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import { IMedicalExams, MedicalExams } from '../medical-exams.model';
import { MedicalExamsService } from '../service/medical-exams.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import {SweetAlertService} from "../../../shared/services/sweet-alert.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'medi-medical-exams-update',
  templateUrl: './medical-exams-update.component.html',
})
export class MedicalExamsUpdateComponent implements OnInit {
  @Input() medicalExam: IMedicalExams = {};

  appointmentsSharedCollection: IAppointment[] = [];

  editForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  constructor(
    protected fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private sweetAlertService: SweetAlertService,
    protected medicalExamsService: MedicalExamsService,
    protected appointmentService: AppointmentService,
  ) {}

  ngOnInit(): void {
    this.fillData();
  }

  public fillData(): void {
    this.editForm.patchValue({
      name: this.medicalExam.name,
      description: this.medicalExam.description
    })
  }

  public save(): void {
     this.medicalExamsService.update(this.createMedicalExam()).subscribe(() => {
       this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.medicalExams.updated').then(() => {
         this.editForm.reset();
         this.activeModal.close('updated');
       });
     });
  }

  protected createMedicalExam(): IMedicalExams {
    const medicalExam = new MedicalExams(
      this.medicalExam.id,
      this.editForm.get(['name'])!.value,
      this.editForm.get(['description'])!.value,
      this.medicalExam.removed,
      this.medicalExam.appointment
    );
    return medicalExam;
  }
}
