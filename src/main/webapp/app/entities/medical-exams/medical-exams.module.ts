import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MedicalExamsComponent } from './list/medical-exams.component';
import { MedicalExamsDetailComponent } from './detail/medical-exams-detail.component';
import { MedicalExamsUpdateComponent } from './update/medical-exams-update.component';
import { MedicalExamsDeleteDialogComponent } from './delete/medical-exams-delete-dialog.component';
import { MedicalExamsRoutingModule } from './route/medical-exams-routing.module';
import { MedicalExamnsRegisterComponent } from './register/medical-examns-register.component';

@NgModule({
  imports: [SharedModule, MedicalExamsRoutingModule],
  declarations: [
    MedicalExamsComponent,
    MedicalExamsDetailComponent,
    MedicalExamsUpdateComponent,
    MedicalExamsDeleteDialogComponent,
    MedicalExamnsRegisterComponent
  ],
  entryComponents: [MedicalExamsDeleteDialogComponent],
  exports: [
    MedicalExamnsRegisterComponent,
    MedicalExamsComponent,
    MedicalExamsUpdateComponent
  ]
})
export class MedicalExamsModule {}
