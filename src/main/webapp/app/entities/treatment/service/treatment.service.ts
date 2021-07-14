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

  partialUpdate(treatment: ITreatment): Observable<EntityResponseType> {
    return this.http.patch<ITreatment>(`${this.resourceUrl}/${getTreatmentIdentifier(treatment) as number}`, treatment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITreatment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByTreatmentAndAppointment(id_treatment: number, id_appointment: number): Observable<EntityResponseType> {
    return this.http.get<ITreatment>(`${this.resourceUrl}/${id_treatment}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITreatment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTreatmentToCollectionIfMissing(
    treatmentCollection: ITreatment[],
    ...treatmentsToCheck: (ITreatment | null | undefined)[]
  ): ITreatment[] {
    const treatments: ITreatment[] = treatmentsToCheck.filter(isPresent);
    if (treatments.length > 0) {
      const treatmentCollectionIdentifiers = treatmentCollection.map(treatmentItem => getTreatmentIdentifier(treatmentItem)!);
      const treatmentsToAdd = treatments.filter(treatmentItem => {
        const treatmentIdentifier = getTreatmentIdentifier(treatmentItem);
        if (treatmentIdentifier == null || treatmentCollectionIdentifiers.includes(treatmentIdentifier)) {
          return false;
        }
        treatmentCollectionIdentifiers.push(treatmentIdentifier);
        return true;
      });
      return [...treatmentsToAdd, ...treatmentCollection];
    }
    return treatmentCollection;
  }
}
