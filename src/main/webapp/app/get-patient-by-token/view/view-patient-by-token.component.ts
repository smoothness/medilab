import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SweetAlertService } from "../../shared/services/sweet-alert.service";
import {Patient} from "../../core/auth/account.model";

@Component({
  selector: 'medi-view-patient-by-token',
  templateUrl: './view-patient-by-token.component.html',
  styleUrls: ['./view-patient-by-token.component.scss']
})
export class ViewPatientByTokenComponent implements OnInit {
  patient?: Patient;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {
  }

  public ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
        this.patient = patient;
    })
  }

  public showError(): void {
    this.sweetAlertService.showMsjError('register.messages.error.error', 'reset.finish.messages.keymissing').then(() => {
      this.router.navigate(['/token/get']);
    });
  }
}
