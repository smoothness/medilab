import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IAppointment, Appointment } from '../appointment.model';
import { AccountService } from 'app/core/auth/account.service';
import { AppointmentService } from '../service/appointment.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'medi-appointment-update',
  templateUrl: './appointment-update.component.html',
})
export class AppointmentUpdateComponent implements OnInit {
  @ViewChild('addedAppointment')
  public readonly addedAppointment!: SwalComponent;
  isSaving = false;
  doctorAccount: any;
  doctorId: number | undefined;
  doctor: IDoctor | null = null;
  patientsCollection: any[] | null = [];
  todayDate: NgbDateStruct;

  editForm = this.fb.group({
    id: [],
    date: [],
    status: [],
    patient: [],
    doctor: [],
  });

  constructor(
    protected accountService: AccountService,
    protected appointmentService: AppointmentService,
    protected patientService: PatientService,
    protected doctorService: DoctorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {
    const today = new Date();
    this.todayDate = {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    };
  }

  ngOnInit(): void {
    this.doctorId = Number(window.location.pathname.substring(window.location.pathname.lastIndexOf('=') + 1));

    this.getDoctor();

    this.activatedRoute.data.subscribe(({ appointment }) => {
      this.updateForm(appointment);
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.doctorAccount = account;
    });

    this.patientService.query().subscribe(data => {
      this.patientsCollection = data.body;
    });
  }

  getDoctor(): void {
    if (this.doctorId) {
      this.doctorService.find(this.doctorId).subscribe(res => (this.doctor = res.body));
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appointment = this.createFromForm();

    if (appointment.id) {
      this.subscribeToSaveResponse(this.appointmentService.update(appointment));
    } else {
      this.subscribeToSaveResponse(this.appointmentService.create(appointment));
    }
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  public confirmClose(): void {
    this.previousState();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppointment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.addedAppointment.fire();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(appointment: IAppointment): void {
    this.editForm.patchValue({
      id: appointment.id,
      date: appointment.date,
      status: appointment.status,
      patient: appointment.patient,
      doctor: this.doctor,
    });
  }

  protected createFromForm(): IAppointment {
    return {
      ...new Appointment(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      status: this.editForm.get(['status'])!.value,
      patient: this.editForm.get(['patient'])!.value,
      doctor: this.doctor,
    };
  }
}
