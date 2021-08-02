import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRatingUser, RatingUser } from '../rating-user.model';
import { RatingUserService } from '../service/rating-user.service';
import { IRating, Rating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { IPatient, Patient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor, Doctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

import { Appointment, IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment//service/appointment.service';
import { AppointmentDeleteDialogComponent } from 'app/entities/appointment/delete/appointment-delete-dialog.component';

import { UserService } from 'app/entities/user/user.service';
import { User, IUser } from 'app/entities/user/user.model';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'medi-rating-user-update',
  templateUrl: './rating-user-update.component.html',
})
export class RatingUserUpdateComponent implements OnInit {
  isSaving = false;

  ratingsSharedCollection: IRating[] = [];
  patientsSharedCollection: IPatient[] = [];
  doctorsSharedCollection: IDoctor[] = [];

  account: Account | null = null;
  isLoading = false;

  patient: Patient | null = null;
  patients: IPatient[] | null = null;
  isLoadingPatient = false;

  user: User | null = null;
  users: IUser[] | null = null;
  isLoadingUser = false;

  doctor: Doctor | null = null;
  doctors: IDoctor[] | null = null;
  isLoadingDoctor = false;

  appointmentsPatient: any[] | undefined = [];
  appointments: IAppointment[] | null = null;
  isLoadingAppointments = false;

  editForm = this.fb.group({
    id: [],
    rating: ['', [Validators.required]],
    patient: [],
    doctor: ['', [Validators.required]],
  });

  constructor(
    protected appointmentService: AppointmentService,
    protected ratingUserService: RatingUserService,
    protected patientService: PatientService,
    protected activatedRoute: ActivatedRoute,
    protected ratingService: RatingService,
    protected doctorService: DoctorService,
    private accountService: AccountService,
    protected userService: UserService,
    protected fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loadAccount();
    this.loadPatient();
    this.loadAllPacientAppointments();
    
    this.activatedRoute.data.subscribe(({ ratingUser }) => {

      this.loadDoctors();
      this.updateForm(ratingUser);
      this.loadRelationshipsOptions();

    });
  }

  previousState(): void {
    window.history.back();
  }

  loadAccount(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => {
        this.account = account;
      }
      );
  }
  
  save(): void {
    this.isSaving = true;
    const ratingUser = this.createFromForm();
    if (ratingUser.id !== undefined) {
      this.subscribeToSaveResponse(this.ratingUserService.update(ratingUser));
    } else {
      this.subscribeToSaveResponse(this.ratingUserService.create(ratingUser));
    }
  }


  loadPatient(): void {
    this.isLoadingPatient = true;
    this.patientService.query().subscribe(
      (res: HttpResponse<IPatient[]>) => {
        this.isLoadingPatient = false;
        this.patients = res.body?.filter(
          dataPatient => dataPatient.internalUser?.id === this.account?.id
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
        console.log("paciente", this.patient);
        this.appointments = res.body?.filter(
          appointmentData => appointmentData.patient?.id === this.patient?.id
        ) ?? [];
        console.log("appointments", this.appointments);
      },
      () => {
        this.isLoadingAppointments = false;
      }
    );

  }

  searchForAppointment(item: IDoctor): boolean {
    
    console.log("aqui", this.appointments)
    let result = false;
    this.appointments?.forEach(
      data=> {
        if(data.doctor?.id === item.id && data.id){
          result = true;
        }
      }
    )
    console.log("aqui", result)
    return result;
  }

  
  loadRaitings(): void {
    this.isLoadingPatient = true;
    this.patientService.query().subscribe(
      (res: HttpResponse<IPatient[]>) => {
        this.isLoadingPatient = false;
        this.patients = res.body?.filter(
          dataPatient => dataPatient.internalUser?.id === this.account?.id
        ) ?? [];
        this.patient = this.patients[0];
      },
      () => {
        this.isLoadingPatient = false;
      }
    );
  }


  trackRatingById(index: number, item: IRating): number {
    return item.id!;
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  trackDoctorById(index: number, item: IDoctor): number {
    return item.id!;
  }

  loadUser(): void {
    this.isLoadingUser = true;
    this.userService.query().subscribe(
      (res: HttpResponse<IUser[]>) => {
        this.isLoadingUser = false;
        this.users = res.body ?? [];
      },
      () => {
        this.isLoadingUser = false;
      }
    );
  }

  loadDoctors(): void {
    this.isLoadingDoctor = true;

    this.doctorService.query().subscribe(
      (res: HttpResponse<IDoctor[]>) => {
        this.isLoadingDoctor = false;
        this.doctors = res.body?.filter(
          doctorData => this.searchForAppointment(doctorData)
        ) ?? [];
      },
      () => {
        this.isLoadingDoctor = false;
      }
    );
  }

  searchDoctorFullName(doctorSearching?: Doctor): string {
    let accountAux: any;
    this.doctors?.forEach(
      doctorData => {
        if (doctorData.id === doctorSearching?.id && doctorData.id) {
          accountAux = doctorData.internalUser;
        }
      }
    )
    return String(accountAux.completeName);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRatingUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ratingUser: IRatingUser): void {
    this.editForm.patchValue({
      id: ratingUser.id,
      rating: ratingUser.rating,
      patient: ratingUser.patient,
      doctor: ratingUser.doctor,
    });

    this.ratingsSharedCollection = this.ratingService.addRatingToCollectionIfMissing(this.ratingsSharedCollection, ratingUser.rating);
    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing(this.patientsSharedCollection, ratingUser.patient);
    this.doctorsSharedCollection = this.doctorService.addDoctorToCollectionIfMissing(this.doctorsSharedCollection, ratingUser.doctor);
  }

  protected loadRelationshipsOptions(): void {
    this.ratingService //filtrar doctores
      .query()
      .pipe(map((res: HttpResponse<IRating[]>) => res.body ?? []))
      .pipe(map((ratings: IRating[]) => this.ratingService.addRatingToCollectionIfMissing(ratings, this.editForm.get('rating')!.value)))
      .subscribe((ratings: IRating[]) => (this.ratingsSharedCollection = ratings));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body?.filter(
        dataPatient => dataPatient.id === this.patient?.id
      ) ?? []))
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));

    this.doctorService
      .query()
      .pipe(map((res: HttpResponse<IDoctor[]>) => res.body?.filter(
        doctorData => this.searchForAppointment(doctorData)
      ) ?? [])) //filtrar doctores
      .pipe(map((doctors: IDoctor[]) => this.doctorService.addDoctorToCollectionIfMissing(doctors, this.editForm.get('doctor')!.value)))
      .subscribe((doctors: IDoctor[]) => (this.doctorsSharedCollection = doctors));
  }

  protected createFromForm(): IRatingUser {
    return {
      ...new RatingUser(),
      id: this.editForm.get(['id'])!.value,
      rating: this.editForm.get(['rating'])!.value,
      patient: this.editForm.get(['patient'])!.value,
      doctor: this.editForm.get(['doctor'])!.value,
    };
  }

  protected newRating(): IRating {
    return {
      ...new Rating(),
      value: this.editForm.get(['id'])!.value,
      date: dayjs()
    };
  }



}
