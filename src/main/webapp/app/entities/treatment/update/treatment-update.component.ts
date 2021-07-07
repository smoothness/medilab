import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITreatment, Treatment } from '../treatment.model';
import { TreatmentService } from '../service/treatment.service';

@Component({
  selector: 'medi-treatment-update',
  templateUrl: './treatment-update.component.html',
})
export class TreatmentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    specifications: [],
    medicines: [],
    duration: [],
    removed: [],
  });

  constructor(protected treatmentService: TreatmentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ treatment }) => {
      this.updateForm(treatment);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const treatment = this.createFromForm();
    if (treatment.id !== undefined) {
      this.subscribeToSaveResponse(this.treatmentService.update(treatment));
    } else {
      this.subscribeToSaveResponse(this.treatmentService.create(treatment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITreatment>>): void {
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

  protected updateForm(treatment: ITreatment): void {
    this.editForm.patchValue({
      id: treatment.id,
      specifications: treatment.specifications,
      medicines: treatment.medicines,
      duration: treatment.duration,
      removed: treatment.removed,
    });
  }

  protected createFromForm(): ITreatment {
    return {
      ...new Treatment(),
      id: this.editForm.get(['id'])!.value,
      specifications: this.editForm.get(['specifications'])!.value,
      medicines: this.editForm.get(['medicines'])!.value,
      duration: this.editForm.get(['duration'])!.value,
      removed: this.editForm.get(['removed'])!.value,
    };
  }
}
