import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmergencyContactComponent } from './list/emergency-contact.component';
import { EmergencyContactDetailComponent } from './detail/emergency-contact-detail.component';
import { EmergencyContactUpdateComponent } from './update/emergency-contact-update.component';
import { EmergencyContactDeleteDialogComponent } from './delete/emergency-contact-delete-dialog.component';
import { EmergencyContactRoutingModule } from './route/emergency-contact-routing.module';

@NgModule({
  imports: [SharedModule, EmergencyContactRoutingModule],
  declarations: [
    EmergencyContactComponent,
    EmergencyContactDetailComponent,
    EmergencyContactUpdateComponent,
    EmergencyContactDeleteDialogComponent,
  ],
  entryComponents: [EmergencyContactDeleteDialogComponent],
})
export class EmergencyContactModule {}
