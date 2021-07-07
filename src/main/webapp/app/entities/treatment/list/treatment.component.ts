import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITreatment } from '../treatment.model';
import { TreatmentService } from '../service/treatment.service';
import { TreatmentDeleteDialogComponent } from '../delete/treatment-delete-dialog.component';

@Component({
  selector: 'medi-treatment',
  templateUrl: './treatment.component.html',
})
export class TreatmentComponent implements OnInit {
  treatments?: ITreatment[];
  isLoading = false;

  constructor(protected treatmentService: TreatmentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.treatmentService.query().subscribe(
      (res: HttpResponse<ITreatment[]>) => {
        this.isLoading = false;
        this.treatments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITreatment): number {
    return item.id!;
  }

  delete(treatment: ITreatment): void {
    const modalRef = this.modalService.open(TreatmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.treatment = treatment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
