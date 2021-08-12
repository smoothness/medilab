import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from './../../core/config/application-config.service';
import { User } from './register.model';
import {EmergencyContact} from "../../entities/emergency-contact/emergency-contact.model";

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  register(newUser: User): Observable<{}> {
    return new Observable(subscriber => {
      this.save(newUser).subscribe(
        (registered: any) => {
          newUser.setId(registered);
          this.savePatientInfo(newUser).subscribe(
            (patient: any) => {
              newUser.setId(patient);
              newUser.emergencyContact.forEach(
                newContact => this.saveEmergencyContacts(newContact.registerContact).subscribe(
                  () => {
                    subscriber.next();
                  }
                ))
              subscriber.next();
              subscriber.complete();
            },
            err => subscriber.error(err)
          );
        },
        err => subscriber.error(err)
      );
    });
  }

  save(newUser: User): Observable<{}> {
    return this.http.post(this.getUrl('api/register'), newUser.data);
  }

  savePatientInfo(newUser: User): Observable<{}> {
    return this.http.post(this.getUrl(`api/patients`), newUser.patientData);
  }

  saveEmergencyContacts(newContact: EmergencyContact): Observable<{}> {
    return this.http.post(this.getUrl('api/emergency-contacts'), newContact);
  }



  private getUrl(url: string): string {
    return this.applicationConfigService.getEndpointFor(url);
  }

}
