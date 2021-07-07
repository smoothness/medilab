import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedicalExams, getMedicalExamsIdentifier } from '../medical-exams.model';

export type EntityResponseType = HttpResponse<IMedicalExams>;
export type EntityArrayResponseType = HttpResponse<IMedicalExams[]>;

@Injectable({ providedIn: 'root' })
export class MedicalExamsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medical-exams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(medicalExams: IMedicalExams): Observable<EntityResponseType> {
    return this.http.post<IMedicalExams>(this.resourceUrl, medicalExams, { observe: 'response' });
  }

  update(medicalExams: IMedicalExams): Observable<EntityResponseType> {
    return this.http.put<IMedicalExams>(`${this.resourceUrl}/${getMedicalExamsIdentifier(medicalExams) as number}`, medicalExams, {
      observe: 'response',
    });
  }

  partialUpdate(medicalExams: IMedicalExams): Observable<EntityResponseType> {
    return this.http.patch<IMedicalExams>(`${this.resourceUrl}/${getMedicalExamsIdentifier(medicalExams) as number}`, medicalExams, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedicalExams>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedicalExams[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMedicalExamsToCollectionIfMissing(
    medicalExamsCollection: IMedicalExams[],
    ...medicalExamsToCheck: (IMedicalExams | null | undefined)[]
  ): IMedicalExams[] {
    const medicalExams: IMedicalExams[] = medicalExamsToCheck.filter(isPresent);
    if (medicalExams.length > 0) {
      const medicalExamsCollectionIdentifiers = medicalExamsCollection.map(
        medicalExamsItem => getMedicalExamsIdentifier(medicalExamsItem)!
      );
      const medicalExamsToAdd = medicalExams.filter(medicalExamsItem => {
        const medicalExamsIdentifier = getMedicalExamsIdentifier(medicalExamsItem);
        if (medicalExamsIdentifier == null || medicalExamsCollectionIdentifiers.includes(medicalExamsIdentifier)) {
          return false;
        }
        medicalExamsCollectionIdentifiers.push(medicalExamsIdentifier);
        return true;
      });
      return [...medicalExamsToAdd, ...medicalExamsCollection];
    }
    return medicalExamsCollection;
  }
}
