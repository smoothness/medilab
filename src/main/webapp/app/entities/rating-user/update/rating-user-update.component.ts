import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRatingUser, RatingUser } from '../rating-user.model';
import { RatingUserService } from '../service/rating-user.service';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

@Component({
  selector: 'medi-rating-user-update',
  templateUrl: './rating-user-update.component.html',
})
export class RatingUserUpdateComponent implements OnInit {
  isSaving = false;

  ratingsSharedCollection: IRating[] = [];
  patientsSharedCollection: IPatient[] = [];
  doctorsSharedCollection: IDoctor[] = [];

  editForm = this.fb.group({
    id: [],
    rating: [],
    patient: [],
    doctor: [],
  });

  constructor(
    protected ratingUserService: RatingUserService,
    protected ratingService: RatingService,
    protected patientService: PatientService,
    protected doctorService: DoctorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ratingUser }) => {
      this.updateForm(ratingUser);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
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

  trackRatingById(index: number, item: IRating): number {
    return item.id!;
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  trackDoctorById(index: number, item: IDoctor): number {
    return item.id!;
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
    this.ratingService
      .query()
      .pipe(map((res: HttpResponse<IRating[]>) => res.body ?? []))
      .pipe(map((ratings: IRating[]) => this.ratingService.addRatingToCollectionIfMissing(ratings, this.editForm.get('rating')!.value)))
      .subscribe((ratings: IRating[]) => (this.ratingsSharedCollection = ratings));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatient[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatient[]) => this.patientService.addPatientToCollectionIfMissing(patients, this.editForm.get('patient')!.value))
      )
      .subscribe((patients: IPatient[]) => (this.patientsSharedCollection = patients));

    this.doctorService
      .query()
      .pipe(map((res: HttpResponse<IDoctor[]>) => res.body ?? []))
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
}
