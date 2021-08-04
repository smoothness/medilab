import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { InvoiceService } from '../service/invoice.service';

@Component({
  selector: 'medi-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent implements OnInit {
  invoice: any | null = null;
  patient: any | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected invoiceService : InvoiceService,
    protected appointmentService : AppointmentService,
    protected patientService : PatientService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.invoice = invoice;
      this.patientService.findOneByAppointment(<number>this.invoice?.appointment?.id).subscribe((data: any) => {
        this.patient = data.body;
      })
    });
  }

  setInvoiceStatus(confirmPayment: boolean): void {
    console.log(confirmPayment, "SE PAGO");
  }

  previousState(): void {
    window.history.back();
  }
}
