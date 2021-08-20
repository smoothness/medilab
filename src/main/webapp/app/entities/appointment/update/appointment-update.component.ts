import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


import { AccountService } from 'app/core/auth/account.service';
import { AppointmentService } from '../service/appointment.service';
import {SweetAlertService} from "../../../shared/services/sweet-alert.service";

import { IDoctor } from 'app/entities/doctor/doctor.model';

@Component({
  selector: 'medi-appointment-update',
  templateUrl: './appointment-update.component.html',
})
export class AppointmentUpdateComponent {
  @ViewChild('dateDp', { static: true } )
  public dateDp: any;

  @Input() appointment: any = {};
  isSaving = false;
  doctorAccount: any;
  doctorId: number | undefined;
  doctor: IDoctor | null = null;
  patientsCollection: any[] | null = [];
  todayDate: NgbDateStruct;
  appointmentDate = new Date(this.appointment.date);

  editForm = this.fb.group({
    date: ['', [Validators.required]],
  });

  constructor(
    public activeModal: NgbActiveModal,
    protected fb: FormBuilder,
    protected accountService: AccountService,
    protected appointmentService: AppointmentService,
    protected sweetAlertService: SweetAlertService,
  ) {
    const today = new Date();
    this.todayDate = {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    };
  }

  public get formattedDate(): NgbDate {
    return new NgbDate(
      this.appointmentDate.getFullYear() + 1,
      this.appointmentDate.getMonth() +1,
      this.appointmentDate.getDate() + 1);
  }

  public save(): void {
    const appointment = this.createFromForm();
    this.appointmentService.update(appointment).subscribe(() => {
      this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.appointment.updated').then(() => {
        this.activeModal.close('updated');
      });
    });
  }

  protected createFromForm(): any {
    return {
      id: this.appointment.id,
      date: this.editForm.get(['date'])!.value,
      status: this.appointment.status,
      patient: this.appointment.patient,
      doctor: this.appointment.doctor,
    };
  }
}
