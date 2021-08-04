import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { LineCommentService } from 'app/entities/line-comment/service/line-comment.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { InvoiceService } from '../service/invoice.service';
import {Patient} from "../../../core/auth/account.model";

@Component({
  selector: 'medi-invoice-detail',
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent implements OnInit {
  invoice: any = {};
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
    });
  }

  getPatientInvoice(): void {
    this.patientService.findOneByAppointment(<number>this.invoice.appointment.id).subscribe((data: any) => {
      this.patient = data.body;
    });
  }

  public getInvoiceDataUpdated(): void {
    this.invoiceService.find(this.invoice.id).subscribe((invoice) => {
      this.invoice = invoice.body;
      this.getLinesInvoice();
    });
  }

  public setInvoiceStatus(confirmPayment: boolean): void {
    if(confirmPayment){
      this.invoiceService.payInvoice(this.invoice.id).subscribe( () => {
        this.getInvoiceDataUpdated();
      });
    }
  }
  public autenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
    });
  }

  public validateShow(): boolean {
    let show = false;
    if (this.currentUser instanceof Patient) {
      if(this.invoice.status !== 'PAID'){
        show = true;
      }
    }
    return show;
  }
}
