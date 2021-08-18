import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MedicalExamnsRegisterComponent } from '../../medical-exams/register/medical-examns-register.component';
import { IMedicalExams } from '../../medical-exams/medical-exams.model';
import { MedicalExamsService } from '../../medical-exams/service/medical-exams.service';
import { AccountService } from '../../../core/auth/account.service';
import { Doctor, Patient } from '../../../core/auth/account.model';
import { LineCommentUpdateComponent } from 'app/entities/line-comment/update/line-comment-update.component';
import { InvoiceService } from '../../invoice/service/invoice.service';
import { InvoiceDetailComponent } from '../../invoice/detail/invoice-detail.component';
import { IInvoice } from '../../invoice/invoice.model';
import { AppointmentTreatmentAilmentRegisterComponent } from "../../appointment-treatment-ailment/register/appointment-treatment-ailment-register.component";
import { AppointmentTreatmentAilmentService } from "../../appointment-treatment-ailment/service/appointment-treatment-ailment.service";
import { IAppointmentTreatmentAilment } from "../../appointment-treatment-ailment/appointment-treatment-ailment.model";

@Component({
  selector: 'medi-appointment-detail',
  templateUrl: './appointment-detail.component.html',
})
export class AppointmentDetailComponent implements OnInit {
  appointment: any | null = null;
  medicalExams: IMedicalExams[] = [];
  diagnosis: IAppointmentTreatmentAilment[] = [];
  currentUser: any;
  userType = 'doctor';
  invoicePending: any;
  isPending = false;

  constructor(
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private medicalExamsService: MedicalExamsService,
    protected invoiceService: InvoiceService,
    private diagnosisService: AppointmentTreatmentAilmentService

  ) {}

  public get isPatient(): boolean {
    return this.currentUser instanceof Patient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }

  get showButtons(): boolean {
    let show = true;
    if (this.currentUser instanceof Patient) {
      show = false;
    }
    return show;
  }

  ngOnInit(): void {
    this.autenticatedAccount();
    this.activatedRoute.data.subscribe(({ appointment }) => {
      this.appointment = appointment;
      this.getAppointmentExams();
      this.getAppointmentDiagnosis();
    });
    this.isPendingInvoice();
  }

  public isPendingInvoice(): void {
    this.invoiceService.checkPending(this.appointment.id).subscribe(res => {
      this.invoicePending = res.body;
      if (this.invoicePending.status === 'PAID') {
        this.isPending = true;
      }
    });
  }

  showRegisterInvoiceBtn(): boolean {
    let show = false;

    if (this.isDoctor && this.invoicePending?.id === null) {
      show = true;
    }
    return show;
  }

  public autenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
    });
  }

  public showRegisterMedicalExamModal(): void {
    const modalRef = this.modalService.open(MedicalExamnsRegisterComponent, { centered: true });
    modalRef.componentInstance.appointment = this.appointment;
    modalRef.closed.subscribe(reason => {
      if (reason === 'register') {
        this.getAppointmentExams();
      }
    });
  }

  public showRegisterInvoiceModal(): void {
    const modalRef = this.modalService.open(LineCommentUpdateComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.appointment = this.appointment;
  }

  public showInvoiceDetail(): void {
    const modalRef = this.modalService.open(InvoiceDetailComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.invoicePending = this.invoicePending;
  }

  public showRegisterMedicalExam(status: any): boolean {
    let show = false;
    if (this.isDoctor && status === 'PENDING') {
      show = true;
    }
    return show;
  }

  public getAppointmentExams(): void {
    this.medicalExamsService.findByAppointment(<number>this.appointment.id).subscribe((exams: any) => {
      this.medicalExams = exams.body;
    });
  }

  public loadMedicalExams(updated: boolean): void {
    if (updated) {
      this.getAppointmentExams();
    }
  }

  public showRegisterDiagnosisModal(): void {
    const modalRef = this.modalService.open(AppointmentTreatmentAilmentRegisterComponent, { centered: true });
    modalRef.componentInstance.appointment = this.appointment;
    modalRef.closed.subscribe(reason => {
      if (reason === 'register') {
        this.getAppointmentDiagnosis();
      }
    });
  }

  public loadDiagnosis(updated: boolean): void {
    if(updated){
      this.getAppointmentDiagnosis();
    }
  }

  public getAppointmentDiagnosis(): void {
    this.diagnosisService.findByAppointment(this.appointment.id).subscribe((res: any) => {
      this.diagnosis = res.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
