import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TreatmentComponent } from './list/treatment.component';
import { TreatmentDetailComponent } from './detail/treatment-detail.component';
import { TreatmentUpdateComponent } from './update/treatment-update.component';
import { TreatmentDeleteDialogComponent } from './delete/treatment-delete-dialog.component';
import { TreatmentRoutingModule } from './route/treatment-routing.module';
import { TreatmentRegisterComponent } from './register/register-form/treatment-register.component'
import { TreatmentCreateFormComponent } from './register/treatment-create-form.component';

@NgModule({
  imports: [ SharedModule, TreatmentRoutingModule ],
  declarations: [
    TreatmentComponent,
    TreatmentDetailComponent,
    TreatmentUpdateComponent,
    TreatmentDeleteDialogComponent,
    TreatmentRegisterComponent,
    TreatmentCreateFormComponent
  ],
  entryComponents: [ TreatmentDeleteDialogComponent ],
  exports: [ TreatmentRegisterComponent, TreatmentCreateFormComponent ]
})
export class TreatmentModule {}
