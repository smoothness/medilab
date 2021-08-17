import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { MedicalExamsModule } from "../entities/medical-exams/medical-exams.module";
import { TokenModule } from "../token/token.module";
import {AppointmentModule} from "../entities/appointment/appointment.module";
import {AppointmentTreatmentAilmentModule} from "../entities/appointment-treatment-ailment/appointment-treatment-ailment.module";

@NgModule({
    imports: [
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([HOME_ROUTE]),
        LayoutsModule,
        MedicalExamsModule,
        TokenModule,
        AppointmentModule,
        AppointmentTreatmentAilmentModule
    ],
  declarations: [ HomeComponent ],
  exports: [ HomeComponent ],
})
export class HomeModule {}
