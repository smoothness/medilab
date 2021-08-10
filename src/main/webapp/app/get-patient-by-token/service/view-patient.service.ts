import { Injectable } from '@angular/core';
import { PatientService } from "../../entities/patient/service/patient.service";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {EMPTY, Observable, of} from "rxjs";
import {catchError, mergeMap} from "rxjs/operators";
import {Patient} from "../../core/auth/account.model";
import {SweetAlertService} from "../../shared/services/sweet-alert.service";

@Injectable({
  providedIn: 'root'
})
export class ViewPatientService {
  constructor(
    protected service: PatientService,
    protected router: Router,
    protected sweetAlertService: SweetAlertService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Patient> | undefined{
    const key = route.params['key'];
    const doctorCode = route.params['doctorCode'];

    return this.service.findOneByToken(key, doctorCode).pipe(
        mergeMap((patient: any) => {
          if (patient) {
            return of(new Patient(patient));
          }else{

            return EMPTY;
          }
        }), catchError( () => EMPTY)
      );
  }
}
