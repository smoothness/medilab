import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

import { Patient } from './../../../core/auth/account.model';
import { AilmentService } from '../../ailment/service/ailment.service';

// Treatments
import { ITreatment, Treatment } from 'app/entities/treatment/treatment.model';
import { TreatmentService } from 'app/entities/treatment/service/treatment.service';
import { TreatmentDeleteDialogComponent } from 'app/entities/treatment/delete/treatment-delete-dialog.component';

// AppointmentTreatmentAilmentService
import { AppointmentTreatmentAilmentService } from 'app/entities/appointment-treatment-ailment/service/appointment-treatment-ailment.service';
import { IAppointmentTreatmentAilment } from 'app/entities/appointment-treatment-ailment/appointment-treatment-ailment.model';

// Appointment
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

// Account
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'medi-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['../../../home/home.component.scss'],
})
export class PatientDetailComponent implements OnInit {

  account: Account | null = null;

  patient: any = {};
  ailments: any = [];

  isLoadingPatient = false;

  treatments?: Treatment[];
  treatment: any;

  appointments?: IAppointment[];
  isLoadingAppointments = false;

  appointmentTreatmentAilment?: IAppointmentTreatmentAilment[];
  appointmentTreatmentAilments?: IAppointmentTreatmentAilment[];
  isLoadingAppointmentTreatmentAilments = false;

  isLoadingtreatment = false;
  constructor(
    protected activatedRoute: ActivatedRoute,
    private ailmentService: AilmentService,
    protected treatmentService: TreatmentService,
    private appointmentService: AppointmentService,
    private appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
    protected modalService: NgbModal,
    protected accountService: AccountService
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(({ patient }) => {
      this.patient = new Patient(patient);
      this.ailmentService.findAllAilmentsPacient(this.patient.patientId).subscribe(pacientAilments => {
        this.ailments = pacientAilments.body;
      });
    });

    this.loadAllPacientAppointments();
    this.loadAllAppointmentTreatmentAilmentService();
    this.loadAllTreatments();
  }

  previousState(): void {
    window.history.back();
  }


  // Treaments
  /* Treatment Detail */
  openTreatment(content: any, treatment: any): void {
    this.modalService.open(content, {
      windowClass: 'elementTreatment',
    });
    this.treatment = treatment;
  }

  openTreatmentModal(content: any, treatment: any): void {
    this.modalService.open(content);
    this.treatment = treatment;
  }

  /* Get Treatments */
  loadAllTreatments(): void {
    this.isLoadingtreatment = true;

    this.treatmentService.query().subscribe(
      (res: HttpResponse<ITreatment[]>) => {
        this.isLoadingtreatment = false;
        this.treatments = res.body?.filter(
          data => this.searchForTreatment(data)
        ) ?? [];
        this.loadAllAppointmentTreatmentAilmentService();
      },
      () => {
        this.isLoadingtreatment = false;
      }
    );
  }

    /* Get All Pacient Appointments */
  loadAllPacientAppointments(): void {
    this.isLoadingAppointments = true;

    this.appointmentService.query().subscribe(
      (res: HttpResponse<IAppointment[]>) => {
        this.isLoadingAppointments = false;
        this.appointments = res.body?.filter(
          data => data.patient?.id === this.patient.patientData.id) ?? [];
      },
      () => {
        this.isLoadingAppointments = false;
      }
    );

  }

      /* Get All from AppointmentTreatmentAilmentService table that has Appointments */
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

      /* Verify if the treatment is in the AppointmentTreatmentAilmentService list */
  searchForTreatment(item: ITreatment): boolean {
    let result = false;
    this.appointmentTreatmentAilments?.forEach(
      data => {
        if (data.treatment?.id === item.id
          && this.searchForAppointment(data)) {
          result = true;
        }
      })
    return result;
  }

        /* Verify if the AppointmentTreatmentAilment obj is in the Appointment list */
  searchForAppointment(item: IAppointmentTreatmentAilment): boolean {
    let result = false;
    this.appointments?.forEach(
      data => {
        if (data.id === item.appointment?.id) {
          result = true;
        }
      }
    )
    return result;
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

          /* Get Treatment ID */
  trackByTreatment(index: number, item: ITreatment): number {
    return item.id!;
  }
}
