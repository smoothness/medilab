import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILineComment, LineComment } from '../line-comment.model';
import { LineCommentService } from '../service/line-comment.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';
import * as dayjs from 'dayjs';
import { Status } from '../../enumerations/status.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

@Component({
  selector: 'medi-line-comment-update',
  templateUrl: './line-comment-update.component.html',
})
export class LineCommentUpdateComponent {
  @Input() appointment: any;

  invoice: IInvoice = {} as IInvoice;

  isSaving = false;

  invoicesSharedCollection: IInvoice[] = [];

  registerCommentForm = this.fb.group({
    id: [],
    description: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    unitPrice: ['', [Validators.required]],
    invoiceCode: [''],
  });
  private invoiceData: IInvoice | null | undefined;

  constructor(
    protected lineCommentService: LineCommentService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected appointmentService: AppointmentService
  ) {}

  previousState(): void {
    window.history.back();
  }

  saveComment(): void {
    this.isSaving = true;
    const lineComment = this.createFromForm();
    //La fecha por defecto es la del sistema a la hora de crear la factura
    const now = dayjs();
    this.invoice.date = now;
    //al ser una factura nueva el status por defecto debe ser PENDING
    this.invoice.status = Status.PENDING;
    this.invoice.appointment = this.appointment;
    this.appointment.status = Status.FINISHED;

    if (lineComment.unitPrice && lineComment.quantity !== undefined) {
      this.invoice.subtotal = lineComment.quantity * lineComment.unitPrice;
      this.invoice.taxes = this.invoice.subtotal * 0.13;
      this.invoice.total = this.invoice.taxes + this.invoice.subtotal;
      this.invoice.discount = 0;
    }

    this.appointmentService.update(this.appointment).subscribe(data => {
      this.invoiceService.create(this.invoice).subscribe(invoiceData => {
        console.log('invoiceData', invoiceData);
        lineComment.invoiceCode = invoiceData.body;
        this.lineCommentService.create(lineComment);
        console.log('lineComment', lineComment);
      });
    });
  }

  trackInvoiceById(index: number, item: IInvoice): number {
    return item.id!;
  }

  createFromForm(): ILineComment {
    return {
      ...new LineComment(),
      description: this.registerCommentForm.get(['description'])!.value,
      quantity: this.registerCommentForm.get(['quantity'])!.value,
      unitPrice: this.registerCommentForm.get(['unitPrice'])!.value,
      invoiceCode: this.registerCommentForm.get(['invoiceCode'])!.value,
    };
  }
}
