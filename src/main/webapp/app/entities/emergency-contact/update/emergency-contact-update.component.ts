import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEmergencyContact, EmergencyContact } from '../emergency-contact.model';
import { EmergencyContactService } from '../service/emergency-contact.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

@Component({
  selector: 'medi-emergency-contact-update',
  templateUrl: './emergency-contact-update.component.html',
})
export class EmergencyContactUpdateComponent implements OnInit {
  isSaving = false;

  patientsSharedCollection: IPatient[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    phone: [],
    email: [],
    relationShip: [],
    patient: [],
  });

  constructor(
    protected emergencyContactService: EmergencyContactService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emergencyContact }) => {
      this.updateForm(emergencyContact);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emergencyContact = this.createFromForm();
    if (emergencyContact.id !== undefined) {
      this.subscribeToSaveResponse(this.emergencyContactService.update(emergencyContact));
    } else {
      this.subscribeToSaveResponse(this.emergencyContactService.create(emergencyContact));
    }
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmergencyContact>>): void {
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

  protected updateForm(emergencyContact: IEmergencyContact): void {
    this.editForm.patchValue({
      id: emergencyContact.id,
      name: emergencyContact.name,
      phone: emergencyContact.phone,
      email: emergencyContact.email,
      relationShip: emergencyContact.relationShip,
      patient: emergencyContact.patient,
    });

    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing(
      this.patientsSharedCollection,
      emergencyContact.patient
    );
  }

  protected loadRelationshipsOptions(): void {
    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing(patients, this.editForm.get('patient')!.value))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));
  }

  protected createFromForm(): IEmergencyContact {
    return {
      ...new EmergencyContact(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      email: this.editForm.get(['email'])!.value,
      relationShip: this.editForm.get(['relationShip'])!.value,
      patient: this.editForm.get(['patient'])!.value,
    };
  }
}
