import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmergencyContactComponent } from './list/emergency-contact.component';
import { EmergencyContactDetailComponent } from './detail/emergency-contact-detail.component';
import { EmergencyContactUpdateComponent } from './update/emergency-contact-update.component';
import { EmergencyContactRoutingModule } from './route/emergency-contact-routing.module';
import { RegisterModule } from '../../account/register/register.module';
import { EmergencyContactRegisterComponent } from './register/emergency-contact-register.component';

@NgModule({
    imports: [ SharedModule, EmergencyContactRoutingModule, RegisterModule ],
    declarations: [
        EmergencyContactComponent,
        EmergencyContactDetailComponent,
        EmergencyContactUpdateComponent,
        EmergencyContactRegisterComponent,
    ],
    exports: [ EmergencyContactDetailComponent, EmergencyContactComponent ]
})
export class EmergencyContactModule {}
