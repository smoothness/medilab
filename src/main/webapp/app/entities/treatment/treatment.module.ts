import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TreatmentComponent } from './list/treatment.component';
import { TreatmentDetailComponent } from './detail/treatment-detail.component';
import { TreatmentUpdateComponent } from './update/treatment-update.component';
import { TreatmentDeleteDialogComponent } from './delete/treatment-delete-dialog.component';
import { TreatmentRoutingModule } from './route/treatment-routing.module';

@NgModule({
  imports: [SharedModule, TreatmentRoutingModule],
  declarations: [TreatmentComponent, TreatmentDetailComponent, TreatmentUpdateComponent, TreatmentDeleteDialogComponent],
  entryComponents: [TreatmentDeleteDialogComponent],
})
export class TreatmentModule {}
