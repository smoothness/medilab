import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SweetAlertService } from "../../shared/services/sweet-alert.service";

@Component({
  selector: 'medi-view-patient-by-token',
  templateUrl: './view-patient-by-token.component.html',
  styleUrls: ['./view-patient-by-token.component.scss']
})
export class ViewPatientByTokenComponent implements OnInit {
  key = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlertService: SweetAlertService
  ) {
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['key']) {
        this.key = params['key'];
      } else {
        this.showError();
      }
    });
  }

  public showError(): void {
    this.sweetAlertService.showMsjError('register.messages.error.error', 'reset.finish.messages.keymissing').then(() => {
      this.router.navigate(['/home']);
    });
  }
}
