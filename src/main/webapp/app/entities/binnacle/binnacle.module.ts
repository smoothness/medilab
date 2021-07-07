import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BinnacleComponent } from './list/binnacle.component';
import { BinnacleDetailComponent } from './detail/binnacle-detail.component';
import { BinnacleUpdateComponent } from './update/binnacle-update.component';
import { BinnacleDeleteDialogComponent } from './delete/binnacle-delete-dialog.component';
import { BinnacleRoutingModule } from './route/binnacle-routing.module';

@NgModule({
  imports: [SharedModule, BinnacleRoutingModule],
  declarations: [BinnacleComponent, BinnacleDetailComponent, BinnacleUpdateComponent, BinnacleDeleteDialogComponent],
  entryComponents: [BinnacleDeleteDialogComponent],
})
export class BinnacleModule {}
