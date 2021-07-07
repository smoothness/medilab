import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDoctor, Doctor } from '../doctor.model';
import { DoctorService } from '../service/doctor.service';

@Injectable({ providedIn: 'root' })
export class DoctorRoutingResolveService implements Resolve<IDoctor> {
  constructor(protected service: DoctorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDoctor> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((doctor: HttpResponse<Doctor>) => {
          if (doctor.body) {
            return of(doctor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Doctor());
  }
}
