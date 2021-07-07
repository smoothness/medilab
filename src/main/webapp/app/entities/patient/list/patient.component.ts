import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatient } from '../patient.model';
import { PatientService } from '../service/patient.service';
import { PatientDeleteDialogComponent } from '../delete/patient-delete-dialog.component';

@Component({
  selector: 'medi-patient',
  templateUrl: './patient.component.html',
})
export class PatientComponent implements OnInit {
  patients?: IPatient[];
  isLoading = false;

  constructor(protected patientService: PatientService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.patientService.query().subscribe(
      (res: HttpResponse<IPatient[]>) => {
        this.isLoading = false;
        this.patients = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPatient): number {
    return item.id!;
  }

  delete(patient: IPatient): void {
    const modalRef = this.modalService.open(PatientDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.patient = patient;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
