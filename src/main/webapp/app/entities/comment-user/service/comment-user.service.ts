import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommentUser, getCommentUserIdentifier } from '../comment-user.model';

export type EntityResponseType = HttpResponse<ICommentUser>;
export type EntityArrayResponseType = HttpResponse<ICommentUser[]>;

@Injectable({ providedIn: 'root' })
export class CommentUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/comment-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(commentUser: ICommentUser): Observable<EntityResponseType> {
    return this.http.post<ICommentUser>(this.resourceUrl, commentUser, { observe: 'response' });
  }

  update(commentUser: ICommentUser): Observable<EntityResponseType> {
    return this.http.put<ICommentUser>(`${this.resourceUrl}/${getCommentUserIdentifier(commentUser) as number}`, commentUser, {
      observe: 'response',
    });
  }

  partialUpdate(commentUser: ICommentUser): Observable<EntityResponseType> {
    return this.http.patch<ICommentUser>(`${this.resourceUrl}/${getCommentUserIdentifier(commentUser) as number}`, commentUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommentUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommentUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCommentUserToCollectionIfMissing(
    commentUserCollection: ICommentUser[],
    ...commentUsersToCheck: (ICommentUser | null | undefined)[]
  ): ICommentUser[] {
    const commentUsers: ICommentUser[] = commentUsersToCheck.filter(isPresent);
    if (commentUsers.length > 0) {
      const commentUserCollectionIdentifiers = commentUserCollection.map(commentUserItem => getCommentUserIdentifier(commentUserItem)!);
      const commentUsersToAdd = commentUsers.filter(commentUserItem => {
        const commentUserIdentifier = getCommentUserIdentifier(commentUserItem);
        if (commentUserIdentifier == null || commentUserCollectionIdentifiers.includes(commentUserIdentifier)) {
          return false;
        }
        commentUserCollectionIdentifiers.push(commentUserIdentifier);
        return true;
      });
      return [...commentUsersToAdd, ...commentUserCollection];
    }
    return commentUserCollection;
  }
}
