import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { MedicalExamnsRegisterComponent } from "../../medical-exams/register/medical-examns-register.component";
import { IMedicalExams } from "../../medical-exams/medical-exams.model";
import { MedicalExamsService } from "../../medical-exams/service/medical-exams.service";
import { AccountService } from "../../../core/auth/account.service";
import {Doctor, Patient} from "../../../core/auth/account.model";
import {AppointmentTreatmentAilmentRegisterComponent} from "../../appointment-treatment-ailment/register/appointment-treatment-ailment-register.component";

@Component({
  selector: 'medi-appointment-detail',
  templateUrl: './appointment-detail.component.html',
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any | null = null;
  medicalExams: IMedicalExams[] = [];
  currentUser: any;
  userType = 'doctor';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    private accountService: AccountService,
    private medicalExamsService: MedicalExamsService
  ) {}

  public get isPatient(): boolean {
    return this.currentUser instanceof Patient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }

  get showButtons(): boolean {
    let show = true;
    if (this.currentUser instanceof Patient){
      show = false;
    }
    return show;
  }

  ngOnInit(): void {
    this.autenticatedAccount();
    this.activatedRoute.data.subscribe(({ appointment }) => {
      this.appointment = appointment;
      this.getAppointmentExams();
    });
  }

  public autenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
    });
  }

  public showRegisterMedicalExamModal(): void{
    const modalRef = this.modalService.open(MedicalExamnsRegisterComponent, { centered: true });
    modalRef.componentInstance.appointment = this.appointment;
    modalRef.closed.subscribe(reason => {
      if (reason === 'register') {
        this.getAppointmentExams();
      }
    });
  }

  public showAddMedicalExam(status: any): boolean {
    let show = false;
    if (this.isDoctor && status === 'PENDING') {
      show = true;
    }
    return show;
  }

  public showRegisterDiagnosisModal(): void {
    const modalRef = this.modalService.open(AppointmentTreatmentAilmentRegisterComponent, { centered: true });
  }

  public getAppointmentExams(): void {
    this.medicalExamsService.findByAppointment(<number>this.appointment.id).subscribe((exams: any) => {
      this.medicalExams = exams.body;
    });
  }

  public loadMedicalExams(updated: boolean): void {
    if(updated){
      this.getAppointmentExams();
    }
  }

  previousState(): void {
    window.history.back();
  }
}
