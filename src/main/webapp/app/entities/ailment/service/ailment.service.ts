import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAilment, getAilmentIdentifier } from '../ailment.model';

export type EntityResponseType = HttpResponse<IAilment>;
export type EntityArrayResponseType = HttpResponse<IAilment[]>;

@Injectable({ providedIn: 'root' })
export class AilmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ailments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ailment: IAilment): Observable<EntityResponseType> {
    return this.http.post<IAilment>(this.resourceUrl, ailment, { observe: 'response' });
  }

  update(ailment: IAilment): Observable<EntityResponseType> {
    return this.http.put<IAilment>(`${this.resourceUrl}/${getAilmentIdentifier(ailment) as number}`, ailment, { observe: 'response' });
  }

  partialUpdate(ailment: IAilment): Observable<EntityResponseType> {
    return this.http.patch<IAilment>(`${this.resourceUrl}/${getAilmentIdentifier(ailment) as number}`, ailment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAilment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAllAilmentsPacient(id: number): Observable<EntityResponseType> {
    return this.http.get<IAilment>(`${this.resourceUrl}-patient/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAilment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAilmentToCollectionIfMissing(ailmentCollection: IAilment[], ...ailmentsToCheck: (IAilment | null | undefined)[]): IAilment[] {
    const ailments: IAilment[] = ailmentsToCheck.filter(isPresent);
    if (ailments.length > 0) {
      const ailmentCollectionIdentifiers = ailmentCollection.map(ailmentItem => getAilmentIdentifier(ailmentItem)!);
      const ailmentsToAdd = ailments.filter(ailmentItem => {
        const ailmentIdentifier = getAilmentIdentifier(ailmentItem);
        if (ailmentIdentifier == null || ailmentCollectionIdentifiers.includes(ailmentIdentifier)) {
          return false;
        }
        ailmentCollectionIdentifiers.push(ailmentIdentifier);
        return true;
      });
      return [...ailmentsToAdd, ...ailmentCollection];
    }
    return ailmentCollection;
  }
}
