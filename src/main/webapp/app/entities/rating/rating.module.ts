import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RatingComponent } from './list/rating.component';
import { RatingDetailComponent } from './detail/rating-detail.component';
import { RatingUpdateComponent } from './update/rating-update.component';
import { RatingDeleteDialogComponent } from './delete/rating-delete-dialog.component';
import { RatingRoutingModule } from './route/rating-routing.module';

@NgModule({
  imports: [SharedModule, RatingRoutingModule],
  declarations: [RatingComponent, RatingDetailComponent, RatingUpdateComponent, RatingDeleteDialogComponent],
  entryComponents: [RatingDeleteDialogComponent],
})
export class RatingModule {}
