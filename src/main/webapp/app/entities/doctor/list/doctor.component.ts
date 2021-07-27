import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDoctor } from '../doctor.model';
import { DoctorService } from '../service/doctor.service';
import { DoctorDeleteDialogComponent } from '../delete/doctor-delete-dialog.component';
import {Doctor} from "../../../core/auth/account.model";

@Component({
  selector: 'medi-doctor',
  templateUrl: './doctor.component.html',
})
export class DoctorComponent implements OnInit {
  doctors?: Doctor[];
  isLoading = false;

  constructor(protected doctorService: DoctorService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.doctorService.getCompleteDoctor().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.doctors = res ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IDoctor): number {
    return item.id!;
  }

  delete(doctor: IDoctor): void {
    const modalRef = this.modalService.open(DoctorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.doctor = doctor;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
