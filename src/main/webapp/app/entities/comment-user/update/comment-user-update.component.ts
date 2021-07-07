import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICommentUser, CommentUser } from '../comment-user.model';
import { CommentUserService } from '../service/comment-user.service';
import { IComment } from 'app/entities/comment/comment.model';
import { CommentService } from 'app/entities/comment/service/comment.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

@Component({
  selector: 'medi-comment-user-update',
  templateUrl: './comment-user-update.component.html',
})
export class CommentUserUpdateComponent implements OnInit {
  isSaving = false;

  commentsSharedCollection: IComment[] = [];
  patientsSharedCollection: IPatient[] = [];
  doctorsSharedCollection: IDoctor[] = [];

  editForm = this.fb.group({
    id: [],
    comment: [],
    patient: [],
    doctor: [],
  });

  constructor(
    protected commentUserService: CommentUserService,
    protected commentService: CommentService,
    protected patientService: PatientService,
    protected doctorService: DoctorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commentUser }) => {
      this.updateForm(commentUser);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commentUser = this.createFromForm();
    if (commentUser.id !== undefined) {
      this.subscribeToSaveResponse(this.commentUserService.update(commentUser));
    } else {
      this.subscribeToSaveResponse(this.commentUserService.create(commentUser));
    }
  }

  trackCommentById(index: number, item: IComment): number {
    return item.id!;
  }

  trackPatientById(index: number, item: IPatient): number {
    return item.id!;
  }

  trackDoctorById(index: number, item: IDoctor): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommentUser>>): void {
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

  protected updateForm(commentUser: ICommentUser): void {
    this.editForm.patchValue({
      id: commentUser.id,
      comment: commentUser.comment,
      patient: commentUser.patient,
      doctor: commentUser.doctor,
    });

    this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing(this.commentsSharedCollection, commentUser.comment);
    this.patientsSharedCollection = this.patientService.addPatientToCollectionIfMissing(this.patientsSharedCollection, commentUser.patient);
    this.doctorsSharedCollection = this.doctorService.addDoctorToCollectionIfMissing(this.doctorsSharedCollection, commentUser.doctor);
  }

  protected loadRelationshipsOptions(): void {
    this.commentService
      .query()
      .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
      .pipe(
        map((comments: IComment[]) => this.commentService.addCommentToCollectionIfMissing(comments, this.editForm.get('comment')!.value))
      )
      .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));

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

  protected createFromForm(): ICommentUser {
    return {
      ...new CommentUser(),
      id: this.editForm.get(['id'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      patient: this.editForm.get(['patient'])!.value,
      doctor: this.editForm.get(['doctor'])!.value,
    };
  }
}
