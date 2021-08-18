import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';
import { SweetAlertService } from "../../../shared/services/sweet-alert.service";
import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';

import { Doctor, Patient } from "../../../core/auth/account.model";
import {AccountService} from "../../../core/auth/account.service";

@Component({
  selector: 'medi-appointment-treatment-ailment',
  templateUrl: './appointment-treatment-ailment.component.html',
})
export class AppointmentTreatmentAilmentComponent implements OnInit{

  @Input() appointmentTreatmentAilments?: IAppointmentTreatmentAilment[];
  @Output() updateList: EventEmitter<boolean> = new EventEmitter();
  currentUser: any = {};
  public isCollapsed = true;

  constructor(
    protected modalService: NgbModal,
    private accountService: AccountService,
    protected sweetAlertService: SweetAlertService,
    protected appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
  ) {}

  public get isPatient(): boolean {
    return this.currentUser instanceof Patient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }

  ngOnInit(): void {
    this.authenticatedAccount();
  }

  /**
   * @description this method is responsible for bringing the authenticated user.
   */
  public authenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
    });
  }

  delete(diagnosis: IAppointmentTreatmentAilment): void {
    this.sweetAlertService
      .showConfirmMsg({
        title: 'medilabApp.deleteConfirm.title',
        text: 'medilabApp.deleteConfirm.text',
        confirmButtonText: 'medilabApp.deleteConfirm.confirmButtonText',
        cancelButtonText: 'medilabApp.deleteConfirm.cancelButtonText',
      })
      .then(res => {
        if (res) {
          this.appointmentTreatmentAilmentService.deleteByAilmentAndAppointment(<number>diagnosis.ailment?.id, <number>diagnosis.appointment?.id).subscribe(() => {
            this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.deleteConfirm.titleSuccess').then(() => {
              this.updateList.emit(true);
            });
          });
        }
      });
  }
}
