import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IAppointment } from '../appointment.model';
import { MedicalExamnsRegisterComponent } from "../../medical-exams/register/medical-examns-register.component";
import { IMedicalExams } from "../../medical-exams/medical-exams.model";
import { MedicalExamsService } from "../../medical-exams/service/medical-exams.service";
import { AccountService } from "../../../core/auth/account.service";
import { Patient } from "../../../core/auth/account.model";


@Component({
  selector: 'medi-appointment-detail',
  templateUrl: './appointment-detail.component.html',
})
export class AppointmentDetailComponent implements OnInit {
  appointment: IAppointment = {};
  medicalExams: IMedicalExams[] = [];
  currentUser: any;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    private accountService: AccountService,
    private medicalExamsService: MedicalExamsService
  ) {}

  get showButtons(): boolean {
    let show = true;
    console.log('user->', this.currentUser);
    if (this.currentUser instanceof Patient){
      show = false;
    }
    console.log(show);
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
