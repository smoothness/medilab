import {Component, Input} from '@angular/core';
import {Doctor, Patient} from "../../core/auth/account.model";

@Component({
  selector: 'medi-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Input() user: any;

  get isPatient(): boolean {
    return this.user instanceof Patient;
  }

  get isDoctor(): boolean {
    return this.user instanceof Doctor;
  }
}
