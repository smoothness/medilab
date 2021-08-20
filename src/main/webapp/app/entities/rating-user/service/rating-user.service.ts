import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRatingUser, getRatingUserIdentifier } from '../rating-user.model';

export type EntityResponseType = HttpResponse<IRatingUser>;
export type EntityArrayResponseType = HttpResponse<IRatingUser[]>;

@Injectable({ providedIn: 'root' })
export class RatingUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rating-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ratingUser: IRatingUser): Observable<EntityResponseType> {
    return this.http.post<IRatingUser>(this.resourceUrl, ratingUser, { observe: 'response' });
  }

  update(ratingUser: IRatingUser): Observable<EntityResponseType> {
    return this.http.put<IRatingUser>(`${this.resourceUrl}/${getRatingUserIdentifier(ratingUser) as number}`, ratingUser, {
      observe: 'response',
    });
  }


  partialUpdate(ratingUser: IRatingUser): Observable<EntityResponseType> {
    return this.http.patch<IRatingUser>(`${this.resourceUrl}/${getRatingUserIdentifier(ratingUser) as number}`, ratingUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRatingUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByDoctor(id: number): Observable<{}> {
    return this.http.get(`${this.resourceUrl}/average/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRatingUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRatingUserToCollectionIfMissing(
    ratingUserCollection: IRatingUser[],
    ...ratingUsersToCheck: (IRatingUser | null | undefined)[]
  ): IRatingUser[] {
    const ratingUsers: IRatingUser[] = ratingUsersToCheck.filter(isPresent);
    if (ratingUsers.length > 0) {
      const ratingUserCollectionIdentifiers = ratingUserCollection.map(ratingUserItem => getRatingUserIdentifier(ratingUserItem)!);
      const ratingUsersToAdd = ratingUsers.filter(ratingUserItem => {
        const ratingUserIdentifier = getRatingUserIdentifier(ratingUserItem);
        if (ratingUserIdentifier == null || ratingUserCollectionIdentifiers.includes(ratingUserIdentifier)) {
          return false;
        }
        ratingUserCollectionIdentifiers.push(ratingUserIdentifier);
        return true;
      });
      return [...ratingUsersToAdd, ...ratingUserCollection];
    }
    return ratingUserCollection;
  }
}
