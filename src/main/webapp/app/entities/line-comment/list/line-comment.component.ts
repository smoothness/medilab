import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILineComment } from '../line-comment.model';
import { LineCommentService } from '../service/line-comment.service';
import { LineCommentDeleteDialogComponent } from '../delete/line-comment-delete-dialog.component';

@Component({
  selector: 'medi-line-comment',
  templateUrl: './line-comment.component.html',
})
export class LineCommentComponent implements OnInit {
  lineComments?: ILineComment[];
  isLoading = false;

  constructor(protected lineCommentService: LineCommentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.lineCommentService.query().subscribe(
      (res: HttpResponse<ILineComment[]>) => {
        this.isLoading = false;
        this.lineComments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILineComment): number {
    return item.id!;
  }

  delete(lineComment: ILineComment): void {
    const modalRef = this.modalService.open(LineCommentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lineComment = lineComment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
