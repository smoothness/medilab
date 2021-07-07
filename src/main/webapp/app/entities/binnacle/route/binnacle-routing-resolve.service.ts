import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBinnacle, Binnacle } from '../binnacle.model';
import { BinnacleService } from '../service/binnacle.service';

@Injectable({ providedIn: 'root' })
export class BinnacleRoutingResolveService implements Resolve<IBinnacle> {
  constructor(protected service: BinnacleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBinnacle> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((binnacle: HttpResponse<Binnacle>) => {
          if (binnacle.body) {
            return of(binnacle.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Binnacle());
  }
}
