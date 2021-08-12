import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { SweetAlertService } from "../../../shared/services/sweet-alert.service";
import { AppointmentTreatmentAilmentService } from "../service/appointment-treatment-ailment.service";
import {AilmentService} from "../../ailment/service/ailment.service";

@Component({
  selector: 'medi-appointment-treatment-ailment-register',
  templateUrl: './appointment-treatment-ailment-register.component.html',
  styleUrls: ['./appointment-treatment-ailment-register.component.scss']
})
export class AppointmentTreatmentAilmentRegisterComponent implements OnInit{
  ailments: any[] = [];
  public registerForm: FormGroup = this.fb.group({
    ailment: [[Validators.required]],
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

  public getAllAilments(): void {
    this.ailmentService.query().subscribe((res: any) => {
      this.ailments = res.body;
      console.log(this.ailments);
    });
  }

  public save(): void {
    console.log(this.registerForm.value);
  }

}
