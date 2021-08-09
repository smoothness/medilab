import {Component, EventEmitter, Input, Output} from '@angular/core';
import { PatientService } from "../entities/patient/service/patient.service";
import { Patient } from "../core/auth/account.model";

@Component({
  selector: 'medi-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss']
})
export class TokenComponent {
  @Input() currentUser?: Patient;
  @Output() user: EventEmitter<string> = new EventEmitter<string>();

  constructor(private patientService: PatientService) {
  }

  public createToken(): void {
    this.patientService.createToken(<Patient>this.currentUser).subscribe((res: any) => {
      this.currentUser?.setToken(res.token);
      this.user.emit(this.currentUser?.token);
    });
  }
}
