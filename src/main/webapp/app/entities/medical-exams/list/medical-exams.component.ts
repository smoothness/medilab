import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicalExams } from '../medical-exams.model';
import { MedicalExamsService } from '../service/medical-exams.service';
import { MedicalExamsDeleteDialogComponent } from '../delete/medical-exams-delete-dialog.component';

@Component({
  selector: 'medi-medical-exams',
  templateUrl: './medical-exams.component.html',
})
export class MedicalExamsComponent implements OnInit {
  medicalExams?: IMedicalExams[];
  isLoading = false;

  constructor(protected medicalExamsService: MedicalExamsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.medicalExamsService.query().subscribe(
      (res: HttpResponse<IMedicalExams[]>) => {
        this.isLoading = false;
        this.medicalExams = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMedicalExams): number {
    return item.id!;
  }

  delete(medicalExams: IMedicalExams): void {
    const modalRef = this.modalService.open(MedicalExamsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medicalExams = medicalExams;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
