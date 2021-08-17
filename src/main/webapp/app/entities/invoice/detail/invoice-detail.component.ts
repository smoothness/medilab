import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { LineCommentService } from 'app/entities/line-comment/service/line-comment.service';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { InvoiceService } from '../service/invoice.service';
import { Patient } from '../../../core/auth/account.model';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormatMediumDatetimePipe } from 'app/shared/date/format-medium-datetime.pipe';
import { formatDate } from '@angular/common';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'medi-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit {
  @Input() invoicePending: any;
  invoice: any = {};
  patient: any = {};
  currentUser: any = {};
  isVisible = true;
  addCol = false;

  formatMediumDatetimePipe = new FormatMediumDatetimePipe();

  constructor(
    protected invoiceService: InvoiceService,
    protected accountService: AccountService,
    protected appointmentService: AppointmentService,
    protected linesService: LineCommentService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.invoicePending) {
      this.invoice = this.invoicePending;
      this.getPatientInvoice();
      this.getLinesInvoice();
    } else {
      this.addCol = true;
      this.autenticatedAccount();
      this.getInvoiceData();
    }
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
    this.invoiceService.find(this.invoice.id).subscribe(invoice => {
      this.invoice = invoice.body;
      this.getLinesInvoice();
    });
  }

  public setInvoiceStatus(confirmPayment: boolean): void {
    if (confirmPayment) {
      this.invoiceService.payInvoice(this.invoice.id).subscribe(() => {
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
      if (this.invoice.status === 'PENDING') {
        show = true;
      }
    }
    return show;
  }

  downloadInvoiceAsPDF(): void {
    const documentDefinition = this.getDefinition();
    pdfMake.createPdf(documentDefinition).open();
  }

  getDefinition(): any {
    return {
      content: [
        {
          text: 'MediLab',
          fontSize: 16,
          alignment: 'center',
          color: '#047886',
        },
        {
          text: `Factura número: ${this.invoice.id}`,
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue',
        },
        {
          text: 'Detalles del cliente',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: ` ${this.patient.internalUser?.completeName} ${this.patient.secondSurname}`,
                bold: true,
              },
              { text: this.patient.phone },
              { text: this.patient.internalUser?.email },
            ],
            [
              {
                text: `Fecha: ${(this.invoice.date = formatDate(this.invoice.date, 'dd-MM-yyyy', 'en-US'))}`,
                alignment: 'right',
              },
            ],
          ],
        },
        {
          text: 'Detalles de la orden',
          style: 'sectionHeader',
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Producto', 'Precio', 'Cantidad', 'Monto total'],
              ...this.invoice.lineComments.map((p: { description: any; unitPrice: any; quantity: any; price: number; qty: number }) => [
                p.description,
                `$ ${p.unitPrice}`,
                p.quantity,
                `$ ${p.unitPrice * p.quantity}`,
              ]),
              [{ text: 'Subtotal', colSpan: 3 }, {}, {}, `$ ${this.invoice.subtotal}`],
              [{ text: 'Impuestos', colSpan: 3 }, {}, {}, `$ ${this.invoice.taxes}`],
              [{ text: 'Monto final', colSpan: 3 }, {}, {}, `$ ${this.invoice.total}`],
            ],
          },
        },
        {
          columns: [[{ qr: ` ${this.patient.internalUser?.completeName} ${this.patient.secondSurname}`, fit: '50' }]],
        },
        {
          text: 'Gracias por confiar su salud con nosotros',
          style: 'sectionHeader',
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };
  }
}
