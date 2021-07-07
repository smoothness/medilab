import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILineComment } from '../line-comment.model';

@Component({
  selector: 'medi-line-comment-detail',
  templateUrl: './line-comment-detail.component.html',
})
export class LineCommentDetailComponent implements OnInit {
  lineComment: ILineComment | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lineComment }) => {
      this.lineComment = lineComment;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
