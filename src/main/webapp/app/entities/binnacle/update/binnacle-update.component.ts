import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBinnacle, Binnacle } from '../binnacle.model';
import { BinnacleService } from '../service/binnacle.service';

@Component({
  selector: 'medi-binnacle-update',
  templateUrl: './binnacle-update.component.html',
})
export class BinnacleUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    doctorCode: [],
    date: [],
  });

  constructor(protected binnacleService: BinnacleService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ binnacle }) => {
      this.updateForm(binnacle);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const binnacle = this.createFromForm();
    if (binnacle.id !== undefined) {
      this.subscribeToSaveResponse(this.binnacleService.update(binnacle));
    } else {
      this.subscribeToSaveResponse(this.binnacleService.create(binnacle));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBinnacle>>): void {
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

  protected updateForm(binnacle: IBinnacle): void {
    this.editForm.patchValue({
      id: binnacle.id,
      doctorCode: binnacle.doctorCode,
      date: binnacle.date,
    });
  }

  protected createFromForm(): IBinnacle {
    return {
      ...new Binnacle(),
      id: this.editForm.get(['id'])!.value,
      doctorCode: this.editForm.get(['doctorCode'])!.value,
      date: this.editForm.get(['date'])!.value,
    };
  }
}
