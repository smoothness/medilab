import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TreatmentDetailComponent } from './detail/treatment-detail.component';
import { TreatmentUpdateComponent } from './update/treatment-update.component';
import { TreatmentRoutingModule } from './route/treatment-routing.module';
import { TreatmentRegisterComponent } from './register/register-form/treatment-register.component'
import { TreatmentCreateFormComponent } from './register/treatment-create-form.component';

@NgModule({
  imports: [ SharedModule, TreatmentRoutingModule ],
  declarations: [
    TreatmentDetailComponent,
    TreatmentUpdateComponent,
    TreatmentRegisterComponent,
    TreatmentCreateFormComponent
  ],
  exports: [
    TreatmentUpdateComponent,
    TreatmentRegisterComponent,
    TreatmentCreateFormComponent
  ]
})
export class TreatmentModule {}
