import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommentUser, CommentUser } from '../comment-user.model';
import { CommentUserService } from '../service/comment-user.service';

@Injectable({ providedIn: 'root' })
export class CommentUserRoutingResolveService implements Resolve<ICommentUser> {
  constructor(protected service: CommentUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommentUser> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((commentUser: HttpResponse<CommentUser>) => {
          if (commentUser.body) {
            return of(commentUser.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CommentUser());
  }
}
