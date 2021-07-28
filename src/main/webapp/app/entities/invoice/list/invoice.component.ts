import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceDeleteDialogComponent } from '../delete/invoice-delete-dialog.component';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { PatientService } from 'app/entities/patient/service/patient.service';

import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

@Component({
  selector: 'medi-invoice',
  templateUrl: './invoice.component.html',
})
export class InvoiceComponent implements OnInit {
  invoices?: any[] | undefined = [];
  isLoading = false;
  account: Account | null = null;
  thePatient: any;
  theDoctor: any;
  appointmentsPatient: any[] | undefined = [];
  appointmentsDoctor: any[] | undefined = [];

  constructor(
    protected invoiceService: InvoiceService,
    protected accountService: AccountService,
    protected patientService: PatientService,
    protected appointmentService: AppointmentService,
    protected doctorService: DoctorService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      if (this.account?.authorities[0] === 'ROLE_PATIENT') {
        this.mergeAccountWithPatient(this.account);
      }

      if (this.account?.authorities[0] === 'ROLE_USER') {
        console.log('cuenta', this.account);
        this.mergeAccountWithDoctor(this.account);
      }

      if (this.account?.authorities[0] === 'ROLE_ADMIN') {
        this.loadAll();
      }
    });
  }

  mergeAccountWithPatient(account: Account): void {
    this.patientService.query().subscribe(res => {
      this.thePatient = res.body?.find(patient => patient.internalUser?.id === account.id);
      this.appointmentService.query().subscribe(data => {
        this.appointmentsPatient = data.body?.filter(appointment => {
          this.accountService.retrieveUserById(Number(appointment.doctor?.id)).subscribe(doctor => {
            Object.assign(appointment.doctor, doctor);
          });
          return appointment.patient?.id === this.thePatient?.id;
        });
        this.getInvoices();
      });
    });
  }

  mergeAccountWithDoctor(account: Account): void {
    this.doctorService.query().subscribe(res => {
      this.theDoctor = res.body?.find(doctor => doctor.internalUser?.id === account.id);
      this.appointmentService.query().subscribe(data => {
        this.appointmentsDoctor = data.body?.filter(appointment => {
          // the information returned from the server of the doctor is incorrect
          // it is based on the doctor id, not the internal user id
          // same with the patient, that's why it is needed the patient internal user id
          // to query with the internal user id for the actual patient
          this.patientService.find(Number(appointment.patient?.id)).subscribe(patient => {
            Object.assign(appointment.patient, patient.body);
          });
          return appointment.doctor?.id === this.theDoctor?.internalUser.id && appointment.status !== 'CANCELED';
        });
      });
      this.getInvoices();
    });
  }

  getInvoices(): void {
    this.invoiceService.query().subscribe(data => {
      if (this.account?.authorities[0] === 'ROLE_PATIENT') {
        this.appointmentsPatient?.forEach(appointment => {
          if (data.body !== null) {
            data.body.forEach(element => {
              if (element.appointment?.id === appointment.id) {
                this.invoices?.push(element);
              }
            });
          }
        });
      } else {
        this.appointmentsDoctor?.forEach(appointment => {
          if (data.body !== null) {
            data.body.forEach(element => {
              if (element.appointment?.id === appointment.id) {
                this.invoices?.push(element);
              }
            });
          }
        });
      }
    });
  }

  trackId(index: number, item: IInvoice): number {
    return item.id!;
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
}
