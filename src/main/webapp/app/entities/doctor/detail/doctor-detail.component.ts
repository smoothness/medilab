import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Doctor } from './../../../core/auth/account.model';


@Component({
  selector: 'medi-doctor-detail',
  templateUrl: './doctor-detail.component.html',
})
export class DoctorDetailComponent implements OnInit {
  doctor: any = {};

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ doctor }) => {
      this.doctor = new Doctor(doctor);
    });
  }

  previousState(): void {
    window.history.back();
  }
}
