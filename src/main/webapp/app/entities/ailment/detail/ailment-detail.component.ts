import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAilment } from '../ailment.model';

@Component({
  selector: 'medi-ailment-detail',
  templateUrl: './ailment-detail.component.html',
})
export class AilmentDetailComponent implements OnInit {
  ailment: IAilment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ailment }) => {
      this.ailment = ailment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
