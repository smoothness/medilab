import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRating, Rating } from '../rating.model';
import { RatingService } from '../service/rating.service';
import { RatingDeleteDialogComponent } from '../delete/rating-delete-dialog.component';

import { RatingUserService } from 'app/entities/rating-user/service/rating-user.service';
import { RatingUser, IRatingUser } from 'app/entities/rating-user/rating-user.model';
import { IDoctor, Doctor } from 'app/entities/doctor/doctor.model';


import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { DoctorService } from 'app/entities/doctor/service/doctor.service';

@Component({
  selector: 'medi-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['../../../home/home.component.scss'],
})
export class RatingComponent implements OnInit {
  account: Account | null = null;

  isLoading = false;
  rating: Rating | null = null;
  ratings?: IRating[];

  // Rating User
  isLoadingRaitingUser = false;
  ratingUser: RatingUser | null = null;
  ratingUsers?: RatingUser[] | null = null;

  // Rating Doctor Data
  userDoctor?: IDoctor | null = null;
  totalDoctorRaiting = 0;
  doctor?: Doctor | null = null;
  doctors: IDoctor[] | null = null;

  constructor(
    protected ratingService: RatingService,
    protected modalService: NgbModal,
    private ratingUserService: RatingUserService,
    private accountService: AccountService,
    private doctorService: DoctorService) { }

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
    this.loadAllRatingUsers();
  }

  trackId(index: number, item: IRating): number {
    return item.id!;
  }

  trackIdDoctor(index: number, item: IDoctor): number {
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


  // Rating

  loadAllRatingUsers(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

    this.doctorService.query().subscribe(doctorRes => {
      this.userDoctor = doctorRes.body?.find(
        doctorData => doctorData.internalUser?.id === this.account?.id);
      this.ratingUserService.query().subscribe(ratingUserRes => {
        this.ratingUsers = ratingUserRes.body?.filter(
          ratingUserData => ratingUserData.doctor?.id === this.userDoctor?.id) ?? [];
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
          this.totalDoctorRaiting = Math.round(this.totalDoctorRaiting / (Number(this.ratingUsers?.length)));
        });
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
        console.log("total", total);
      }
    )
    return total;
  }
}
