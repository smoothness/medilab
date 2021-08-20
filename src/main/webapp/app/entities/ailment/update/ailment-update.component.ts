import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAilment, Ailment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    protected ailmentService: AilmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected sweetAlertService: SweetAlertService,
    public activeModal: NgbActiveModal
  ) {}

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
    ailment.removed = false;

    ailment.removed = false;
    this.ailmentService.create(ailment).subscribe(res => {
      this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.ailment.register.registered').then(() => {
        this.editForm.reset();
        this.activeModal.close('register');
      });
    });
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
      name: this.editForm.get(['name'])!.value,
    };
  }
}
