import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { getTreatmentIdentifier, ITreatment, Treatment } from '../treatment.model';
import { TreatmentService } from '../service/treatment.service';
import { TreatmentDeleteDialogComponent } from '../delete/treatment-delete-dialog.component';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { IAppointment } from '../../appointment/appointment.model';
import { AppointmentService } from '../../appointment/service/appointment.service';

import { PatientService } from 'app/entities/patient/service/patient.service';
import { Patient, IPatient } from 'app/entities/patient/patient.model';

import { IAppointmentTreatmentAilment, AppointmentTreatmentAilment } from '../../appointment-treatment-ailment/appointment-treatment-ailment.model';
import { AppointmentTreatmentAilmentService } from '../../appointment-treatment-ailment/service/appointment-treatment-ailment.service';

@Component({
  selector: 'medi-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['../../../home/home.component.scss'],
})
export class TreatmentComponent implements OnInit {
  patient: Patient | null = null;
  patients: IPatient[] | null = null;
  isLoadingPatient = false;

  treatments?: ITreatment[];

  appointments?: IAppointment[];
  isLoadingAppointments = false;

  appointmentTreatmentAilment?: AppointmentTreatmentAilment[];
  appointmentTreatmentAilments?: IAppointmentTreatmentAilment[];
  isLoadingAppointmentTreatmentAilments = false;

  account: Account | null = null;
  isLoading = false;

  constructor(protected treatmentService: TreatmentService,
    protected accountService: AccountService,
    protected appointmentService: AppointmentService,
    protected patientService: PatientService,
    protected appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
    protected modalService: NgbModal) { }

  loadAllTreatments(): void {
    this.isLoading = true;

    this.treatmentService.query().subscribe(
      (res: HttpResponse<ITreatment[]>) => {
        this.isLoading = false;
        this.treatments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadPacient(): void {
    this.isLoadingPatient = true;

    this.patientService.query().subscribe(
      (res: HttpResponse<IPatient[]>) => {
        this.isLoadingPatient = false;
        this.patients = res.body?.filter(
          data => data.internalUser?.id === this.account?.id
        ) ?? [];

        this.patient = this.patients[0];
      },
      () => {
        this.isLoadingPatient = false;
      }
    );
  }

  loadAllPacientAppointments(): void {
    this.isLoadingAppointments = true;

    this.appointmentService.query().subscribe(
      (res: HttpResponse<IAppointment[]>) => {
        this.isLoadingAppointments = false;
        this.appointments = res.body?.filter(
          data => data.patient?.id === this.patient?.id
        ) ?? [];
      },
      () => {
        this.isLoadingAppointments = false;
      }
    );

  }

  loadAllAppointmentTreatmentAilmentService(): void {
    this.isLoadingAppointmentTreatmentAilments = true;

    this.appointmentTreatmentAilmentService.query().subscribe(
      (res: HttpResponse<IAppointmentTreatmentAilment[]>) => {
        this.isLoadingAppointmentTreatmentAilments = false;
        this.appointmentTreatmentAilments = res.body ?? [];
      },
      () => {
        this.isLoadingAppointmentTreatmentAilments = false;
      }
    );
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => (this.account = account));

    this.loadPacient();
    this.loadAllPacientAppointments();
    this.loadAllAppointmentTreatmentAilmentService();
    this.loadAllTreatments();
  }

  trackId(index: number, item: ITreatment): number {
    return item.id!;
  }

  delete(treatment: ITreatment): void {
    const modalRef = this.modalService.open(TreatmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.treatment = treatment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAllTreatments();
      }
    });
  }

  searchForTreatment(item: ITreatment): boolean {
    let result = false;
    this.appointmentTreatmentAilments?.forEach(
      data=> {
        if(data.treatment?.id === item.id
          && this.searchForAppointment(data)){
          result = true;
        }
      })
    return result;
  }

  searchForAppointment(item: IAppointmentTreatmentAilment): boolean {
    let result = false;
    this.appointments?.forEach(
      data=> {
        if(data.id === item.appointment?.id){
          result = true;
        }
      }
    )
    return result;
  }

  removedTranslation(item: IAppointmentTreatmentAilment): boolean {
    let result = false;
    this.appointments?.forEach(
      data=> {
        if(data.id === item.appointment?.id){
          result = true;
        }
      }
    )
    return result;
  }
}
