import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AppointmentComponent } from './list/appointment.component';
import { AppointmentDetailComponent } from './detail/appointment-detail.component';
import { AppointmentUpdateComponent } from './update/appointment-update.component';
import { AppointmentDeleteDialogComponent } from './delete/appointment-delete-dialog.component';
import { AppointmentRoutingModule } from './route/appointment-routing.module';

@NgModule({
  imports: [SharedModule, AppointmentRoutingModule],
  declarations: [AppointmentComponent, AppointmentDetailComponent, AppointmentUpdateComponent, AppointmentDeleteDialogComponent],
  entryComponents: [AppointmentDeleteDialogComponent],
})
export class AppointmentModule {}
