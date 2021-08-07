import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PatientService} from "../../entities/patient/service/patient.service";
import {SweetAlertService} from "../../shared/services/sweet-alert.service";
import {HttpErrorResponse} from "@angular/common/http";
import {INVALID_KEY_TOKEN} from "../../config/error.constants";

@Component({
  selector: 'medi-get-patient-by-token',
  templateUrl: './get-patient-by-token.component.html',
  styleUrls: ['./get-patient-by-token.component.scss']
})
export class GetPatientByTokenComponent {
  searchForm: FormGroup = this.fb.group({
    token: ['', [Validators.required]],
    doctorCode: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private sweetAlertService: SweetAlertService
  ) {
  }

  public find(): void {
    this.patientService.findOneByToken(this.searchForm.value.token, this.searchForm.value.doctorCode).subscribe((res) => {
      console.log(res);
    },
      response => this.processError(response)
      );
  }

  public processError(response: HttpErrorResponse): void {
    if(response.status === 400 && response.error.type === INVALID_KEY_TOKEN ){
      this.sweetAlertService.showMsjError('register.messages.error.error', 'reset.finish.messages.keymissing');
    }
  }

}
