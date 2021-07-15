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
import * as dayjs from "dayjs";
import {Status} from "../../enumerations/status.model";

@Component({
  selector: 'medi-line-comment-update',
  templateUrl: './line-comment-update.component.html',
})


export class LineCommentUpdateComponent implements OnInit {

    invoice: IInvoice = {} as IInvoice;

  isSaving = false;

  invoicesSharedCollection: IInvoice[] = [];

  editCoomentForm = this.fb.group({
    id: [],
    description: [],
    quantity: [],
    unitPrice: [],
    invoiceCode: [],
  });
  private invoiceData: IInvoice | null | undefined;

  constructor(
    protected lineCommentService: LineCommentService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
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

  saveComment(): void {

    this.isSaving = true;
    const lineComment = this.createFromForm();
    if (lineComment.id !== undefined) {
      this.subscribeToSaveResponse(this.lineCommentService.update(lineComment));
    } else {
      //La fecha por defecto es la del sistema a la hora de crear la factura
      const now = dayjs();
      this.invoice.date = now;
      //al ser una factura nueva el status por defecto debe ser PENDING
      this.invoice.status = Status.PENDING;
      if (lineComment.unitPrice && lineComment.quantity !== undefined){
        this.invoice.subtotal = (lineComment.quantity * lineComment.unitPrice);
        this.invoice.taxes = (this.invoice.subtotal*0.13);
        this.invoice.total = (this.invoice.taxes + this.invoice.subtotal);
        this.invoice.discount = 0;
      }

    
      
      this.subscribeToSaveResponseInvoice(this.invoiceService.create(this.invoice));

       lineComment.invoiceCode = this.invoiceData;

       //eslint-disable-next-line no-console
      console.log(lineComment.invoiceCode)

      this.subscribeToSaveResponse(this.lineCommentService.create(lineComment));
    }
  }

  trackInvoiceById(index: number, item: IInvoice): number {
    return item.id!;
  }


  protected subscribeToSaveResponseInvoice(result: Observable<HttpResponse<IInvoice>>): IInvoice | null | undefined {
    result.subscribe(data => {
      this.invoiceData = data.body;
    });

    return this.invoiceData;
  }

  protected SaveInvoice(){
        .subscribe(this.invoice => {
            this.costs = costs;
        });
      }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILineComment>>): void {
  /*  result.subscribe(data => {
      // eslint-disable-next-line no-console
      console.log({data})
      // eslint-disable-next-line no-console
      console.log(data.body?.id)
    })
*/
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
    this.editCoomentForm.patchValue({
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
          this.invoiceService.addInvoiceToCollectionIfMissing(invoices, this.editCoomentForm.get('invoiceCode')!.value)
        )
      )
      .subscribe((invoices: IInvoice[]) => (this.invoicesSharedCollection = invoices));
  }

  protected createFromForm(): ILineComment {
    return {
      ...new LineComment(),
      id: this.editCoomentForm.get(['id'])!.value,
      description: this.editCoomentForm.get(['description'])!.value,
      quantity: this.editCoomentForm.get(['quantity'])!.value,
      unitPrice: this.editCoomentForm.get(['unitPrice'])!.value,
      invoiceCode: this.editCoomentForm.get(['invoiceCode'])!.value,
    };
  }
}
function subscribe(arg0: (costs: any) => void) {
  throw new Error('Function not implemented.');
}

