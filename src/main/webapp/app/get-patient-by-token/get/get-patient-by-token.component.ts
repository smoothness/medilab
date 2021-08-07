import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'medi-get-patient-by-token',
  templateUrl: './get-patient-by-token.component.html',
  styleUrls: ['./get-patient-by-token.component.scss']
})
export class GetPatientByTokenComponent  {
  searchForm: FormGroup = this.fb.group({
    token: ['', [Validators.required]],
    doctorCode: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder
  ) {
  }

  public find(): void {
    console.log(this.searchForm.value);
  }

}
