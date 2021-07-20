import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertServiceService {
  public showRegisterSuccess(): void {
    Swal.fire({
      title: '',
    });
  }
}
