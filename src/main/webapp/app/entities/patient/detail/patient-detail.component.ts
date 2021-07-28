import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from './../../../core/auth/account.model';
import { IPatient } from '../patient.model';
import { AilmentService } from '../../ailment/service/ailment.service';
import { EmergencyContactService } from '../../emergency-contact/service/emergency-contact.service';

@Component({
  selector: 'medi-patient-detail',
  templateUrl: './patient-detail.component.html',
})
export class PatientDetailComponent implements OnInit {
  patient: any = {};
  ailments: any = [];
  emergencyContacts: any = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private ailmentService: AilmentService,
    private emergencyContactService: EmergencyContactService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.patient = new Patient(patient);
      this.ailmentService.findAllAilmentsPacient(this.patient.patientId).subscribe(pacientAilments => {
        this.ailments = pacientAilments.body;
        this.emergencyContactService.findByPatientId(this.patient.patientId).subscribe((res: any) => {
          this.emergencyContacts = res.body;
        });
      });
    });
  }

  previousState(): void {
    window.history.back();
  }
}
