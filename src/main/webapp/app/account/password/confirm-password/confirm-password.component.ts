import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'medi-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent {
  @Output() password: EventEmitter<string> = new EventEmitter();
  @Input() passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
  });
  public doNotMatch = false;

  public constructor(private fb: FormBuilder) {}

  public get newPassword(): string {
    return <string>this.passwordForm.get(['newPassword'])!.value;
  }

  public get confirmPassword(): string {
    return <string>this.passwordForm.get(['confirmPassword'])!.value;
  }

  public validatePassword(): void {
    this.doNotMatch = false;

    if (this.newPassword === this.confirmPassword) {
      this.doNotMatch = true;
      this.password.emit(this.newPassword);
    }
  }
}
