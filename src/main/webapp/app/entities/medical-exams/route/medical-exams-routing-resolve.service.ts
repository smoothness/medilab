import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedicalExams, MedicalExams } from '../medical-exams.model';
import { MedicalExamsService } from '../service/medical-exams.service';

@Injectable({ providedIn: 'root' })
export class MedicalExamsRoutingResolveService implements Resolve<IMedicalExams> {
  constructor(protected service: MedicalExamsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedicalExams> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((medicalExams: HttpResponse<MedicalExams>) => {
          if (medicalExams.body) {
            return of(medicalExams.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new MedicalExams());
  }
}
