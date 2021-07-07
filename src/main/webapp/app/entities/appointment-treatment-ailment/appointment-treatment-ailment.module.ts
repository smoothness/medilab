import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AppointmentTreatmentAilmentComponent } from './list/appointment-treatment-ailment.component';
import { AppointmentTreatmentAilmentDetailComponent } from './detail/appointment-treatment-ailment-detail.component';
import { AppointmentTreatmentAilmentUpdateComponent } from './update/appointment-treatment-ailment-update.component';
import { AppointmentTreatmentAilmentDeleteDialogComponent } from './delete/appointment-treatment-ailment-delete-dialog.component';
import { AppointmentTreatmentAilmentRoutingModule } from './route/appointment-treatment-ailment-routing.module';

@NgModule({
  imports: [SharedModule, AppointmentTreatmentAilmentRoutingModule],
  declarations: [
    AppointmentTreatmentAilmentComponent,
    AppointmentTreatmentAilmentDetailComponent,
    AppointmentTreatmentAilmentUpdateComponent,
    AppointmentTreatmentAilmentDeleteDialogComponent,
  ],
  entryComponents: [AppointmentTreatmentAilmentDeleteDialogComponent],
})
export class AppointmentTreatmentAilmentModule {}
