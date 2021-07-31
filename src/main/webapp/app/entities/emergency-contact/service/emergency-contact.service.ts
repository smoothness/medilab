import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmergencyContact, getEmergencyContactIdentifier } from '../emergency-contact.model';

export type EntityResponseType = HttpResponse<IEmergencyContact>;
export type EntityArrayResponseType = HttpResponse<IEmergencyContact[]>;

@Injectable({ providedIn: 'root' })
export class EmergencyContactService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emergency-contacts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emergencyContact: IEmergencyContact): Observable<EntityResponseType> {
    return this.http.post<IEmergencyContact>(this.resourceUrl, emergencyContact, { observe: 'response' });
  }

  update(emergencyContact: IEmergencyContact): Observable<EntityResponseType> {
    return this.http.put<IEmergencyContact>(
      `${this.resourceUrl}/${getEmergencyContactIdentifier(emergencyContact) as number}`,
      emergencyContact,
      { observe: 'response' }
    );
  }

  partialUpdate(emergencyContact: IEmergencyContact): Observable<EntityResponseType> {
    return this.http.patch<IEmergencyContact>(
      `${this.resourceUrl}/${getEmergencyContactIdentifier(emergencyContact) as number}`,
      emergencyContact,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmergencyContact>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByPatientId(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmergencyContact>(`${this.resourceUrl}-patient/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmergencyContact[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmergencyContactToCollectionIfMissing(
    emergencyContactCollection: IEmergencyContact[],
    ...emergencyContactsToCheck: (IEmergencyContact | null | undefined)[]
  ): IEmergencyContact[] {
    const emergencyContacts: IEmergencyContact[] = emergencyContactsToCheck.filter(isPresent);
    if (emergencyContacts.length > 0) {
      const emergencyContactCollectionIdentifiers = emergencyContactCollection.map(
        emergencyContactItem => getEmergencyContactIdentifier(emergencyContactItem)!
      );
      const emergencyContactsToAdd = emergencyContacts.filter(emergencyContactItem => {
        const emergencyContactIdentifier = getEmergencyContactIdentifier(emergencyContactItem);
        if (emergencyContactIdentifier == null || emergencyContactCollectionIdentifiers.includes(emergencyContactIdentifier)) {
          return false;
        }
        emergencyContactCollectionIdentifiers.push(emergencyContactIdentifier);
        return true;
      });
      return [...emergencyContactsToAdd, ...emergencyContactCollection];
    }
    return emergencyContactCollection;
  }
}
