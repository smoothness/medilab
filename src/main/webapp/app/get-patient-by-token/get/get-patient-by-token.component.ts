import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientService } from "../../entities/patient/service/patient.service";
import { SweetAlertService } from "../../shared/services/sweet-alert.service";
import { Patient } from "../../core/auth/account.model";
import { Router } from "@angular/router";

@Component({
  selector: 'medi-get-patient-by-token',
  templateUrl: './get-patient-by-token.component.html',
  styleUrls: ['./get-patient-by-token.component.scss']
})
export class GetPatientByTokenComponent {
  consultedPatient?: Patient;

  searchForm: FormGroup = this.fb.group({
    token: ['', [Validators.required]],
    doctorCode: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private patientService: PatientService,
    private sweetAlertService: SweetAlertService
  ) {
  }

  public find(): void {
    this.router.navigate([`/token/view`, {
      key: this.searchForm.value.token,
      doctorCode: this.searchForm.value.doctorCode
    }]).then((res) => {
      if(!res){
        this.processError();
      }
    });
  }

  public processError(): void {
    this.sweetAlertService.showMsjError('register.messages.error.error', 'token.invalidKey');
  }
}
