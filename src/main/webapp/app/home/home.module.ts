import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { MedicalExamsModule } from "../entities/medical-exams/medical-exams.module";
import { TokenModule } from "../token/token.module";
import { AppointmentModule } from "../entities/appointment/appointment.module";
import { AppointmentTreatmentAilmentModule } from "../entities/appointment-treatment-ailment/appointment-treatment-ailment.module";
import { EmergencyContactModule } from "../entities/emergency-contact/emergency-contact.module";

@NgModule({
    imports: [
      ReactiveFormsModule,
      RouterModule.forChild([HOME_ROUTE]),
      SharedModule,
      LayoutsModule,
      TokenModule,
      AppointmentModule,
      MedicalExamsModule,
      EmergencyContactModule,
      AppointmentTreatmentAilmentModule
    ],
  declarations: [ HomeComponent ],
  exports: [ HomeComponent ],
})
export class HomeModule {}
