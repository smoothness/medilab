import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'medi-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent {
  @Output() password: EventEmitter<string> = new EventEmitter();
  public doNotMatch = false;
  public passwordForm = this.fb.group({
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  get newPassword(): string {
    return <string>this.passwordForm.get(['newPassword'])!.value;
  }

  get confirmPassword(): string {
    return <string>this.passwordForm.get(['confirmPassword'])!.value;
  }

  constructor(private fb: FormBuilder) {}

  validatePassword(): void {
    this.doNotMatch = false;

    if (this.newPassword === this.confirmPassword) {
      this.doNotMatch = true;
      this.password.emit(this.newPassword);
    }
  }
}
