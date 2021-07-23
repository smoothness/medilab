import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from '../password.service';
import {SweetAlertServiceService} from "../../../shared/services/sweet-alert-service.service";

@Component({
  selector: 'medi-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  account$?: Observable<Account | null>;
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });

  constructor(
    private passwordService: PasswordService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private swalService: SweetAlertServiceService
  ) {}

  public get confirmPassword(): string {
    return <string>this.passwordForm.get(['confirmPassword'])!.value;
  }

  public get currentPassword(): string {
    return <string>this.passwordForm.get(['currentPassword'])!.value;
  }

  public get newPassword(): string {
    return <string>this.passwordForm.get(['newPassword'])!.value;
  }

  public ngOnInit(): void {
    this.account$ = this.accountService.identity();
  }

  public changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.swalService.showInfoWarning("register.messages.error.error", "global.messages.error.dontmatch")
    } else {
      this.passwordService.save(this.newPassword, this.currentPassword).subscribe(
        () => {
          this.swalService.showMsjSuccess("password.messages.success", "password.messages.done").then(() => {
            this.passwordForm.reset();
          });
        },
        () => {
          this.swalService.showMsjError("register.messages.error.error", "password.messages.error");
        }
      );
    }
  }
}
