import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILineComment, LineComment } from '../line-comment.model';
import { LineCommentService } from '../service/line-comment.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

@Component({
  selector: 'medi-line-comment-update',
  templateUrl: './line-comment-update.component.html',
})
export class LineCommentUpdateComponent implements OnInit {
  isSaving = false;

  invoicesSharedCollection: IInvoice[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    quantity: [],
    unitPrice: [],
    invoiceCode: [],
  });

  constructor(
    protected lineCommentService: LineCommentService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lineComment }) => {
      this.updateForm(lineComment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lineComment = this.createFromForm();
    if (lineComment.id !== undefined) {
      this.subscribeToSaveResponse(this.lineCommentService.update(lineComment));
    } else {
      this.subscribeToSaveResponse(this.lineCommentService.create(lineComment));
    }
  }

  trackInvoiceById(index: number, item: IInvoice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILineComment>>): void {
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

  protected updateForm(lineComment: ILineComment): void {
    this.editForm.patchValue({
      id: lineComment.id,
      description: lineComment.description,
      quantity: lineComment.quantity,
      unitPrice: lineComment.unitPrice,
      invoiceCode: lineComment.invoiceCode,
    });

    this.invoicesSharedCollection = this.invoiceService.addInvoiceToCollectionIfMissing(
      this.invoicesSharedCollection,
      lineComment.invoiceCode
    );
  }

  protected loadRelationshipsOptions(): void {
    this.invoiceService
      .query()
      .pipe(map((res: HttpResponse<IInvoice[]>) => res.body ?? []))
      .pipe(
        map((invoices: IInvoice[]) =>
          this.invoiceService.addInvoiceToCollectionIfMissing(invoices, this.editForm.get('invoiceCode')!.value)
        )
      )
      .subscribe((invoices: IInvoice[]) => (this.invoicesSharedCollection = invoices));
  }

  protected createFromForm(): ILineComment {
    return {
      ...new LineComment(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      unitPrice: this.editForm.get(['unitPrice'])!.value,
      invoiceCode: this.editForm.get(['invoiceCode'])!.value,
    };
  }
}
