import { Component } from '@angular/core';

@Component({
  selector: 'medi-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent  {

  previousState(): void {
    window.history.back();
  }
}
