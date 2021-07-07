import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRatingUser, RatingUser } from '../rating-user.model';
import { RatingUserService } from '../service/rating-user.service';

@Injectable({ providedIn: 'root' })
export class RatingUserRoutingResolveService implements Resolve<IRatingUser> {
  constructor(protected service: RatingUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRatingUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ratingUser: HttpResponse<RatingUser>) => {
          if (ratingUser.body) {
            return of(ratingUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RatingUser());
  }
}
