import {Component, Input, OnInit} from '@angular/core';
import {UserProfileService} from "./user-profile.service";
import {AccountService} from "../../core/auth/account.service";
import {PatientService} from "../../entities/patient/service/patient.service";
import {DoctorService} from "../../entities/doctor/service/doctor.service";
import {Doctor, Patient} from "../../core/auth/account.model";

@Component({
  selector: 'medi-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Input() user: any;

  constructor(
    private userProfileService: UserProfileService,
    private accountService: AccountService,
    private patientService: PatientService,
    private doctorService: DoctorService) {}

  get isPatient(): boolean {
    return this.user instanceof Patient;
  }

  get isDoctor(): boolean {
    return this.user instanceof Doctor;
  }
}
