import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IUser } from '../user-management.model';
import { User as RegisterUser } from './../register/user.model';
import { User } from './../../../account/register/register.model';
import {map, mergeMap} from "rxjs/operators";
import { Account, Doctor, Patient } from "../../../core/auth/account.model";
import { PatientService } from "../../../entities/patient/service/patient.service";
import { DoctorService } from "../../../entities/doctor/service/doctor.service";


@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private resourceUrl = this.applicationConfigService.getEndpointFor('api/admin/users');

  constructor(
    private http: HttpClient,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  registerUser(newUser: RegisterUser): Observable<RegisterUser>{
    return new Observable( subscriber => {
      if(newUser.role === "ROLE_ADMIN") {
        this.saveUser(newUser.data).subscribe(
          () => {
            subscriber.next();
            subscriber.complete();
          },
          err => subscriber.error(err)
        )
      }else{
        this.saveUser(newUser.data).subscribe(
          (userRegistered: any) => {
            newUser.setId(userRegistered);

            if(newUser.role === "ROLE_USER") {
              this.saveDoctorInfo(newUser).subscribe(
                () => {
                  subscriber.next();
                  subscriber.complete();
                },
                err => subscriber.error(err)
              )
            } else {
              this.savePatientInfo(newUser).subscribe(
                (patientRegistered: any) => {
                  newUser.setId(patientRegistered);
                  newUser.setEmergencyConctacId();

                  this.saveEmergencyContacts(newUser.emergencyContact).subscribe(
                    () => {
                      subscriber.next();
                      subscriber.complete();
                    },
                    err => subscriber.error(err)
                  );
                },
                err => subscriber.error(err)
              )
            }
          },
          err => subscriber.error(err)
        )
      }

    });
  }

  savePatientInfo(newUser: RegisterUser): Observable<{}> {
    return this.http.post(this.getUrl(`api/patients`), newUser.patientData);
  }

  saveDoctorInfo(newUser: RegisterUser): Observable<{}> {
    return this.http.post(this.getUrl(`api/doctors`), newUser.doctorData);
  }

  saveEmergencyContacts(newContact: any): Observable<{}> {
    return this.http.post(this.getUrl('api/emergency-contacts'), newContact.registerContact);
  }

  saveUser(newUser: any): Observable<User>{
    return this.http.post<User>(this.resourceUrl, newUser);
  }

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.resourceUrl, user);
  }

  find(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getUsersFormatted(): Observable<any> {
    return this.http.get<IUser[]>(this.resourceUrl, { observe: 'response' }).pipe(
      mergeMap((users: any) => this.formatUser(users.body)),
      map((users: any) => users),
    );
  }

  formatUser(users: any): Observable<{}> {
    return new Observable<{}>(subscriber => {
      for (const user of users[Symbol.iterator]()) {
        if (user.authorities[0] === 'ROLE_PATIENT') {
          this.patientService.findOneByInternalUser(user.id).subscribe((res: any) => {
            res.body.internalUser = user;
            subscriber.next(new Patient(res.body));
          });
        } else {
          if (user?.authorities[0] === 'ROLE_USER') {
            if (user.authorities[1] === 'ROLE_ADMIN') {
              subscriber.next(new Account(user));
            } else {
              this.doctorService.findByInternalUser(user.id).subscribe((res: any) => {
                res.body.internalUser = user;
                subscriber.next(new Doctor(res.body));
              });
            }
          }
        }
      }
    });
  }
  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  }

  private getUrl(url: string): string {
    return this.applicationConfigService.getEndpointFor(url);
  }
}
