import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAilment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';
import { AilmentDeleteDialogComponent } from '../delete/ailment-delete-dialog.component';


@Component({
  selector: 'medi-ailment',
  templateUrl: './ailment.component.html',
})
export class AilmentComponent implements OnInit  {
  ailments?: IAilment[];
  isLoading = false;

  constructor(protected ailmentService: AilmentService, protected modalService: NgbModal) {}


  loadAll(): void {
    this.isLoading = true;

    this.ailmentService.query().subscribe(
      (res: HttpResponse<IAilment[]>) => {
        this.isLoading = false;
        this.ailments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAilment): number {
    return item.id!;
  }

  delete(ailment: IAilment): void {
    const modalRef = this.modalService.open(AilmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ailment = ailment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  
}
