import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAilment, Ailment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';

@Component({
  selector: 'medi-ailment-update',
  templateUrl: './ailment-update.component.html',
})
export class AilmentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    removed: [],
  });

  constructor(protected ailmentService: AilmentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ailment }) => {
      this.updateForm(ailment);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ailment = this.createFromForm();
    if (ailment.id !== undefined) {
      this.subscribeToSaveResponse(this.ailmentService.update(ailment));
    } else {
      ailment.removed = true;
      this.subscribeToSaveResponse(this.ailmentService.create(ailment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAilment>>): void {
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

  protected updateForm(ailment: IAilment): void {
    this.editForm.patchValue({
      id: ailment.id,
      name: ailment.name,
      removed: ailment.removed,
    });
  }

  protected createFromForm(): IAilment {
    return {
      ...new Ailment(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      removed: this.editForm.get(['removed'])!.value,
    };
  }
}
