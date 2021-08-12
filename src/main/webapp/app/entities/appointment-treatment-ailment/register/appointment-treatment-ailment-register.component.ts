import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { SweetAlertService } from "../../../shared/services/sweet-alert.service";
import { AppointmentTreatmentAilmentService } from "../service/appointment-treatment-ailment.service";
import {AilmentService} from "../../ailment/service/ailment.service";
import {TreatmentCreateFormComponent} from "../../treatment/register/treatment-create-form.component";
import {ifStmt} from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'medi-appointment-treatment-ailment-register',
  templateUrl: './appointment-treatment-ailment-register.component.html',
  styleUrls: ['./appointment-treatment-ailment-register.component.scss']
})
export class AppointmentTreatmentAilmentRegisterComponent implements OnInit{
  @ViewChild('treatmentComponent', { static: true, read: TreatmentCreateFormComponent } )
  public treatmentComponent?: TreatmentCreateFormComponent;
  ailments: any[] = [];
  public registerForm: FormGroup = this.fb.group({
    ailment: ['', [Validators.required]],
    description: ['']
  });

  constructor(
    private fb: FormBuilder,
    private sweetAlertService: SweetAlertService,
    public activeModal: NgbActiveModal,
    private appointmentTreatmentAilment: AppointmentTreatmentAilmentService,
    private ailmentService: AilmentService,
  ) { }

  ngOnInit(): void {
    this.getAllAilments();
  }

  public get isValidRegisterData(): boolean {
    let isValidRegisterData = false;
    if(this.registerForm.valid) {
      isValidRegisterData = true;
      if (this.treatmentComponent) {
        isValidRegisterData = false;
        if(this.treatmentComponent.isAllValid) {
          isValidRegisterData = true;
        }
      }
    }
    return isValidRegisterData;
  }

  public getAllAilments(): void {
    this.ailmentService.query().subscribe((res: any) => {
      this.ailments = res.body;
      console.log(this.ailments);
    });
  }

  public save(): void {
    console.log(this.registerForm.value);
    console.log(this.treatmentComponent?.treatmentsData);
  }

}
