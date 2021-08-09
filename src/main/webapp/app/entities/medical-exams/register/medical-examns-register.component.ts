import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { MedicalExamsService } from "../service/medical-exams.service";
import { IMedicalExams } from "../medical-exams.model";
import {SweetAlertService} from "../../../shared/services/sweet-alert.service";

@Component({
  selector: 'medi-register-medical-exams',
  templateUrl: './medical-examns-register.component.html',
  styleUrls: ['./medical-examns-register.component.scss']
})

export class MedicalExamnsRegisterComponent {
  @Input() appointment: any;
  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private medicalExamsService: MedicalExamsService,
    private sweetAlertService: SweetAlertService,
    public activeModal: NgbActiveModal,
  ) {}

  get registerData(): IMedicalExams {
    return {
       name: this.registerForm.value.name,
       description: this.registerForm.value.description,
       removed: false,
       appointment: this.appointment
    }
  }

  public save(): void {
    this.medicalExamsService.create(this.registerData).subscribe(() => {
      this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.medicalExams.created').then(() => {
        this.registerForm.reset();
        this.activeModal.close('register');
      });
    });
  }

}
