import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPatient, Patient } from '../patient.model';
import { PatientService } from '../service/patient.service';

@Injectable({ providedIn: 'root' })
export class PatientRoutingResolveService implements Resolve<IPatient> {
  constructor(protected service: PatientService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPatient> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((patient: HttpResponse<Patient>) => {
          if (patient.body) {
            return of(patient.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Patient());
  }
}
