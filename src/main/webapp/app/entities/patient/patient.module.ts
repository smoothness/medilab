import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { PatientComponent } from './list/patient.component';
import { PatientDetailComponent } from './detail/patient-detail.component';
import { PatientUpdateComponent } from './update/patient-update.component';
import { PatientDeleteDialogComponent } from './delete/patient-delete-dialog.component';
import { PatientRoutingModule } from './route/patient-routing.module';
import { LayoutsModule } from "../../layouts/layouts.module";
import { EmergencyContactModule } from "../emergency-contact/emergency-contact.module";
import { MedicalExamsModule } from "../medical-exams/medical-exams.module";
import { AppointmentTreatmentAilmentModule } from "../appointment-treatment-ailment/appointment-treatment-ailment.module";


@NgModule({
  imports: [
    SharedModule,
    LayoutsModule,
    MedicalExamsModule,
    PatientRoutingModule,
    EmergencyContactModule,
    AppointmentTreatmentAilmentModule
  ],
  declarations: [
    PatientComponent,
    PatientDetailComponent,
    PatientUpdateComponent,
    PatientDeleteDialogComponent
  ],
  entryComponents: [PatientDeleteDialogComponent],
  exports: [ PatientDetailComponent ]
})
export class PatientModule {}
