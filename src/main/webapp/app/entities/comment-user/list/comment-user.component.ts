import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICommentUser } from '../comment-user.model';
import { CommentUserService } from '../service/comment-user.service';
import { CommentUserDeleteDialogComponent } from '../delete/comment-user-delete-dialog.component';

@Component({
  selector: 'medi-comment-user',
  templateUrl: './comment-user.component.html',
})
export class CommentUserComponent implements OnInit {
  commentUsers?: ICommentUser[];
  isLoading = false;

  constructor(protected commentUserService: CommentUserService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.commentUserService.query().subscribe(
      (res: HttpResponse<ICommentUser[]>) => {
        this.isLoading = false;
        this.commentUsers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICommentUser): number {
    return item.id!;
  }

  delete(commentUser: ICommentUser): void {
    const modalRef = this.modalService.open(CommentUserDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.commentUser = commentUser;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
