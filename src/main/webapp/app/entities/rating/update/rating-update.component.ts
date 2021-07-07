import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRating, Rating } from '../rating.model';
import { RatingService } from '../service/rating.service';

@Component({
  selector: 'medi-rating-update',
  templateUrl: './rating-update.component.html',
})
export class RatingUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    value: [],
    date: [],
  });

  constructor(protected ratingService: RatingService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ rating }) => {
      this.updateForm(rating);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const rating = this.createFromForm();
    if (rating.id !== undefined) {
      this.subscribeToSaveResponse(this.ratingService.update(rating));
    } else {
      this.subscribeToSaveResponse(this.ratingService.create(rating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRating>>): void {
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

  protected updateForm(rating: IRating): void {
    this.editForm.patchValue({
      id: rating.id,
      value: rating.value,
      date: rating.date,
    });
  }

  protected createFromForm(): IRating {
    return {
      ...new Rating(),
      id: this.editForm.get(['id'])!.value,
      value: this.editForm.get(['value'])!.value,
      date: this.editForm.get(['date'])!.value,
    };
  }
}
