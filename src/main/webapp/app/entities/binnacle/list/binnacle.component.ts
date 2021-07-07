import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBinnacle } from '../binnacle.model';
import { BinnacleService } from '../service/binnacle.service';
import { BinnacleDeleteDialogComponent } from '../delete/binnacle-delete-dialog.component';

@Component({
  selector: 'medi-binnacle',
  templateUrl: './binnacle.component.html',
})
export class BinnacleComponent implements OnInit {
  binnacles?: IBinnacle[];
  isLoading = false;

  constructor(protected binnacleService: BinnacleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.binnacleService.query().subscribe(
      (res: HttpResponse<IBinnacle[]>) => {
        this.isLoading = false;
        this.binnacles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBinnacle): number {
    return item.id!;
  }

  delete(binnacle: IBinnacle): void {
    const modalRef = this.modalService.open(BinnacleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.binnacle = binnacle;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
