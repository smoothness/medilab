import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

import { ITreatment, Treatment } from '../treatment.model';
import { TreatmentService } from '../service/treatment.service';
import { SweetAlertService } from "../../../shared/services/sweet-alert.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AppointmentTreatmentAilmentService } from "../../appointment-treatment-ailment/service/appointment-treatment-ailment.service";
import { AppointmentTreatmentAilment } from "../../appointment-treatment-ailment/appointment-treatment-ailment.model";

@Component({
  selector: 'medi-treatment-update',
  templateUrl: './treatment-update.component.html',
})
export class TreatmentUpdateComponent implements OnInit {
  @Input() treatment: ITreatment = {};
  @Input() isRegister = false;
  @Input() ailment = {};
  @Input() appointment = {};

  editForm = this.fb.group({
    specifications: ['',[Validators.required]],
    medicines: ['',[Validators.required]],
    duration: ['',[Validators.required]],
  });

  constructor(
    public activeModal: NgbActiveModal,
    protected fb: FormBuilder,
    protected sweetAlertService: SweetAlertService,
    protected treatmentService: TreatmentService,
    protected diagnosisService: AppointmentTreatmentAilmentService,
    ) {}

  ngOnInit(): void {
    if (!this.isRegister) {
      this.fillForm();
    }
  }

  public save(): void {
    if(this.isRegister){
      this.createTreatment();
    }else {
      this.updateTreatment();
    }
  }

  protected createTreatment(): void {
    const treatment = this.createTreatmentToRegister();
    this.treatmentService.create(treatment).subscribe((treatmentCreated: any) => {
      this.addDiagnosis(treatmentCreated.body);
    },
      () => {
        this.sweetAlertService.showMsjError('register.messages.error.error', 'medilabApp.treatment.error');
      }
    );
  }

  protected addDiagnosis(treatment: ITreatment): void {
    const newDiagnosis = new AppointmentTreatmentAilment("", this.ailment, treatment, this.appointment);
      this.diagnosisService.create(newDiagnosis).subscribe(() => {
        this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.treatment.created').then(() => {
          this.activeModal.close('register');
        });
      });
  }

  protected updateTreatment(): void {
    const treatment = this.createTreatmentToUpdate();
    this.treatmentService.update(treatment).subscribe(() => {
        this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.treatment.updated').then(() => {
          this.activeModal.close('updated');
        })
      },
      () => {
        this.sweetAlertService.showMsjError('register.messages.error.error', 'medilabApp.treatment.error');
      }
    );
  }

  protected fillForm(): void {
    this.editForm.patchValue({
      specifications: this.treatment.specifications,
      medicines: this.treatment.medicines,
      duration: this.treatment.duration,
    });
  }

  protected createTreatmentToUpdate(): ITreatment {
    return {
      ...new Treatment(),
      id: this.treatment.id,
      specifications: this.editForm.get(['specifications'])!.value,
      medicines: this.editForm.get(['medicines'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      removed: false,
    };
  }

  protected createTreatmentToRegister(): ITreatment {
    return {
      ...new Treatment(),
      specifications: this.editForm.get(['specifications'])!.value,
      medicines: this.editForm.get(['medicines'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      removed: false,
    };
  }

}
