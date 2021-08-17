import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITreatment, getTreatmentIdentifier } from '../treatment.model';

export type EntityResponseType = HttpResponse<ITreatment>;
export type EntityArrayResponseType = HttpResponse<ITreatment[]>;

@Injectable({ providedIn: 'root' })
export class TreatmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/treatments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(treatment: ITreatment): Observable<EntityResponseType> {
    return this.http.post<ITreatment>(this.resourceUrl, treatment, { observe: 'response' });
  }

  update(treatment: ITreatment): Observable<EntityResponseType> {
    return this.http.put<ITreatment>(`${this.resourceUrl}/${getTreatmentIdentifier(treatment) as number}`, treatment, {
      observe: 'response',
    });
  }

  updateRemoved(treatmentId: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/removed/${treatmentId}`, {observe: 'response'});
  }

  partialUpdate(treatment: ITreatment): Observable<EntityResponseType> {
    return this.http.patch<ITreatment>(`${this.resourceUrl}/${getTreatmentIdentifier(treatment) as number}`, treatment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITreatment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByAilment(ailmentId: number, appointmentId: number): Observable<EntityResponseType> {
    return this.http.get<ITreatment>(`${this.resourceUrl}/ailment/${ailmentId}/${appointmentId}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITreatment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

}
