import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBinnacle } from '../binnacle.model';

@Component({
  selector: 'medi-binnacle-detail',
  templateUrl: './binnacle-detail.component.html',
})
export class BinnacleDetailComponent implements OnInit {
  binnacle: IBinnacle | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ binnacle }) => {
      this.binnacle = binnacle;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
