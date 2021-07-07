import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AilmentComponent } from './list/ailment.component';
import { AilmentDetailComponent } from './detail/ailment-detail.component';
import { AilmentUpdateComponent } from './update/ailment-update.component';
import { AilmentDeleteDialogComponent } from './delete/ailment-delete-dialog.component';
import { AilmentRoutingModule } from './route/ailment-routing.module';

@NgModule({
  imports: [SharedModule, AilmentRoutingModule],
  declarations: [AilmentComponent, AilmentDetailComponent, AilmentUpdateComponent, AilmentDeleteDialogComponent],
  entryComponents: [AilmentDeleteDialogComponent],
})
export class AilmentModule {}
