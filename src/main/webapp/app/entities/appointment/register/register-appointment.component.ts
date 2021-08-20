import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, Validators} from "@angular/forms";
import { NgbActiveModal, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

import { AppointmentService } from "../service/appointment.service";
import { PatientService } from "../../patient/service/patient.service";
import { SweetAlertService } from "../../../shared/services/sweet-alert.service";

import { Patient } from "../../../core/auth/account.model";
import { Status } from "../../enumerations/status.model";


@Component({
  selector: 'medi-register-appointment',
  templateUrl: './register-appointment.component.html',
  styleUrls: ['./register-appointment.component.scss']
})
export class RegisterAppointmentComponent implements OnInit {
  @Input() doctor: any = {};
  patientList: any[] = [];
  todayDate: NgbDateStruct;

  registerForm = this.fb.group({
    date: ['', [Validators.required]],
    patient: ['', [Validators.required]],
  });

  constructor(
    public activeModal: NgbActiveModal,
    protected fb: FormBuilder,
    protected patientService: PatientService,
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

  ngOnInit(): void {
    this.getPatients();
  }

  public getPatients(): void {
    this.patientService.query().subscribe((res: any) => {
      this.patientList = res.body;
      this.formatPatientData();
    })
  }

  public formatPatientData(): any {
    this.patientList.forEach((patient, index) => {
      this.patientList[index] =  new Patient(patient);
    });
  }

  public save(): void {
    this.appointmentService.create(this.createAppointment()).subscribe((res) =>{
      this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.appointment.register.registered').then(() => {
        this.registerForm.reset();
        this.activeModal.close('register');
      });
    });
  }

  public createAppointment(): any {
    return {
      id: null,
      date: this.registerForm.get(['date'])!.value,
      status: Status.PENDING,
      patient: this.registerForm.get(['patient'])!.value.patientData,
      doctor: this.doctor.doctorData,
    }
  }
}
