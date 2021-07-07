import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PatientComponent } from './list/patient.component';
import { PatientDetailComponent } from './detail/patient-detail.component';
import { PatientUpdateComponent } from './update/patient-update.component';
import { PatientDeleteDialogComponent } from './delete/patient-delete-dialog.component';
import { PatientRoutingModule } from './route/patient-routing.module';

@NgModule({
  imports: [SharedModule, PatientRoutingModule],
  declarations: [PatientComponent, PatientDetailComponent, PatientUpdateComponent, PatientDeleteDialogComponent],
  entryComponents: [PatientDeleteDialogComponent],
})
export class PatientModule {}
