import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';

import { PasswordResetInitService } from './password-reset-init.service';
import { SweetAlertServiceService } from "../../../shared/services/sweet-alert-service.service";


@Component({
  selector: 'medi-password-reset-init',
  templateUrl: './password-reset-init.component.html',
  styleUrls: ["./password-reset-init.component.scss"]
})
export class PasswordResetInitComponent implements AfterViewInit {
  @ViewChild('email', { static: false })
  email?: ElementRef;

  success = false;
  resetRequestForm = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private passwordResetInitService: PasswordResetInitService,
    private sweetAlertService: SweetAlertServiceService,
  ) {}

  public get emailRecover(): string {
    return <string>this.resetRequestForm.get(['email'])!.value
  }

  public ngAfterViewInit(): void {
    if (this.email) {
      this.email.nativeElement.focus();
    }
  }

  public requestReset(): void {
    this.passwordResetInitService.save(this.emailRecover).subscribe(() => {
      this.sweetAlertService.showMsjSuccess('reset.request.messages.success', 'reset.done').then(() => {
        this.resetRequestForm.reset();
        this.router.navigate(['/']);
      })
      this.success = true
    });
  }
}
