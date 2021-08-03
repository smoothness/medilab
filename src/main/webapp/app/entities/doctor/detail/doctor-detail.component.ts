import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Doctor} from './../../../core/auth/account.model';

import { IRating, Rating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { RatingDeleteDialogComponent } from 'app/entities/rating/delete/rating-delete-dialog.component';

import { RatingUserService } from 'app/entities/rating-user/service/rating-user.service';
import { RatingUser} from 'app/entities/rating-user/rating-user.model';

@Component({
  selector: 'medi-doctor-detail',
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['../../../home/home.component.scss'],
})
export class DoctorDetailComponent implements OnInit {
  doctor: any = {};
  isLoading = false;
  rating: Rating | null = null;
  ratings?: IRating[];

  // Rating User
  isLoadingRaitingUser = false;
  ratingUser: RatingUser | null = null;
  ratingUsers?: RatingUser[] | null = null;

  // Rating Doctor Data
  totalDoctorRaiting = 0;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected ratingService: RatingService,
    protected modalService: NgbModal,
    private ratingUserService: RatingUserService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({doctor}) => {
      this.doctor = new Doctor(doctor);
    });
    this.loadAllRaitings();
    this.loadAllRatingUsers();
  }

  previousState(): void {
    window.history.back();
  }

  loadAllRaitings(): void {
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

  trackId(index: number, item: IRating): number {
    return item.id!;
  }

  delete(rating: IRating): void {
    const modalRef = this.modalService.open(RatingDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.rating = rating;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAllRaitings();
      }
    });
  }


  // Rating

  loadAllRatingUsers(): void {
    this.ratingUserService.query().subscribe(ratingUserRes => {
      this.ratingUsers = ratingUserRes.body?.filter(
        ratingUserData =>ratingUserData.doctor?.id === this.doctor?.doctorId) ?? [];
      this.ratingService.query().subscribe(ratingRes => {
        this.ratings = ratingRes.body ?? [];
        this.ratings.forEach(
          raitingData => {
            this.ratingUsers?.forEach(
              dataRaiting => {
                if (dataRaiting.rating?.id === raitingData.id) {
                  this.totalDoctorRaiting = this.totalDoctorRaiting + Number(raitingData.value);
                }
              })
          }
        );
        this.totalDoctorRaiting = this.totalDoctorRaiting / (Number(this.ratingUsers?.length));
      });
    });
  }

  verifyRaiting(id?: number): boolean {
    let result = false;
    this.ratingUsers?.forEach(
      dataRaiting => {
        if (dataRaiting.rating?.id === id) {
          result = true;
        }
      }
    )
    return result;
  }

  ratingTotal(): number {
    let total = 0;

    this.ratings?.forEach(
      data => {
        total = total + Number(data.value);
      }
    )
    return total;
  }
}
