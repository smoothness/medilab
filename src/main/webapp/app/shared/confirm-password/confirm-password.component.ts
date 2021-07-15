import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'medi-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent {
  constructor(private fb: FormBuilder) {}
}
