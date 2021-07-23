import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import { PasswordResetFinishService } from './password-reset-finish.service';
import {SweetAlertServiceService} from "../../../shared/services/sweet-alert-service.service";

@Component({
  selector: 'medi-password-reset-finish',
  templateUrl: './password-reset-finish.component.html',
  styleUrls: ['./password-reset-finish.component.scss']
})
export class PasswordResetFinishComponent implements OnInit, AfterViewInit {
  @ViewChild('newPassword', { static: false })
  newPassword?: ElementRef;
  doNotMatch = false;
  key = '';

  passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });

  constructor(
    private passwordResetFinishService: PasswordResetFinishService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sweetAlertService: SweetAlertServiceService
  ) {}

  public get confirmPasswordForm(): string {
    return <string>this.passwordForm.get(['confirmPassword'])!.value
  }

  public get newPasswordForm(): string {
    return <string>this.passwordForm.get(['newPassword'])!.value
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['key']) {
        this.key = params['key'];
      } else {
        this.sweetAlertService.showMsjError('register.messages.error.error', 'reset.finish.messages.keymissing').then(() => {
          this.router.navigate(['']);
        });
      }
    });
  }

  public ngAfterViewInit(): void {
    if (this.newPassword) {
      this.newPassword.nativeElement.focus();
    }
  }

  public finishReset(): void {
    this.doNotMatch = false;

    if (this.newPasswordForm !== this.confirmPasswordForm) {
      this.sweetAlertService.showMsjWarning('reset.done', 'global.messages.error.dontmatch');
    } else {
      this.passwordResetFinishService.save(this.key, this.newPasswordForm).subscribe(
        () => {
          this.sweetAlertService.showMsjSuccess('reset.done', 'reset.finish.messages.success').then(() => {
            this.router.navigate(['']);
          });
        },
        () => {
          this.sweetAlertService.showMsjError('register.messages.error.error', 'reset.finish.messages.error');
        }
      );
    }
  }
}
