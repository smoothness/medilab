import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppointment, getAppointmentIdentifier } from '../appointment.model';

export type EntityResponseType = HttpResponse<IAppointment>;
export type EntityArrayResponseType = HttpResponse<IAppointment[]>;

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/appointments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(appointment: IAppointment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appointment);
    return this.http
      .post<IAppointment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(appointment: IAppointment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appointment);
    return this.http
      .put<IAppointment>(`${this.resourceUrl}/${getAppointmentIdentifier(appointment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(appointment: IAppointment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(appointment);
    return this.http
      .patch<IAppointment>(`${this.resourceUrl}/${getAppointmentIdentifier(appointment) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAppointment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAppointment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAppointmentToCollectionIfMissing(
    appointmentCollection: IAppointment[],
    ...appointmentsToCheck: (IAppointment | null | undefined)[]
  ): IAppointment[] {
    const appointments: IAppointment[] = appointmentsToCheck.filter(isPresent);
    if (appointments.length > 0) {
      const appointmentCollectionIdentifiers = appointmentCollection.map(appointmentItem => getAppointmentIdentifier(appointmentItem)!);
      const appointmentsToAdd = appointments.filter(appointmentItem => {
        const appointmentIdentifier = getAppointmentIdentifier(appointmentItem);
        if (appointmentIdentifier == null || appointmentCollectionIdentifiers.includes(appointmentIdentifier)) {
          return false;
        }
        appointmentCollectionIdentifiers.push(appointmentIdentifier);
        return true;
      });
      return [...appointmentsToAdd, ...appointmentCollection];
    }
    return appointmentCollection;
  }

  protected convertDateFromClient(appointment: IAppointment): IAppointment {
    return Object.assign({}, appointment, {
      date: appointment.date?.isValid() ? appointment.date.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((appointment: IAppointment) => {
        appointment.date = appointment.date ? dayjs(appointment.date) : undefined;
      });
    }
    return res;
  }
}
