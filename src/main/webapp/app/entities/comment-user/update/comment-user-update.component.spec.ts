jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommentUserService } from '../service/comment-user.service';
import { ICommentUser, CommentUser } from '../comment-user.model';
import { IComment } from 'app/entities/comment/comment.model';
import { CommentService } from 'app/entities/comment/service/comment.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

import { CommentUserUpdateComponent } from './comment-user-update.component';

describe('Component Tests', () => {
  describe('CommentUser Management Update Component', () => {
    let comp: CommentUserUpdateComponent;
    let fixture: ComponentFixture<CommentUserUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commentUserService: CommentUserService;
    let commentService: CommentService;
    let patientService: PatientService;
    let doctorService: DoctorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentUserUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommentUserUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentUserUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commentUserService = TestBed.inject(CommentUserService);
      commentService = TestBed.inject(CommentService);
      patientService = TestBed.inject(PatientService);
      doctorService = TestBed.inject(DoctorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Comment query and add missing value', () => {
        const commentUser: ICommentUser = { id: 456 };
        const comment: IComment = { id: 17470 };
        commentUser.comment = comment;

        const commentCollection: IComment[] = [{ id: 20522 }];
        jest.spyOn(commentService, 'query').mockReturnValue(of(new HttpResponse({ body: commentCollection })));
        const additionalComments = [comment];
        const expectedCollection: IComment[] = [...additionalComments, ...commentCollection];
        jest.spyOn(commentService, 'addCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ commentUser });
        comp.ngOnInit();

        expect(commentService.query).toHaveBeenCalled();
        expect(commentService.addCommentToCollectionIfMissing).toHaveBeenCalledWith(commentCollection, ...additionalComments);
        expect(comp.commentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Patient query and add missing value', () => {
        const commentUser: ICommentUser = { id: 456 };
        const patient: IPatient = { id: 10394 };
        commentUser.patient = patient;

        const patientCollection: IPatient[] = [{ id: 34548 }];
        jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patient];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ commentUser });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Doctor query and add missing value', () => {
        const commentUser: ICommentUser = { id: 456 };
        const doctor: IDoctor = { id: 98526 };
        commentUser.doctor = doctor;

        const doctorCollection: IDoctor[] = [{ id: 75559 }];
        jest.spyOn(doctorService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorCollection })));
        const additionalDoctors = [doctor];
        const expectedCollection: IDoctor[] = [...additionalDoctors, ...doctorCollection];
        jest.spyOn(doctorService, 'addDoctorToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ commentUser });
        comp.ngOnInit();

        expect(doctorService.query).toHaveBeenCalled();
        expect(doctorService.addDoctorToCollectionIfMissing).toHaveBeenCalledWith(doctorCollection, ...additionalDoctors);
        expect(comp.doctorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const commentUser: ICommentUser = { id: 456 };
        const comment: IComment = { id: 93860 };
        commentUser.comment = comment;
        const patient: IPatient = { id: 82570 };
        commentUser.patient = patient;
        const doctor: IDoctor = { id: 35359 };
        commentUser.doctor = doctor;

        activatedRoute.data = of({ commentUser });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(commentUser));
        expect(comp.commentsSharedCollection).toContain(comment);
        expect(comp.patientsSharedCollection).toContain(patient);
        expect(comp.doctorsSharedCollection).toContain(doctor);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CommentUser>>();
        const commentUser = { id: 123 };
        jest.spyOn(commentUserService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ commentUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commentUser }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commentUserService.update).toHaveBeenCalledWith(commentUser);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CommentUser>>();
        const commentUser = new CommentUser();
        jest.spyOn(commentUserService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ commentUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commentUser }));
        saveSubject.complete();

        // THEN
        expect(commentUserService.create).toHaveBeenCalledWith(commentUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CommentUser>>();
        const commentUser = { id: 123 };
        jest.spyOn(commentUserService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ commentUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commentUserService.update).toHaveBeenCalledWith(commentUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCommentById', () => {
        it('Should return tracked Comment primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCommentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPatientById', () => {
        it('Should return tracked Patient primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPatientById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDoctorById', () => {
        it('Should return tracked Doctor primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDoctorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
