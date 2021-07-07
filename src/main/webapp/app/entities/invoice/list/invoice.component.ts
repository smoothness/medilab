import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceDeleteDialogComponent } from '../delete/invoice-delete-dialog.component';

@Component({
  selector: 'medi-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent implements OnInit {
  invoices?: IInvoice[];
  isLoading = false;

  constructor(protected invoiceService: InvoiceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.invoiceService.query().subscribe(
      (res: HttpResponse<IInvoice[]>) => {
        this.isLoading = false;
        this.invoices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInvoice): number {
    return item.id!;
  }

  delete(invoice: IInvoice): void {
    const modalRef = this.modalService.open(InvoiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.invoice = invoice;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
