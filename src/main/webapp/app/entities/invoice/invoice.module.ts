import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InvoiceComponent } from './list/invoice.component';
import { InvoiceDetailComponent } from './detail/invoice-detail.component';
import { InvoiceUpdateComponent } from './update/invoice-update.component';
import { InvoiceDeleteDialogComponent } from './delete/invoice-delete-dialog.component';
import { InvoiceRoutingModule } from './route/invoice-routing.module';
import { InvoicePipe } from './pipe/invoice.pipe';

@NgModule({
  imports: [SharedModule, InvoiceRoutingModule],
  declarations: [InvoiceComponent, InvoiceDetailComponent, InvoiceUpdateComponent, InvoiceDeleteDialogComponent, InvoicePipe],
  entryComponents: [InvoiceDeleteDialogComponent],
  exports: [InvoicePipe]
})
export class InvoiceModule {}
