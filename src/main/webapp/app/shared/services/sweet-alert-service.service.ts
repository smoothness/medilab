import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { msjConfig } from './mesages.model';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertServiceService {
  constructor(private translateService: TranslateService) {}

  public showMsjError(title: string, msj: string): void {
    this.showAlert({
      icon: 'error',
      title,
      text: msj,
    });
  }

  public showInfoWarning(title: string, msj: string): void {
    this.showAlert({
      icon: 'info',
      title,
      text: msj,
    });
  }

  public showMsjSuccess(title: string, msj: string): void {
    this.showAlert({
      icon: 'success',
      title,
      text: msj,
    });
  }

  public showMsjWarning(title: string, msj: string): void {
    this.showAlert({
      icon: 'warning',
      title,
      text: msj,
    });
  }

  private showAlert({ icon, title, text }: msjConfig): void {
    Swal.fire(<any>{
      icon,
      title: this.translateService.instant(title),
      text: this.translateService.instant(text),
    });
  }
}
