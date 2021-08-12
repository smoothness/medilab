import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'medi-treatment-register',
  templateUrl: './treatment-register.component.html',
  styleUrls: ['./treatment-register.component.scss']
})
export class TreatmentRegisterComponent implements OnInit {
  public parentReference: any;
  public index = 0;

  public registerForm: FormGroup = this.fb.group({
    medicines: ['',[Validators.required]],
    duration: ['',[Validators.required]],
    specifications: ['',[Validators.required]]
  });

  constructor(private fb: FormBuilder) {
    this.parentReference = '';

  }

  ngOnInit(): void {
    console.log("");

  }

  public setInitData(parent: any, pIndex: number): void {
    this.index = pIndex;
    this.parentReference = parent;
  }

}
