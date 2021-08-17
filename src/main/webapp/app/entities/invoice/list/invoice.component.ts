import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceDeleteDialogComponent } from '../delete/invoice-delete-dialog.component';

import { AccountService } from 'app/core/auth/account.service';
import { Account, Doctor, Patient } from 'app/core/auth/account.model';

import { PatientService } from 'app/entities/patient/service/patient.service';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'medi-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent implements OnInit {
  invoices?: any[] | undefined = [];
  isLoading = false;
  account: Account | null = null;
  currentUser: any = {};
  appointments: any[] = [];

  constructor(
    protected invoiceService: InvoiceService,
    protected accountService: AccountService,
    protected patientService: PatientService,
    protected appointmentService: AppointmentService,
    protected doctorService: DoctorService,
    protected modalService: NgbModal
  ) {}

  public get isPatient(): boolean {
    return this.currentUser instanceof Patient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }

  ngOnInit(): void {
    this.authenticatedAccount();
    //this.getInvoicesHistory();

    console.log('appointmentsDoctor', this.appointments);
  }
  /*
  getInvoicesHistoryDoctor(): void {
    this.appointmentsDoctor?.forEach( appointment => {
      this.invoiceService.findInvoicesByAppointmentID(appointment.doctor.)
    })
  }

  getInvoicesHistoryPatient(): void {
    console.log("appointmentsDoctor", this.appointmentsDoctor);
    console.log("appointmentsPatient", this.appointmentsPatient);


  }*/

  public authenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
      this.getAppointmentHistoryByUser();
    });
  }

  public getAppointmentHistoryByUser(): void {
    if (this.isPatient) {
      this.getPatientAppointmentHistory();
    } else if (this.isDoctor) {
      this.getDoctorAppointmentHistory();
    } else {
      this.loadAll();
    }
  }

  public getPatientAppointmentHistory(): void {
    this.appointmentService.findPatientAppointmentsHistory(this.currentUser.patientId).subscribe((appointments: any) => {
      let index = 0;
      this.appointments = appointments.body;
      this.formatDoctorData(this.appointments).subscribe(data => {
        this.appointments[index].doctor = data;
        index++;
      });
      this.appointments.forEach(appointment => {
        this.invoiceService.findInvoicesByAppointmentID(appointment.id).subscribe((res: any) => {
          this.invoices = res.body;
          console.log('body', this.invoices);
        });
      });
    });
  }

  public formatDoctorData(appointments: any): Observable<any> {
    return new Observable(subscriber => {
      for (const appointment of appointments[Symbol.iterator]()) {
        this.doctorService.find(appointment.doctor.id).subscribe(doctor => {
          subscriber.next(doctor.body);
        });
      }
    });
  }

  public getDoctorAppointmentHistory(): void {
    this.appointmentService.findDoctorAppointmentsHistory(this.currentUser.doctorId).subscribe((appointments: any) => {
      let index = 0;
      this.appointments = appointments.body;
      this.formatPatientData(this.appointments).subscribe(data => {
        this.appointments[index].patient = data;
        index++;
      });
      this.appointments.forEach(appointment => {
        this.invoiceService.findInvoicesByAppointmentID(appointment.id).subscribe((res: any) => {
          this.invoices = res.body;
          console.log('body', this.invoices);
        });
      });
    });
  }

  public formatPatientData(appointments: any): Observable<any> {
    return new Observable(subscriber => {
      for (const appointment of appointments[Symbol.iterator]()) {
        this.patientService.find(appointment.patient.id).subscribe(patient => {
          subscriber.next(patient.body);
        });
      }
    });
  }

  public getAppointmentHistory(): void {
    this.appointmentService.findAppointmentsHistory().subscribe((appointments: any) => {
      let index = 0;
      this.appointments = appointments.body;
      this.formatDoctorData(this.appointments).subscribe(data => {
        this.appointments[index].doctor = data;
        index++;
      });
      let index2 = 0;
      this.formatPatientData(this.appointments).subscribe(data => {
        this.appointments[index2].patient = data;
        index2++;
      });
    });
  }

  loadAll(): void {
    this.isLoading = true;

    this.invoiceService.query().subscribe(
      (res: HttpResponse<IInvoice[]>) => {
        this.isLoading = false;
        this.invoices = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  delete(invoice: IInvoice): void {
    const modalRef = this.modalService.open(InvoiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.invoice = invoice;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  trackId(index: number, item: IInvoice): number {
    return item.id!;
  }
}
