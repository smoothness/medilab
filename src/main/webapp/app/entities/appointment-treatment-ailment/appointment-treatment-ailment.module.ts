import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AppointmentTreatmentAilmentRoutingModule } from './route/appointment-treatment-ailment-routing.module';

import { AppointmentTreatmentAilmentComponent } from './list/appointment-treatment-ailment.component';
import { AppointmentTreatmentAilmentDetailComponent } from './detail/appointment-treatment-ailment-detail.component';
import { AppointmentTreatmentAilmentUpdateComponent } from './update/appointment-treatment-ailment-update.component';
import { AppointmentTreatmentAilmentDeleteDialogComponent } from './delete/appointment-treatment-ailment-delete-dialog.component';
import { ShowTreatmentToggleComponent } from './show-treatment-toggle/show-treatment-toggle.component';
import { AppointmentTreatmentAilmentRegisterComponent } from './register/appointment-treatment-ailment-register.component'
import { TreatmentModule } from "../treatment/treatment.module";


@NgModule({
    imports: [
        SharedModule,
        AppointmentTreatmentAilmentRoutingModule,
        TreatmentModule
    ],
    declarations: [
        AppointmentTreatmentAilmentComponent,
        AppointmentTreatmentAilmentDetailComponent,
        AppointmentTreatmentAilmentUpdateComponent,
        AppointmentTreatmentAilmentDeleteDialogComponent,
        ShowTreatmentToggleComponent,
        AppointmentTreatmentAilmentRegisterComponent
    ],
    entryComponents: [AppointmentTreatmentAilmentDeleteDialogComponent],
    exports: [
        AppointmentTreatmentAilmentComponent
    ]
})
export class AppointmentTreatmentAilmentModule {}
