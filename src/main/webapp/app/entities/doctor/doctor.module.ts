import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DoctorComponent } from './list/doctor.component';
import { DoctorDetailComponent } from './detail/doctor-detail.component';
import { DoctorUpdateComponent } from './update/doctor-update.component';
import { DoctorDeleteDialogComponent } from './delete/doctor-delete-dialog.component';
import { DoctorRoutingModule } from './route/doctor-routing.module';

@NgModule({
  imports: [SharedModule, DoctorRoutingModule],
  declarations: [DoctorComponent, DoctorDetailComponent, DoctorUpdateComponent, DoctorDeleteDialogComponent],
  entryComponents: [DoctorDeleteDialogComponent],
})
export class DoctorModule {}
