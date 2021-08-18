import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAppointmentTreatmentAilment, AppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';
import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';
import { IAilment } from 'app/entities/ailment/ailment.model';
import { AilmentService } from 'app/entities/ailment/service/ailment.service';
import { ITreatment } from 'app/entities/treatment/treatment.model';
import { TreatmentService } from 'app/entities/treatment/service/treatment.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

@Component({
  selector: 'medi-appointment-treatment-ailment-update',
  templateUrl: './appointment-treatment-ailment-update.component.html',
})
export class AppointmentTreatmentAilmentUpdateComponent implements OnInit {
  isSaving = false;

  ailmentsSharedCollection: IAilment[] = [];
  treatmentsSharedCollection: ITreatment[] = [];
  appointmentsSharedCollection: IAppointment[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    removed: [],
    ailment: [],
    treatment: [],
    appointment: [],
  });

  constructor(
    protected appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
    protected ailmentService: AilmentService,
    protected treatmentService: TreatmentService,
    protected appointmentService: AppointmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(({ appointmentTreatmentAilment }) => {
      this.updateForm(appointmentTreatmentAilment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appointmentTreatmentAilment = this.createFromForm();
    if (appointmentTreatmentAilment.id !== undefined) {
      this.subscribeToSaveResponse(this.appointmentTreatmentAilmentService.update(appointmentTreatmentAilment));
    } else {
      this.subscribeToSaveResponse(this.appointmentTreatmentAilmentService.create(appointmentTreatmentAilment));
    }
  }

  trackAilmentById(index: number, item: IAilment): number {
    return item.id!;
  }

  trackTreatmentById(index: number, item: ITreatment): number {
    return item.id!;
  }

  trackAppointmentById(index: number, item: IAppointment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppointmentTreatmentAilment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(appointmentTreatmentAilment: IAppointmentTreatmentAilment): void {
    this.editForm.patchValue({
      id: appointmentTreatmentAilment.id,
      description: appointmentTreatmentAilment.description,
      removed: appointmentTreatmentAilment.removed,
      ailment: appointmentTreatmentAilment.ailment,
      treatment: appointmentTreatmentAilment.treatment,
      appointment: appointmentTreatmentAilment.appointment,
    });

    this.ailmentsSharedCollection = this.ailmentService.addAilmentToCollectionIfMissing(
      this.ailmentsSharedCollection,
      appointmentTreatmentAilment.ailment
    );
    this.appointmentsSharedCollection = this.appointmentService.addAppointmentToCollectionIfMissing(
      this.appointmentsSharedCollection,
      appointmentTreatmentAilment.appointment
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ailmentService
      .query()
      .pipe(map((res: HttpResponse<IAilment[]>) => res.body ?? []))
      .pipe(
        map((ailments: IAilment[]) => this.ailmentService.addAilmentToCollectionIfMissing(ailments, this.editForm.get('ailment')!.value))
      )
      .subscribe((ailments: IAilment[]) => (this.ailmentsSharedCollection = ailments));

    this.treatmentService
      .query()
      .pipe(map((res: HttpResponse<ITreatment[]>) => res.body ?? []))
      .subscribe((treatments: ITreatment[]) => (this.treatmentsSharedCollection = treatments));

    this.appointmentService
      .query()
      .pipe(map((res: HttpResponse<IAppointment[]>) => res.body ?? []))
      .pipe(
        map((appointments: IAppointment[]) =>
          this.appointmentService.addAppointmentToCollectionIfMissing(appointments, this.editForm.get('appointment')!.value)
        )
      )
      .subscribe((appointments: IAppointment[]) => (this.appointmentsSharedCollection = appointments));
  }

  protected createFromForm(): IAppointmentTreatmentAilment {
    return {
      ...new AppointmentTreatmentAilment(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      removed: this.editForm.get(['removed'])!.value,
      ailment: this.editForm.get(['ailment'])!.value,
      treatment: this.editForm.get(['treatment'])!.value,
      appointment: this.editForm.get(['appointment'])!.value,
    };
  }
}
