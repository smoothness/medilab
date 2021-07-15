import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from './../../core/config/application-config.service';
import { User } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  register(newUser: User): Observable<{}> {
    return new Observable(subscriber => {
      this.save(newUser).subscribe((registered: any) => {
        newUser.setId(registered);
        this.savePatientInfo(newUser).subscribe((patient: any) => {
        console.log(patient);
          
          subscriber.complete();
        },
        err => subscriber.error(err));
      },
      err => subscriber.error(err))
    });
    
  }

  save(newUser: User): Observable<{}> {
    return this.http.post(this.getUrl('api/register'), newUser.data);
  }

  savePatientInfo(newUser: User): Observable<{}> {
    return this.http.post(this.getUrl(`api/patients/${newUser.id}`), newUser.patientData);
  }

  private getUrl(url: string): string {
    return this.applicationConfigService.getEndpointFor(url);
  }
}
