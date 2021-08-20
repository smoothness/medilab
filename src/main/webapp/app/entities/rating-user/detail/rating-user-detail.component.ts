import {Component, Input, OnInit} from '@angular/core';

import { RatingUserService } from "../service/rating-user.service";
import { Doctor } from "../../../core/auth/account.model";

@Component({
  selector: 'medi-rating-user-detail',
  templateUrl: './rating-user-detail.component.html'
})
export class RatingUserDetailComponent implements OnInit {
  @Input() doctor: any = {};
  average = 3.5
  constructor(protected ratingUserService: RatingUserService) {}

  ngOnInit(): void {
    this.getAverageRating();
  }

  public getAverageRating(): void {
    this.ratingUserService.findByDoctor(this.doctor.doctorId).subscribe((res: any) => {
     this.average = <number>res.body;
    })
  }
}
