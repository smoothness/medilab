import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RatingUserComponent } from './list/rating-user.component';
import { RatingUserDetailComponent } from './detail/rating-user-detail.component';
import { RatingUserUpdateComponent } from './update/rating-user-update.component';
import { RatingUserDeleteDialogComponent } from './delete/rating-user-delete-dialog.component';
import { RatingUserRoutingModule } from './route/rating-user-routing.module';

@NgModule({
  imports: [
    SharedModule,
    RatingUserRoutingModule
  ],
  declarations: [
    RatingUserComponent,
    RatingUserDetailComponent,
    RatingUserUpdateComponent,
    RatingUserDeleteDialogComponent
  ],
  exports: [ RatingUserDetailComponent ]
})
export class RatingUserModule {}
