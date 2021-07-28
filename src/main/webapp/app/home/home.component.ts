import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SweetAlertService } from 'app/shared/services/sweet-alert.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { Patient } from 'app/entities/patient/patient.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { Doctor } from 'app/entities/doctor/doctor.model';

import { AppointmentTreatmentAilmentService } from 'app/entities/appointment-treatment-ailment/service/appointment-treatment-ailment.service';
import { IAppointmentTreatmentAilment } from 'app/entities/appointment-treatment-ailment/appointment-treatment-ailment.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

import { Status } from 'app/entities/enumerations/status.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { EmergencyContactService } from 'app/entities/emergency-contact/service/emergency-contact.service';
import { EmergencyContact, IEmergencyContact } from 'app/entities/emergency-contact/emergency-contact.model';
import { EmergencyContactUpdateComponent } from '../entities/emergency-contact/update/emergency-contact-update.component';
import { EmergencyContactRegisterComponent } from '../entities/emergency-contact/register/emergency-contact-register.component';

@Component({
  selector: 'medi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  patient: Patient | null = null;
  doctor: Doctor | null = null;
  thePatient: any;
  theDoctorId = 0;
  emergencyContacts: IEmergencyContact[] = [];
  emergencyContact: EmergencyContact | null = null;
  isLoadingEmergencyContact = false;
  isLoadingAppointmentTreatmentAilment = false;
  appointmentTreatmentAilmentNew: IAppointmentTreatmentAilment[] | null = null;
  authority: string | undefined;
  appointmentsDoctor: any[] = [];
  appointmentsPatient: any[] | undefined = [];
  ailmentsPatient: any[] | undefined = [];
  closeModal: string | undefined;
  ailment: any;
  updatedDate = new FormControl('');
  appointmentToChangeDate: IAppointment | null = null;
  currentUser: any;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private sweetAlertService: SweetAlertService,
    private accountService: AccountService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private emergencyContactService: EmergencyContactService,
    private appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
    private router: Router,
    protected modalService: NgbModal
  ) {}

  public get emergencyContactsTotal(): number {
    return this.emergencyContacts.length;
  }

  ngOnInit(): void {
    this.autenticatedAccount();
    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      if (this.account?.authorities[0] === 'ROLE_PATIENT') {
        this.mergeAccountWithPatient(this.account);
      }

      if (this.account?.authorities[0] === 'ROLE_USER') {
        this.doctorService.findByInternalUser(this.account.id).subscribe((res: any) => {
          this.theDoctorId = res.body.id;
          console.log('from home', res.body.id);
          this.appointmentService.findDoctorAppointments(this.theDoctorId).subscribe((response: any) => {
            let index = 0;
            this.appointmentsDoctor = response.body;
            this.formatPatientData(this.appointmentsDoctor).subscribe(data => {
              this.appointmentsDoctor[index].patient = data;
              index++;
            });
          });
        });
      }
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

  public autenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
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
        this.getAilmentsPatient();
      });
    });
    this.loadAllEmergencyContact();
    this.loadAllAppoiments();
  }

  getAilmentsPatient(): void {
    this.appointmentTreatmentAilmentService.query().subscribe(data => {
      this.appointmentsPatient?.forEach(appointment => {
        if (data.body !== null) {
          data.body.forEach(element => {
            if (element.appointment?.id === appointment.id) {
              this.ailmentsPatient?.push(element);
            }
          });
        }
      });
    });
  }

  trackId(index: number, item: IEmergencyContact): number {
    return item.id!;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  cancelAppointment(appointment: IAppointment): void {
    appointment.status = Status.CANCELED;
    this.appointmentService.update(appointment).subscribe(() => {
      this.sweetAlertService.showMsjInfo('home.messages.cancelAppointmentTitle', 'home.messages.cancelAppointmentMsj');
      this.ngOnInit();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public deleteEmergencyContact(emergencyContact: IEmergencyContact): void {
    this.sweetAlertService
      .showConfirmMsg({
        title: 'medilabApp.deleteConfirm.title',
        text: 'medilabApp.deleteConfirm.text',
        confirmButtonText: 'medilabApp.deleteConfirm.confirmButtonText',
        cancelButtonText: 'medilabApp.deleteConfirm.cancelButtonText',
      })
      .then(res => {
        if (res) {
          this.emergencyContactService.delete(<number>emergencyContact.id).subscribe(() => {
            this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.deleteConfirm.titleSuccess').then(() => {
              this.loadAllEmergencyContact();
            });
          });
        }
      });
  }

  public loadAllEmergencyContact(): void {
    this.isLoadingEmergencyContact = true;
    this.patientService.findOneByInternalUser(<number>this.account?.id).subscribe(patient => {
      this.emergencyContactService.findByPatientId(<number>patient.body?.id).subscribe((res: any) => {
        this.emergencyContacts = res.body;
      });
    });
  }

  loadAllAppoiments(): void {
    this.isLoadingAppointmentTreatmentAilment = true;

    this.appointmentTreatmentAilmentService.query().subscribe(
      (res: HttpResponse<IAppointmentTreatmentAilment[]>) => {
        this.isLoadingAppointmentTreatmentAilment = false;
        this.appointmentTreatmentAilmentNew = res.body ?? [];
      },
      () => {
        this.isLoadingAppointmentTreatmentAilment = false;
      }
    );
  }

  openChangeDateModal(content: any, clickedElementIndex: any): void {
    if (this.appointmentsDoctor.length) {
      this.appointmentToChangeDate = this.appointmentsDoctor[clickedElementIndex];
    }
    this.modalService.open(content);
  }

  handleChangeDate(): void {
    const newAppointment = {
      ...this.appointmentToChangeDate,
      date: this.updatedDate.value,
    };
    this.appointmentService.update(newAppointment).subscribe(() => {
      this.sweetAlertService.showMsjInfo('home.messages.updatedAppointmentDatetitle', 'home.messages.updatedAppointmentDateMsj');
      window.setTimeout(() => this.ngOnInit(), 1000);
    });
    this.modalService.dismissAll();
  }

  public showModifyContactModal(emergencyContact: IEmergencyContact): void {
    const modalRef = this.modalService.open(EmergencyContactUpdateComponent);
    modalRef.componentInstance.setEmergencyContactData(emergencyContact);
  }

  public showCreateContactModal(): void {
    const modalRef = this.modalService.open(EmergencyContactRegisterComponent);
    modalRef.componentInstance.patientId = this.currentUser.patientId;
    modalRef.closed.subscribe(reason => {
      if (reason === 'register') {
        this.loadAllEmergencyContact();
      }
    });
  }

  open(content: any, ailment: any): void {
    this.modalService.open(content, {
      windowClass: 'elementoPrueba',
    });
    this.ailment = ailment;
  }

  openAilmentModal(content: any, ailment: any): void {
    this.modalService.open(content);
    this.ailment = ailment;
  }
}
