import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAilment, Ailment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';

@Injectable({ providedIn: 'root' })
export class AilmentRoutingResolveService implements Resolve<IAilment> {
  constructor(protected service: AilmentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAilment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ailment: HttpResponse<Ailment>) => {
          if (ailment.body) {
            return of(ailment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ailment());
  }
}
