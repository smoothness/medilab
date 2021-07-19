import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { AppointmentDeleteDialogComponent } from '../delete/appointment-delete-dialog.component';

import {AccountService} from 'app/core/auth/account.service';
import {Account} from 'app/core/auth/account.model';

@Component({
  selector: 'medi-appointment',
  templateUrl: './appointment.component.html',
})
export class AppointmentComponent implements OnInit {
  account: Account | null = null;
  appointments?: IAppointment[];
  isLoading = false;

  constructor(protected appointmentService: AppointmentService,
              protected modalService: NgbModal,
              private accountService: AccountService) {}

  loadAll(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => {
          this.account = account;
        }
      );

    this.isLoading = true;

    this.appointmentService.query().subscribe(
      (res: HttpResponse<IAppointment[]>) => {
        this.isLoading = false;
        this.appointments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAppointment): number {
    return item.id!;
  }

  delete(appointment: IAppointment): void {
    const modalRef = this.modalService.open(AppointmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appointment = appointment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
