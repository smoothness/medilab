import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRating } from '../rating.model';
import { RatingService } from '../service/rating.service';
import { RatingDeleteDialogComponent } from '../delete/rating-delete-dialog.component';

@Component({
  selector: 'medi-rating',
  templateUrl: './rating.component.html',
})
export class RatingComponent implements OnInit {
  ratings?: IRating[];
  isLoading = false;

  constructor(protected ratingService: RatingService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ratingService.query().subscribe(
      (res: HttpResponse<IRating[]>) => {
        this.isLoading = false;
        this.ratings = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRating): number {
    return item.id!;
  }

  delete(rating: IRating): void {
    const modalRef = this.modalService.open(RatingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rating = rating;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
