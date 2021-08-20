import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountService } from '../../../core/auth/account.service';
import { AppointmentService } from '../service/appointment.service';
import { SweetAlertService } from '../../../shared/services/sweet-alert.service';

import { IAppointment } from '../appointment.model';
import { Status } from '../../enumerations/status.model';
import { Doctor, Patient } from '../../../core/auth/account.model';

@Component({
  selector: 'medi-appointment',
  templateUrl: './appointment.component.html',
})
export class AppointmentComponent implements OnInit {
  @Input() appointments: any[] = [];
  @Output() updateList: EventEmitter<boolean> = new EventEmitter();
  currentUser: any;
  appointmentToChangeDate: IAppointment | null = null;
  updatedDate = new FormControl('');

  constructor(
    protected modalService: NgbModal,
    private accountService: AccountService,
    private sweetAlertService: SweetAlertService,
    protected appointmentService: AppointmentService
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

  openChangeDateModal(content: any, clickedElementIndex: any): void {
    if (this.appointments.length) {
      this.appointmentToChangeDate = this.appointments[clickedElementIndex];
    }
    this.modalService.open(content);
  }

  handleChangeDate(): void {
    const newAppointment = {
      ...this.appointmentToChangeDate,
      date: this.updatedDate.value,
      updated: true,
    };
    this.appointmentService.update(newAppointment).subscribe(() => {
      this.sweetAlertService
        .showMsjSuccess('home.messages.updatedAppointmentDatetitle', 'home.messages.updatedAppointmentDateMsj')
        .then(() => {
          this.updateList.emit(true);
          this.modalService.dismissAll();
        });
    });
  }

  cancelAppointment(appointment: IAppointment): void {
    this.sweetAlertService
      .showConfirmMsg({
        title: 'medilabApp.deleteConfirm.title',
        text: 'medilabApp.deleteConfirm.text',
        confirmButtonText: 'medilabApp.deleteConfirm.confirmButtonText',
        cancelButtonText: 'medilabApp.deleteConfirm.cancelButtonText',
      })
      .then(res => {
        if (res) {
          appointment.status = Status.CANCELED;
          appointment.canceled = true;
          this.appointmentService.update(appointment).subscribe(() => {
            this.sweetAlertService.showMsjSuccess('home.messages.cancelAppointmentTitle', 'home.messages.cancelAppointmentMsj').then(() => {
              this.updateList.emit(true);
            });
          });
        }
      });
  }
}
