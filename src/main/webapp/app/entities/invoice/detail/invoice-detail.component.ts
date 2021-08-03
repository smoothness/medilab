import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { LineCommentService } from 'app/entities/line-comment/service/line-comment.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';

@Component({
  selector: 'medi-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent implements OnInit {
  invoice: any = null;
  patient: any = {};
  currentUser: any = {};

  constructor(
    protected invoiceService: InvoiceService,
    protected accountService: AccountService,
    protected appointmentService: AppointmentService,
    protected linesService: LineCommentService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.autenticatedAccount();
    this.getInvoiceData();
  }

  getInvoiceData(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.invoice = invoice;
      this.getPatientInvoice();
      this.getLinesInvoice();
    });
  }

  getLinesInvoice(): void {
    this.linesService.findLineComment(this.invoice.id).subscribe(lines => {
      this.invoice.lineComments = lines.body;
      console.log(this.invoice);
    });
  }

  getPatientInvoice(): void {
    this.patientService.findOneByAppointmen(<number>this.invoice.appointment.id).subscribe((data: any) => {
      this.patient = data.body;
    });
  }

  public autenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
