import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from './../../core/config/application-config.service';
import { User } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(newUser: User): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), newUser.data);
  }

}
