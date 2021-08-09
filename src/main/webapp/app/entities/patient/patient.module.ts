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


@NgModule({
  imports: [
    SharedModule,
    PatientRoutingModule,
    LayoutsModule,
    EmergencyContactModule,
    MedicalExamsModule
  ],
  declarations: [
    PatientComponent,
    PatientDetailComponent,
    PatientUpdateComponent,
    PatientDeleteDialogComponent
  ],
  entryComponents: [PatientDeleteDialogComponent],
})
export class PatientModule {}
