import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRatingUser } from '../rating-user.model';
import { RatingUserService } from '../service/rating-user.service';
import { RatingUserDeleteDialogComponent } from '../delete/rating-user-delete-dialog.component';

@Component({
  selector: 'medi-rating-user',
  templateUrl: './rating-user.component.html',
})
export class RatingUserComponent implements OnInit {
  ratingUsers?: IRatingUser[];
  isLoading = false;

  constructor(protected ratingUserService: RatingUserService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ratingUserService.query().subscribe(
      (res: HttpResponse<IRatingUser[]>) => {
        this.isLoading = false;
        this.ratingUsers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRatingUser): number {
    return item.id!;
  }

  delete(ratingUser: IRatingUser): void {
    const modalRef = this.modalService.open(RatingUserDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ratingUser = ratingUser;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
