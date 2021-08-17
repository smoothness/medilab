import { Component } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'medi-cancel-button',
  templateUrl: './cancel-button.component.html',
  styleUrls: ['./cancel-button.component.scss']
})
export class CancelButtonComponent  {

  constructor(protected activeModal: NgbActiveModal) { }

  cancel(): void {
    this.activeModal.dismiss();
  }

}
