import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ILineComment, LineComment } from '../line-comment.model';
import { LineCommentService } from '../service/line-comment.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';
import * as dayjs from 'dayjs';
import { Status } from '../../enumerations/status.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'medi-line-comment-update',
  templateUrl: './line-comment-update.component.html',
})
export class LineCommentUpdateComponent {
  @Input() appointment: any;

  invoice: IInvoice = {} as IInvoice;

  isSaving = false;

  invoicesSharedCollection: IInvoice[] = [];

  subtotal = 0;

  registerCommentForm = this.fb.group({
    id: [],
    description: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    unitPrice: ['', [Validators.required]],
    invoiceCode: [''],
  });

  constructor(
    protected lineCommentService: LineCommentService,
    protected invoiceService: InvoiceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected appointmentService: AppointmentService,
    public sweetAlertService: SweetAlertService,
    public activeModal: NgbActiveModal
  ) {
    this.invoice.lineComments = [];
    this.invoice.lineComments.push(new LineComment());
  }

  previousState(): void {
    window.history.back();
  }

  saveComment(): void {
    this.isSaving = true;

    //La fecha por defecto es la del sistema a la hora de crear la factura
    const now = dayjs();
    this.invoice.date = now;

    //al ser una factura nueva el status por defecto debe ser PENDING
    this.invoice.status = Status.PENDING;
    this.invoice.appointment = this.appointment;
    this.appointment.status = Status.FINISHED;

    this.invoice.lineComments?.forEach(lineComment => {
      if (lineComment.unitPrice && lineComment.quantity !== undefined) {
        this.subtotal = this.subtotal + lineComment.quantity * lineComment.unitPrice;
      }

      this.setInvoiceAmmount(this.subtotal);
    });

    this.subtotal = 0;

    this.saveInvoiceService();
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

  addLine(): void {
    this.invoice.lineComments?.push(new LineComment());
  }

  deleteLine(lineComment: LineComment, index: number): void {
    this.sweetAlertService
      .showConfirmMsg({
        title: 'medilabApp.deleteConfirm.title',
        text: 'medilabApp.deleteConfirm.text',
        confirmButtonText: 'medilabApp.deleteConfirm.confirmButtonText',
        cancelButtonText: 'medilabApp.deleteConfirm.cancelButtonText',
      })
      .then(result => {
        if (result) {
          this.invoice.lineComments?.splice(index, 1);
        }
      });
  }

  //Se actualizan los montos de la factura
  setInvoiceAmmount(subtotal: number): void {
    this.invoice.subtotal = subtotal;
    this.invoice.taxes = this.invoice.subtotal * 0.13;
    this.invoice.total = this.invoice.taxes + this.invoice.subtotal;
    this.invoice.discount = 0;
  }

  saveInvoiceService(): void {
    this.appointmentService.update(this.appointment).subscribe(data => {
      this.invoiceService.create(this.invoice).subscribe(invoiceData => {
        this.invoice.lineComments?.forEach(lineComment => {
          lineComment.invoiceCode = invoiceData.body;
          this.lineCommentService.create(lineComment).subscribe(() => {
            this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.invoice.created');
            this.activeModal.close('register');
          });
        });
      });
    });
  }
}
