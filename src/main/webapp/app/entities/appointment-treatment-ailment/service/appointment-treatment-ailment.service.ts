import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppointmentTreatmentAilment, getAppointmentTreatmentAilmentIdentifier } from '../appointment-treatment-ailment.model';

export type EntityResponseType = HttpResponse<IAppointmentTreatmentAilment>;
export type EntityArrayResponseType = HttpResponse<IAppointmentTreatmentAilment[]>;

@Injectable({ providedIn: 'root' })
export class AppointmentTreatmentAilmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/appointment-treatment-ailments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}


  create(appointmentTreatmentAilment: IAppointmentTreatmentAilment): Observable<EntityResponseType> {
    return this.http.post<IAppointmentTreatmentAilment>(this.resourceUrl, appointmentTreatmentAilment, { observe: 'response' });
  }

  update(appointmentTreatmentAilment: IAppointmentTreatmentAilment): Observable<EntityResponseType> {
    return this.http.put<IAppointmentTreatmentAilment>(
      `${this.resourceUrl}/${getAppointmentTreatmentAilmentIdentifier(appointmentTreatmentAilment) as number}`,
      appointmentTreatmentAilment,
      { observe: 'response' }
    );
  }

  partialUpdate(appointmentTreatmentAilment: IAppointmentTreatmentAilment): Observable<EntityResponseType> {
    return this.http.patch<IAppointmentTreatmentAilment>(
      `${this.resourceUrl}/${getAppointmentTreatmentAilmentIdentifier(appointmentTreatmentAilment) as number}`,
      appointmentTreatmentAilment,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppointmentTreatmentAilment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByPatient(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppointmentTreatmentAilment>(`${this.resourceUrl}/patient/${id}`, { observe: 'response' });
  }

  findByAppointment(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppointmentTreatmentAilment>(`${this.resourceUrl}/appointment/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppointmentTreatmentAilment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  deleteByAilmentAndAppointment(ailmentId: number, appointmentId:number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/delete/${ailmentId}/${appointmentId}`, { observe: 'response' });
  }

  addAppointmentTreatmentAilmentToCollectionIfMissing(
    appointmentTreatmentAilmentCollection: IAppointmentTreatmentAilment[],
    ...appointmentTreatmentAilmentsToCheck: (IAppointmentTreatmentAilment | null | undefined)[]
  ): IAppointmentTreatmentAilment[] {
    const appointmentTreatmentAilments: IAppointmentTreatmentAilment[] = appointmentTreatmentAilmentsToCheck.filter(isPresent);
    if (appointmentTreatmentAilments.length > 0) {
      const appointmentTreatmentAilmentCollectionIdentifiers = appointmentTreatmentAilmentCollection.map(
        appointmentTreatmentAilmentItem => getAppointmentTreatmentAilmentIdentifier(appointmentTreatmentAilmentItem)!
      );
      const appointmentTreatmentAilmentsToAdd = appointmentTreatmentAilments.filter(appointmentTreatmentAilmentItem => {
        const appointmentTreatmentAilmentIdentifier = getAppointmentTreatmentAilmentIdentifier(appointmentTreatmentAilmentItem);
        if (
          appointmentTreatmentAilmentIdentifier == null ||
          appointmentTreatmentAilmentCollectionIdentifiers.includes(appointmentTreatmentAilmentIdentifier)
        ) {
          return false;
        }
        appointmentTreatmentAilmentCollectionIdentifiers.push(appointmentTreatmentAilmentIdentifier);
        return true;
      });
      return [...appointmentTreatmentAilmentsToAdd, ...appointmentTreatmentAilmentCollection];
    }
    return appointmentTreatmentAilmentCollection;
  }
}
