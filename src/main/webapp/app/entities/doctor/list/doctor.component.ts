import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DoctorService } from '../service/doctor.service';

import { Doctor } from '../../../core/auth/account.model';

@Component({
  selector: 'medi-doctor',
  templateUrl: './doctor.component.html',
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
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
}
