import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
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
import { EmergencyContactDeleteDialogComponent } from '../entities/emergency-contact/delete/emergency-contact-delete-dialog.component';
import { IAilment } from 'app/entities/ailment/ailment.model';
import { UserService } from 'app/entities/user/user.service';

import { NgModule } from '@angular/core';

@Component({
  selector: 'medi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  patient: Patient | null = null;
  doctor: Doctor | null = null;
  thePatient: any;
  theDoctor: any;
  emergencyContacts: IEmergencyContact[] | null = null;
  emergencyContact: EmergencyContact | null = null;
  isLoadingEmergencyContact = false;
  isLoadingAppointmentTreatmentAilment = false;
  appointmentTreatmentAilmentNew: IAppointmentTreatmentAilment[] | null = null;
  authority: string | undefined;
  // authority: string | undefined;
  appointmentsDoctor: any[] | undefined = [];
  appointmentsPatient: any[] | undefined = [];
  ailmentsPatient : any[] | undefined = [];
  closeModal: string | undefined;
  ailment : any;
  private readonly destroy$ = new Subject<void>();


  constructor(
    private sweetAlertService: SweetAlertService,
    private accountService: AccountService,
    private userService: UserService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private emergencyContactService: EmergencyContactService,
    private appointmentTreatmentAilmentService : AppointmentTreatmentAilmentService,
    private router: Router,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      // .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account = account;
        if (this.account?.authorities[0] === 'ROLE_PATIENT') {
          this.mergeAccountWithPatient(this.account);
        }

        if (this.account?.authorities[0] === 'ROLE_USER') {
          this.mergeAccountWithDoctor(this.account);
        }
      });

    // this.patientService
    //   .find(Number(this.account?.login))
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(patientNew => {
    //     this.patient = patientNew.body;
    //   });

    // this.doctorService
    //   .find(Number(this.account?.login))
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(doctor => {
    //     this.doctor = doctor.body;
    //   });

    // this.emergencyContactService
    //   .find(Number(this.account?.login))
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(emergencyContactNew => {
    //     if (emergencyContactNew.body?.id === this.account?.login) {
    //       this.emergencyContact = emergencyContactNew.body;
    //     }
    //   });

    // this.loadAllEmergencyContact();
  }

 



  mergeAccountWithPatient(account: Account): void {
    this.patientService.query().subscribe(res => {
      this.thePatient = res.body?.find(patient => patient.internalUser?.id === account.id);
      this.appointmentService.query().subscribe(data => {
        this.appointmentsPatient = data.body?.filter(appointment => appointment.patient?.id === this.thePatient?.id);
        this.getAilmentsPatient();
      });
    });


    this.loadAllEmergencyContact();
    this.loadAllAppoiments();

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
          this.accountService.retrieveUserById(Number(appointment.patient?.id)).subscribe(user => {
            Object.assign(appointment.patient, user);
          });
          return appointment.doctor?.id === this.theDoctor?.internalUser.id && appointment.status !== 'CANCELED';
        });
      });
    });
  }

  getAilmentsPatient(): void{
  this.appointmentTreatmentAilmentService.query()
  .subscribe(data => {
    this.appointmentsPatient?.forEach(appointment => {

      if (data.body !== null){
        data.body.forEach(element => {
          if(element.appointment?.id === appointment.id){
            this.ailmentsPatient?.push(element);
          }
        });
      }

    });

  })

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

  deleteEmergencyContact(emergencyContact: IEmergencyContact): void {
    const modalRef = this.modalService.open(EmergencyContactDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.emergencyContact = emergencyContact;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAllEmergencyContact();
      }
    });
  }

  loadAllEmergencyContact(): void {
    this.isLoadingEmergencyContact = true;
    this.emergencyContactService.query().subscribe(
      (res: HttpResponse<IEmergencyContact[]>) => {
        this.isLoadingEmergencyContact = false;
        this.emergencyContacts = res.body ?? [];
      },
      () => {
        this.isLoadingEmergencyContact = false;
      }
    );
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

  open(content : any, ailment : any): void {
   this.modalService.open(content, {
     windowClass: 'elementoPrueba'
    }
    )
   console.log("Pedrito" , ailment )
   this.ailment = ailment;
  }
  
}


