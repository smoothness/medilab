import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IInvoice, Invoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

@Component({
  selector: 'medi-invoice-update',
  templateUrl: './invoice-update.component.html',
})
export class InvoiceUpdateComponent implements OnInit {
  isSaving = false;

  appointmentsCollection: IAppointment[] = [];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    subtotal: [],
    taxes: [],
    discount: [],
    total: [],
    status: [],
    appointment: [],
  });

  constructor(
    protected invoiceService: InvoiceService,
    protected appointmentService: AppointmentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.updateForm(invoice);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoice = this.createFromForm();
    if (invoice.id !== undefined) {
      this.subscribeToSaveResponse(this.invoiceService.update(invoice));
    } else {
      this.subscribeToSaveResponse(this.invoiceService.create(invoice));
    }
  }

  trackAppointmentById(index: number, item: IAppointment): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvoice>>): void {
    result.subscribe(data => {
      // eslint-disable-next-line no-console
      console.log({ data });
    });

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

  protected updateForm(invoice: IInvoice): void {
    this.editForm.patchValue({
      id: invoice.id,
      date: invoice.date,
      subtotal: invoice.subtotal,
      taxes: invoice.taxes,
      discount: invoice.discount,
      total: invoice.total,
      status: invoice.status,
      appointment: invoice.appointment,
    });

    this.appointmentsCollection = this.appointmentService.addAppointmentToCollectionIfMissing(
      this.appointmentsCollection,
      invoice.appointment
    );
  }

  protected loadRelationshipsOptions(): void {
    this.appointmentService
      .query({ filter: 'invoice-is-null' })
      .pipe(map((res: HttpResponse<IAppointment[]>) => res.body ?? []))
      .pipe(
        map((appointments: IAppointment[]) =>
          this.appointmentService.addAppointmentToCollectionIfMissing(appointments, this.editForm.get('appointment')!.value)
        )
      )
      .subscribe((appointments: IAppointment[]) => (this.appointmentsCollection = appointments));
  }

  protected createFromForm(): IInvoice {
    return {
      ...new Invoice(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value,
      subtotal: this.editForm.get(['subtotal'])!.value,
      taxes: this.editForm.get(['taxes'])!.value,
      discount: this.editForm.get(['discount'])!.value,
      total: this.editForm.get(['total'])!.value,
      status: this.editForm.get(['status'])!.value,
      appointment: this.editForm.get(['appointment'])!.value,
    };
  }
}
