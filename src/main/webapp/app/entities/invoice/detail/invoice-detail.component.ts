import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { PatientService } from 'app/entities/patient/service/patient.service';

import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';



@Component({
  selector: 'medi-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent implements OnInit {
  invoice: IInvoice | null = null;
  patient: any | null = null;

  constructor(
    protected invoiceServie : InvoiceService,
    protected appointmentService : AppointmentService,
    protected patientService : PatientService,
    protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.invoice = invoice;
        
      this.patientService.findOneByAppointmen(<number>this.invoice?.appointment?.id).subscribe((data) => {
        this.patient = data.body;
      })       
    });
  }

  previousState(): void {
    window.history.back();
  }
}
