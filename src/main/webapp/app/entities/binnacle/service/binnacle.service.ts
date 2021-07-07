import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBinnacle, getBinnacleIdentifier } from '../binnacle.model';

export type EntityResponseType = HttpResponse<IBinnacle>;
export type EntityArrayResponseType = HttpResponse<IBinnacle[]>;

@Injectable({ providedIn: 'root' })
export class BinnacleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/binnacles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(binnacle: IBinnacle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(binnacle);
    return this.http
      .post<IBinnacle>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(binnacle: IBinnacle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(binnacle);
    return this.http
      .put<IBinnacle>(`${this.resourceUrl}/${getBinnacleIdentifier(binnacle) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(binnacle: IBinnacle): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(binnacle);
    return this.http
      .patch<IBinnacle>(`${this.resourceUrl}/${getBinnacleIdentifier(binnacle) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBinnacle>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBinnacle[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBinnacleToCollectionIfMissing(binnacleCollection: IBinnacle[], ...binnaclesToCheck: (IBinnacle | null | undefined)[]): IBinnacle[] {
    const binnacles: IBinnacle[] = binnaclesToCheck.filter(isPresent);
    if (binnacles.length > 0) {
      const binnacleCollectionIdentifiers = binnacleCollection.map(binnacleItem => getBinnacleIdentifier(binnacleItem)!);
      const binnaclesToAdd = binnacles.filter(binnacleItem => {
        const binnacleIdentifier = getBinnacleIdentifier(binnacleItem);
        if (binnacleIdentifier == null || binnacleCollectionIdentifiers.includes(binnacleIdentifier)) {
          return false;
        }
        binnacleCollectionIdentifiers.push(binnacleIdentifier);
        return true;
      });
      return [...binnaclesToAdd, ...binnacleCollection];
    }
    return binnacleCollection;
  }

  protected convertDateFromClient(binnacle: IBinnacle): IBinnacle {
    return Object.assign({}, binnacle, {
      date: binnacle.date?.isValid() ? binnacle.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((binnacle: IBinnacle) => {
        binnacle.date = binnacle.date ? dayjs(binnacle.date) : undefined;
      });
    }
    return res;
  }
}
