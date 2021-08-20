import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";


import { AilmentService } from "../../ailment/service/ailment.service";
import { TreatmentService } from "../../treatment/service/treatment.service";
import { SweetAlertService } from "../../../shared/services/sweet-alert.service";
import { AppointmentTreatmentAilmentService } from "../service/appointment-treatment-ailment.service";

import { TreatmentCreateFormComponent } from "../../treatment/register/treatment-create-form.component";

import { ITreatment } from "../../treatment/treatment.model";
import { AppointmentTreatmentAilment } from "../appointment-treatment-ailment.model";

@Component({
  selector: 'medi-appointment-treatment-ailment-register',
  templateUrl: './appointment-treatment-ailment-register.component.html',
  styleUrls: ['./appointment-treatment-ailment-register.component.scss']
})
export class AppointmentTreatmentAilmentRegisterComponent implements OnInit {
  @ViewChild('treatmentComponent', {static: true, read: TreatmentCreateFormComponent})
  public treatmentComponent?: TreatmentCreateFormComponent;

  @Input() appointment: any;
  ailments: any[] = [];

  public registerForm: FormGroup = this.fb.group({
    ailment: ['', [Validators.required]],
    description: ['']
  });

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private sweetAlertService: SweetAlertService,
    private ailmentService: AilmentService,
    private treatmentService: TreatmentService,
    private appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService
  ) {}

  get treatmentsData(): any[] {
    return this.treatmentComponent?.treatmentsData ?? [];
  }

  ngOnInit(): void {
    this.getAllAilments();
  }

  public get isValidRegisterData(): boolean {
    let isValidRegisterData = false;
    if (this.registerForm.valid) {
      isValidRegisterData = true;
      if (this.treatmentComponent) {
        isValidRegisterData = false;
        if (this.treatmentComponent.isAllValid) {
          isValidRegisterData = true;
        }
      }
    }
    return isValidRegisterData;
  }

  public getAllAilments(): void {
    this.ailmentService.query().subscribe((res: any) => {
      this.ailments = res.body;
    });
  }

  public save(): void {
    this.saveTreatments().subscribe(
      treatment => {
        this.saveDiagnosis(treatment);
      },
      () => {
        this.sweetAlertService.showMsjError('reset.done', 'reset.done');
      },
      () => {
        this.sweetAlertService.showMsjSuccess('reset.done', 'reset.done').then(() => {
          this.registerForm.reset();
          this.treatmentComponent?.resetForms();
          this.activeModal.close('register');
        });
      }
    );
  }

  public saveDiagnosis(treatment: ITreatment): void {
    const newDiagnosis = new AppointmentTreatmentAilment(this.registerForm.value.description,
      this.registerForm.value.ailment, treatment, this.appointment);

    this.appointmentTreatmentAilmentService.create(newDiagnosis).subscribe();
  }

  public saveTreatments(): Observable<any> {
    return new Observable(subscriber => {
      let index = 0;
      for (const treatment of this.treatmentsData[Symbol.iterator]()) {
        this.treatmentService.create(treatment).subscribe((res) => {
          subscriber.next(res.body);
          index++;

          if (index === this.treatmentsData.length){
            subscriber.complete();
          }
        });
      }
    });
  }
}
