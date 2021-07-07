import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILineComment, LineComment } from '../line-comment.model';
import { LineCommentService } from '../service/line-comment.service';

@Injectable({ providedIn: 'root' })
export class LineCommentRoutingResolveService implements Resolve<ILineComment> {
  constructor(protected service: LineCommentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILineComment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lineComment: HttpResponse<LineComment>) => {
          if (lineComment.body) {
            return of(lineComment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LineComment());
  }
}
