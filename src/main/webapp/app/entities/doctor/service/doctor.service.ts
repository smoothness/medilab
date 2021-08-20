import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDoctor, getDoctorIdentifier } from '../doctor.model';
import { Doctor } from '../../../core/auth/account.model';

export type EntityResponseType = HttpResponse<IDoctor>;
export type EntityArrayResponseType = HttpResponse<IDoctor[]>;

@Injectable({ providedIn: 'root' })
export class DoctorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/doctors');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(doctor: IDoctor): Observable<EntityResponseType> {
    return this.http.post<IDoctor>(this.resourceUrl, doctor, { observe: 'response' });
  }

  update(doctor: IDoctor): Observable<EntityResponseType> {
    return this.http.put<IDoctor>(`${this.resourceUrl}/${getDoctorIdentifier(doctor) as number}`, doctor, { observe: 'response' });
  }

  updateDoctorProfile(doctor: Doctor): Observable<EntityResponseType> {
    console.log(doctor.doctorData);
    return this.http.put(`${this.resourceUrl}/${doctor.doctorId}`, doctor.doctorData, { observe: 'response' });
  }

  partialUpdate(doctor: IDoctor): Observable<EntityResponseType> {
    return this.http.patch<IDoctor>(`${this.resourceUrl}/${getDoctorIdentifier(doctor) as number}`, doctor, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDoctor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByInternalUser(id: number): Observable<EntityResponseType> {
    return this.http.get<IDoctor>(`api/doctor/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDoctor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getCompleteDoctor(): Observable<{}> {
    return new Observable<{}>(subscriber => {
      this.http.get(this.resourceUrl).subscribe((doctors: any) => {
        for (let i = 0; i < doctors.length; i++) {
          const formatted = new Doctor(doctors[i]);
          doctors[i] = formatted;
        }
        subscriber.next(doctors);
        subscriber.complete();
      });
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDoctorToCollectionIfMissing(doctorCollection: IDoctor[], ...doctorsToCheck: (IDoctor | null | undefined)[]): IDoctor[] {
    const doctors: IDoctor[] = doctorsToCheck.filter(isPresent);
    if (doctors.length > 0) {
      const doctorCollectionIdentifiers = doctorCollection.map(doctorItem => getDoctorIdentifier(doctorItem)!);
      const doctorsToAdd = doctors.filter(doctorItem => {
        const doctorIdentifier = getDoctorIdentifier(doctorItem);
        if (doctorIdentifier == null || doctorCollectionIdentifiers.includes(doctorIdentifier)) {
          return false;
        }
        doctorCollectionIdentifiers.push(doctorIdentifier);
        return true;
      });
      return [...doctorsToAdd, ...doctorCollection];
    }
    return doctorCollection;
  }
}
