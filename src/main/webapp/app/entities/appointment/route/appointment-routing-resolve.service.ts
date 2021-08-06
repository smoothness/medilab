import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppointment, Appointment } from '../appointment.model';
import { AccountService } from 'app/core/auth/account.service';
import { AppointmentService } from '../service/appointment.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

@Injectable({ providedIn: 'root' })
export class AppointmentRoutingResolveService implements Resolve<IAppointment> {
  userType = 'doctor';
  patient: any;
  doctor: any;

  constructor(
    protected accountService: AccountService,
    protected doctorService: DoctorService,
    protected patientService: PatientService,
    protected service: AppointmentService,
    protected router: Router
  ) {}

  formatPatientData(patientId: any): Observable<any> {
    return new Observable(subscriber => {
      this.patientService.find(patientId).subscribe(patient => {
        subscriber.next(patient.body);
      });
    });
  }

  formatDoctorData(doctorId: any): Observable<any> {
    return new Observable(subscriber => {
      this.doctorService.find(doctorId).subscribe(doctor => {
        subscriber.next(doctor.body);
      });
    });
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Observable<never> {
    const id = route.params['id'];

    this.accountService.getAuthenticationState().subscribe(account => {
      if (account?.authorities[0] === 'ROLE_USER') {
        this.userType = 'doctor';
      }
      if (account?.authorities[0] === 'ROLE_PATIENT') {
        this.userType = 'patient';
      }
      if (account?.authorities[0] === 'ROLE_ADMIN') {
        this.userType = 'admin';
      }
    });

    if (id) {
      return this.service.find(id).pipe(
        mergeMap((appointment: HttpResponse<any>) => {
          if (appointment.body) {
            if (this.userType === 'doctor') {
              this.formatPatientData(appointment.body.patient?.id).subscribe(patient => {
                if (appointment.body?.patient) {
                  appointment.body.patient = patient;
                  appointment.body.userType = this.userType;
                }
              });
            }
            if (this.userType === 'patient') {
              this.formatDoctorData(appointment.body.doctor?.id).subscribe(doctor => {
                if (appointment.body?.doctor) {
                  appointment.body.doctor = doctor;
                  appointment.body.userType = this.userType;
                }
              });
            }

            return of(appointment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Appointment());
  }
}
