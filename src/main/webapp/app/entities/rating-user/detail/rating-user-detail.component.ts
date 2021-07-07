import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRatingUser } from '../rating-user.model';

@Component({
  selector: 'medi-rating-user-detail',
  templateUrl: './rating-user-detail.component.html',
})
export class RatingUserDetailComponent implements OnInit {
  ratingUser: IRatingUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ratingUser }) => {
      this.ratingUser = ratingUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
