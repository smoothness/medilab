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
import { Patient as thePatient, IPatient } from 'app/entities/patient/patient.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';
import { Doctor, Patient} from './../core/auth/account.model';

import { AppointmentTreatmentAilmentService } from 'app/entities/appointment-treatment-ailment/service/appointment-treatment-ailment.service';
import { IAppointmentTreatmentAilment } from 'app/entities/appointment-treatment-ailment/appointment-treatment-ailment.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

import { Status } from 'app/entities/enumerations/status.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';
import { EmergencyContactService } from 'app/entities/emergency-contact/service/emergency-contact.service';
import { EmergencyContact, IEmergencyContact } from 'app/entities/emergency-contact/emergency-contact.model';
import { EmergencyContactUpdateComponent } from '../entities/emergency-contact/update/emergency-contact-update.component';
import { EmergencyContactRegisterComponent } from '../entities/emergency-contact/register/emergency-contact-register.component';
import * as dayjs from 'dayjs';

import { AilmentService } from 'app/entities/ailment/service/ailment.service';

// Treatmnts
import { ITreatment, Treatment } from '../entities/treatment/treatment.model';
import { TreatmentService } from '../entities/treatment/service/treatment.service';
import { TreatmentDeleteDialogComponent } from '../entities/treatment/delete/treatment-delete-dialog.component';

@Component({
  selector: 'medi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
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

  // treatments
 
  patient: thePatient | null = null;
  patients: IPatient[] | null = null;
  isLoadingPatient = false;

  treatments?: Treatment[];
  treatment: any;

  appointments?: IAppointment[];
  isLoadingAppointments = false;

  appointmentTreatmentAilment?: IAppointmentTreatmentAilment[];
  appointmentTreatmentAilments?: IAppointmentTreatmentAilment[];
  isLoadingAppointmentTreatmentAilments = false;

  isLoadingtreatment = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private sweetAlertService: SweetAlertService,
    private accountService: AccountService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    protected treatmentService: TreatmentService,
    private appointmentService: AppointmentService,
    private emergencyContactService: EmergencyContactService,
    private appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
    private router: Router,
    private ailmentService: AilmentService,
    protected modalService: NgbModal
  ) {}

  public get isPatient(): boolean {
    return this.currentUser instanceof thePatient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }

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
          this.appointmentService.findDoctorAppointments(this.theDoctorId).subscribe((response: any) => {
            let index = 0;
            this.appointmentsDoctor = response.body
              .filter((item: IAppointment) => item.status === 'PENDING')
              .sort((a: IAppointment, b: IAppointment) => {
                if (a.date && b.date) {
                  return new Date(String(a.date)).valueOf() - new Date(String(b.date)).valueOf();
                }
                return null;
              });
            this.formatPatientData(this.appointmentsDoctor).subscribe(data => {
              this.appointmentsDoctor[index].patient = data;
              index++;
            });
          });
        });
      }
    });
    
    this.loadPacient();
    this.loadAllPacientAppointments();
    this.loadAllAppointmentTreatmentAilmentService();
    this.loadAllTreatments();
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

  // Treaments

  openTreatment(content: any, treatment: any): void {
    this.modalService.open(content, {
      windowClass: 'elementTreatment',
    });
    this.treatment = treatment;
  }

  openTreatmentModal(content: any, treatment: any): void {
    this.modalService.open(content);
    this.treatment = treatment;
  }

  loadAllTreatments(): void {
    this.isLoadingtreatment = true;

    this.treatmentService.query().subscribe(
      (res: HttpResponse<ITreatment[]>) => {
        this.isLoadingtreatment = false;
        this.treatments = res.body?.filter(
          data => this.searchForTreatment(data)
        ) ?? [];
      },
      () => {
        this.isLoadingtreatment = false;
      }
    );
  }

  loadPacient(): void {
    this.isLoadingPatient = true;

    this.patientService.query().subscribe(
      (res: HttpResponse<IPatient[]>) => {
        this.isLoadingPatient = false;
        this.patients = res.body?.filter(
          data => data.internalUser?.id === this.account?.id
        ) ?? [];

        this.patient = this.patients[0];
      },
      () => {
        this.isLoadingPatient = false;
      }
    );
  }

  loadAllPacientAppointments(): void {
    this.isLoadingAppointments = true;

    this.appointmentService.query().subscribe(
      (res: HttpResponse<IAppointment[]>) => {
        this.isLoadingAppointments = false;
        this.appointments = res.body?.filter(
          data => data.patient?.id === this.patient?.id
        ) ?? [];
      },
      () => {
        this.isLoadingAppointments = false;
      }
    );

  }

  loadAllAppointmentTreatmentAilmentService(): void {
    this.isLoadingAppointmentTreatmentAilments = true;

    this.appointmentTreatmentAilmentService.query().subscribe(
      (res: HttpResponse<IAppointmentTreatmentAilment[]>) => {
        this.isLoadingAppointmentTreatmentAilments = false;
        this.appointmentTreatmentAilments = res.body ?? [];
      },
      () => {
        this.isLoadingAppointmentTreatmentAilments = false;
      }
    );
  }

    searchForTreatment(item: ITreatment): boolean {
    let result = false;
    this.appointmentTreatmentAilments?.forEach(
      data=> {
        if(data.treatment?.id === item.id
          && this.searchForAppointment(data)){
          result = true;
        }
      })
    return result;
  }

  searchForAppointment(item: IAppointmentTreatmentAilment): boolean {
    let result = false;
    this.appointments?.forEach(
      data=> {
        if(data.id === item.appointment?.id){
          result = true;
        }
      }
    )
    return result;
  }

  removedTranslation(item: IAppointmentTreatmentAilment): boolean {
    let result = false;
    this.appointments?.forEach(
      data=> {
        if(data.id === item.appointment?.id){
          result = true;
        }
      }
    )
    return result;
  }

  delete(treatment: ITreatment): void {
    const modalRef = this.modalService.open(TreatmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.treatment = treatment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAllTreatments();
      }
    });
  }
}
