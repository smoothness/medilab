import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DoctorComponent } from './list/doctor.component';
import { DoctorDetailComponent } from './detail/doctor-detail.component';
import { DoctorRoutingModule } from './route/doctor-routing.module';
import { LayoutsModule } from './../../layouts/layouts.module';


@NgModule({
  imports: [
    SharedModule,
    LayoutsModule,
    DoctorRoutingModule,
  ],
  declarations: [
    DoctorComponent,
    DoctorDetailComponent,
  ],
})
export class DoctorModule {}
