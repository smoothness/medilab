import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPatient, getPatientIdentifier } from '../patient.model';

export type EntityResponseType = HttpResponse<IPatient>;
export type EntityArrayResponseType = HttpResponse<IPatient[]>;

@Injectable({ providedIn: 'root' })
export class PatientService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/patients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(patient: IPatient): Observable<EntityResponseType> {
    return this.http.post<IPatient>(this.resourceUrl, patient, { observe: 'response' });
  }

  update(patient: IPatient): Observable<EntityResponseType> {
    return this.http.put<IPatient>(`${this.resourceUrl}/${getPatientIdentifier(patient) as number}`, patient, { observe: 'response' });
  }

  partialUpdate(patient: IPatient): Observable<EntityResponseType> {
    return this.http.patch<IPatient>(`${this.resourceUrl}/${getPatientIdentifier(patient) as number}`, patient, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPatient>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPatient[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPatientToCollectionIfMissing(patientCollection: IPatient[], ...patientsToCheck: (IPatient | null | undefined)[]): IPatient[] {
    const patients: IPatient[] = patientsToCheck.filter(isPresent);
    if (patients.length > 0) {
      const patientCollectionIdentifiers = patientCollection.map(patientItem => getPatientIdentifier(patientItem)!);
      const patientsToAdd = patients.filter(patientItem => {
        const patientIdentifier = getPatientIdentifier(patientItem);
        if (patientIdentifier == null || patientCollectionIdentifiers.includes(patientIdentifier)) {
          return false;
        }
        patientCollectionIdentifiers.push(patientIdentifier);
        return true;
      });
      return [...patientsToAdd, ...patientCollection];
    }
    return patientCollection;
  }
}
