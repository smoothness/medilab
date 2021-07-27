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

@Component({
  selector: 'medi-appointment-update',
  templateUrl: './appointment-update.component.html',
})
export class AppointmentUpdateComponent implements OnInit {
  @ViewChild('addedAppointment')
  public readonly addedAppointment!: SwalComponent;
  isSaving = false;
  doctor: any;
  patientsCollection: any[] | null = [];

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
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointment }) => {
      this.updateForm(appointment);
      // this.loadRelationshipsOptions();
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.doctor = account;
    });

    this.patientService.query().subscribe(data => {
      this.patientsCollection = data.body;
    });
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
    console.log('appont from update ', appointment);
    this.editForm.patchValue({
      id: appointment.id,
      date: appointment.date,
      status: appointment.status,
      patient: appointment.patient,
      doctor: this.doctor.id,
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
