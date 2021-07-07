import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMedicalExams, MedicalExams } from '../medical-exams.model';
import { MedicalExamsService } from '../service/medical-exams.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

@Component({
  selector: 'medi-medical-exams-update',
  templateUrl: './medical-exams-update.component.html',
})
export class MedicalExamsUpdateComponent implements OnInit {
  isSaving = false;

  appointmentsSharedCollection: IAppointment[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    removed: [],
    appointment: [],
  });

  constructor(
    protected medicalExamsService: MedicalExamsService,
    protected appointmentService: AppointmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medicalExams }) => {
      this.updateForm(medicalExams);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medicalExams = this.createFromForm();
    if (medicalExams.id !== undefined) {
      this.subscribeToSaveResponse(this.medicalExamsService.update(medicalExams));
    } else {
      this.subscribeToSaveResponse(this.medicalExamsService.create(medicalExams));
    }
  }

  trackAppointmentById(index: number, item: IAppointment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedicalExams>>): void {
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

  protected updateForm(medicalExams: IMedicalExams): void {
    this.editForm.patchValue({
      id: medicalExams.id,
      name: medicalExams.name,
      description: medicalExams.description,
      removed: medicalExams.removed,
      appointment: medicalExams.appointment,
    });

    this.appointmentsSharedCollection = this.appointmentService.addAppointmentToCollectionIfMissing(
      this.appointmentsSharedCollection,
      medicalExams.appointment
    );
  }

  protected loadRelationshipsOptions(): void {
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

  protected createFromForm(): IMedicalExams {
    return {
      ...new MedicalExams(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      removed: this.editForm.get(['removed'])!.value,
      appointment: this.editForm.get(['appointment'])!.value,
    };
  }
}
