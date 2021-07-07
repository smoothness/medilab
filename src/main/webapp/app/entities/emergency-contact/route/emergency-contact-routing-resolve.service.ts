import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmergencyContact, EmergencyContact } from '../emergency-contact.model';
import { EmergencyContactService } from '../service/emergency-contact.service';

@Injectable({ providedIn: 'root' })
export class EmergencyContactRoutingResolveService implements Resolve<IEmergencyContact> {
  constructor(protected service: EmergencyContactService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmergencyContact> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emergencyContact: HttpResponse<EmergencyContact>) => {
          if (emergencyContact.body) {
            return of(emergencyContact.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EmergencyContact());
  }
}
