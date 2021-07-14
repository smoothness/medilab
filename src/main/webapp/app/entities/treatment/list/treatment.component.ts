import {Component, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ITreatment} from '../treatment.model';
import {TreatmentService} from '../service/treatment.service';
import {TreatmentDeleteDialogComponent} from '../delete/treatment-delete-dialog.component';

import {AccountService} from 'app/core/auth/account.service';
import {Account} from 'app/core/auth/account.model';

import {AppointmentTreatmentAilment} from '../../appointment-treatment-ailment/appointment-treatment-ailment.model';
import {AppointmentTreatmentAilmentService} from '../../appointment-treatment-ailment/service/appointment-treatment-ailment.service';

import {AppointmentService} from '../../appointment/service/appointment.service';
import {Appointment} from '../../appointment/appointment.model';
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'medi-treatment',
  templateUrl: './treatment.component.html',
})
export class TreatmentComponent implements OnInit {
  account: Account | null = null;
  appointment: Appointment | null = null;
  treatments?: ITreatment[];
  isLoading = false;

  constructor(
    protected treatmentService: TreatmentService,
    protected appointmentService: AppointmentService,
    protected accountService: AccountService,
    protected modalService: NgbModal) {
  }

  loadAll(): void {
    this.isLoading = true;

    this.treatmentService.query().subscribe(
      (res: HttpResponse<ITreatment[]>) => {
        this.isLoading = false;
        this.treatments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  loadAllPacientTreatments(): void {
    this.isLoading = true;

    this.treatmentService
      .find(Number(this.account?.login))
      .subscribe(appointmentlist => {
          this.appointment = appointmentlist.body;
        }
      );
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => (this.account = account));

    this.appointmentService
      .find(Number(this.account?.login))
      .subscribe(appointmentlist => {
          this.appointment = appointmentlist.body;
        }
      );

    if(this.account){
      this.loadAll();
    }
  }

  trackId(index: number, item: ITreatment): number {
    return item.id!;
  }

  delete(treatment: ITreatment): void {
    const modalRef = this.modalService.open(TreatmentDeleteDialogComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.treatment = treatment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
