import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppointment, Appointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';

@Injectable({ providedIn: 'root' })
export class AppointmentRoutingResolveService implements Resolve<IAppointment> {
  constructor(protected service: AppointmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppointment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((appointment: HttpResponse<Appointment>) => {
          if (appointment.body) {
            return of(appointment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Appointment());
  }
}
