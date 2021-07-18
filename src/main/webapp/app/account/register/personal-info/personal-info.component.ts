import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'medi-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  errorUserExists = false;
  @Input() personalDataForm: FormGroup = new FormGroup({});

  ngOnInit(): string {
    return 'test';
  }
}
