import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {EmergencyContactService} from "../service/emergency-contact.service";

@Component({
  selector: 'medi-emergency-contact-detail',
  templateUrl: './emergency-contact-detail.component.html',
})
export class EmergencyContactDetailComponent implements OnInit {
  @Input() patientId: any;
  emergencyContacts: any;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private emergencyContactService: EmergencyContactService
  ) {}

  ngOnInit(): void {
    this.emergencyContactService.findByPatientId(this.patientId).subscribe((res: any) => {
      this.emergencyContacts = res.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
