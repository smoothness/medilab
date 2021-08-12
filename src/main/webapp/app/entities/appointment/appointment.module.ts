import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AppointmentComponent } from './list/appointment.component';
import { AppointmentDetailComponent } from './detail/appointment-detail.component';
import { AppointmentUpdateComponent } from './update/appointment-update.component';
import { AppointmentDeleteDialogComponent } from './delete/appointment-delete-dialog.component';
import { AppointmentRoutingModule } from './route/appointment-routing.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MedicalExamsModule } from '../medical-exams/medical-exams.module';
import { AppointmentHistoryComponent } from './history/appointment-history.component';
import { StatusPipe } from './pipe/status.pipe';
import { LineCommentModule } from '../line-comment/line-comment.module';

@NgModule({
  imports: [SharedModule, AppointmentRoutingModule, SweetAlert2Module, MedicalExamsModule, LineCommentModule],
  declarations: [
    AppointmentComponent,
    AppointmentDetailComponent,
    AppointmentUpdateComponent,
    AppointmentDeleteDialogComponent,
    AppointmentHistoryComponent,
    StatusPipe,
  ],
  entryComponents: [AppointmentDeleteDialogComponent],
})
export class AppointmentModule {}
