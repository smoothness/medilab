import {Component, EventEmitter, Input, Output} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicalExams } from '../medical-exams.model';
import { SweetAlertService } from "../../../shared/services/sweet-alert.service";
import { MedicalExamsService } from '../service/medical-exams.service';
import { MedicalExamsUpdateComponent } from "../update/medical-exams-update.component";
import {Doctor} from "../../../core/auth/account.model";

@Component({
  selector: 'medi-medical-exams',
  templateUrl: './medical-exams.component.html',
})
export class MedicalExamsComponent {
  @Input() medicalExams: IMedicalExams[] = [];
  @Input() showButtons = false;
  @Output() updateList: EventEmitter<boolean> = new EventEmitter();

  constructor(
    protected modalService: NgbModal,
    private sweetAlertService: SweetAlertService,
    protected medicalExamsService: MedicalExamsService,
  ) {}

  public showEditModal(medicalExam: any): void {
    const modalRef = this.modalService.open(MedicalExamsUpdateComponent, { centered: true });
    modalRef.componentInstance.medicalExam = medicalExam;
    modalRef.closed.subscribe(reason => {
      if (reason === 'updated') {
        this.updateList.emit(true);
      }
    });
  }

  delete(medicalExam: IMedicalExams): void {
    this.sweetAlertService
      .showConfirmMsg({
        title: 'medilabApp.deleteConfirm.title',
        text: 'medilabApp.deleteConfirm.text',
        confirmButtonText: 'medilabApp.deleteConfirm.confirmButtonText',
        cancelButtonText: 'medilabApp.deleteConfirm.cancelButtonText',
      })
      .then(res => {
        if (res) {
          this.medicalExamsService.deleteByRemove(<number>medicalExam.id).subscribe(() => {
            this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.deleteConfirm.titleSuccess').then(() => {
              this.updateList.emit(true);
            });
          });
        }
      });
  }
}
