import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppointmentTreatmentAilment, AppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';
import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';

@Injectable({ providedIn: 'root' })
export class AppointmentTreatmentAilmentRoutingResolveService implements Resolve<IAppointmentTreatmentAilment> {
  constructor(protected service: AppointmentTreatmentAilmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppointmentTreatmentAilment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((appointmentTreatmentAilment: HttpResponse<AppointmentTreatmentAilment>) => {
          if (appointmentTreatmentAilment.body) {
            return of(appointmentTreatmentAilment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AppointmentTreatmentAilment());
  }
}
