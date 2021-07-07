import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommentUser } from '../comment-user.model';

@Component({
  selector: 'medi-comment-user-detail',
  templateUrl: './comment-user-detail.component.html',
})
export class CommentUserDetailComponent implements OnInit {
  commentUser: ICommentUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commentUser }) => {
      this.commentUser = commentUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
