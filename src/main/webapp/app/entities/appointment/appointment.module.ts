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
import {AppointmentTreatmentAilmentModule} from "../appointment-treatment-ailment/appointment-treatment-ailment.module";
import { RegisterAppointmentComponent } from './register/register-appointment.component';

@NgModule({
  imports: [
    SharedModule,
    AppointmentRoutingModule,
    SweetAlert2Module,
    MedicalExamsModule,
    AppointmentTreatmentAilmentModule,
    LineCommentModule,
  ],
  declarations: [
    AppointmentComponent,
    AppointmentDetailComponent,
    AppointmentUpdateComponent,
    AppointmentDeleteDialogComponent,
    AppointmentHistoryComponent,
    StatusPipe,
    RegisterAppointmentComponent,
  ],
  entryComponents: [AppointmentDeleteDialogComponent],
  exports: [ AppointmentComponent ],
})
export class AppointmentModule {}
