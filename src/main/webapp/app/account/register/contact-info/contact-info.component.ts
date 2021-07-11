import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'medi-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  errorEmailExists = false;
  @Input() contactInfoForm : FormGroup = new FormGroup({});
  
  ngOnInit(): string {
    return "test";
  }

}
