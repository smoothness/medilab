jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RatingUserService } from '../service/rating-user.service';
import { IRatingUser, RatingUser } from '../rating-user.model';
import { IRating } from 'app/entities/rating/rating.model';
import { RatingService } from 'app/entities/rating/service/rating.service';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

import { RatingUserUpdateComponent } from './rating-user-update.component';

describe('Component Tests', () => {
  describe('RatingUser Management Update Component', () => {
    let comp: RatingUserUpdateComponent;
    let fixture: ComponentFixture<RatingUserUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ratingUserService: RatingUserService;
    let ratingService: RatingService;
    let patientService: PatientService;
    let doctorService: DoctorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RatingUserUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RatingUserUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RatingUserUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ratingUserService = TestBed.inject(RatingUserService);
      ratingService = TestBed.inject(RatingService);
      patientService = TestBed.inject(PatientService);
      doctorService = TestBed.inject(DoctorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Rating query and add missing value', () => {
        const ratingUser: IRatingUser = { id: 456 };
        const rating: IRating = { id: 90247 };
        ratingUser.rating = rating;

        const ratingCollection: IRating[] = [{ id: 43080 }];
        jest.spyOn(ratingService, 'query').mockReturnValue(of(new HttpResponse({ body: ratingCollection })));
        const additionalRatings = [rating];
        const expectedCollection: IRating[] = [...additionalRatings, ...ratingCollection];
        jest.spyOn(ratingService, 'addRatingToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ ratingUser });
        comp.ngOnInit();

        expect(ratingService.query).toHaveBeenCalled();
        expect(ratingService.addRatingToCollectionIfMissing).toHaveBeenCalledWith(ratingCollection, ...additionalRatings);
        expect(comp.ratingsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Patient query and add missing value', () => {
        const ratingUser: IRatingUser = { id: 456 };
        const patient: IPatient = { id: 29482 };
        ratingUser.patient = patient;

        const patientCollection: IPatient[] = [{ id: 59070 }];
        jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patient];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ ratingUser });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Doctor query and add missing value', () => {
        const ratingUser: IRatingUser = { id: 456 };
        const doctor: IDoctor = { id: 41697 };
        ratingUser.doctor = doctor;

        const doctorCollection: IDoctor[] = [{ id: 45763 }];
        jest.spyOn(doctorService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorCollection })));
        const additionalDoctors = [doctor];
        const expectedCollection: IDoctor[] = [...additionalDoctors, ...doctorCollection];
        jest.spyOn(doctorService, 'addDoctorToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ ratingUser });
        comp.ngOnInit();

        expect(doctorService.query).toHaveBeenCalled();
        expect(doctorService.addDoctorToCollectionIfMissing).toHaveBeenCalledWith(doctorCollection, ...additionalDoctors);
        expect(comp.doctorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const ratingUser: IRatingUser = { id: 456 };
        const rating: IRating = { id: 42461 };
        ratingUser.rating = rating;
        const patient: IPatient = { id: 69214 };
        ratingUser.patient = patient;
        const doctor: IDoctor = { id: 83993 };
        ratingUser.doctor = doctor;

        activatedRoute.data = of({ ratingUser });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ratingUser));
        expect(comp.ratingsSharedCollection).toContain(rating);
        expect(comp.patientsSharedCollection).toContain(patient);
        expect(comp.doctorsSharedCollection).toContain(doctor);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RatingUser>>();
        const ratingUser = { id: 123 };
        jest.spyOn(ratingUserService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ratingUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ratingUser }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ratingUserService.update).toHaveBeenCalledWith(ratingUser);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RatingUser>>();
        const ratingUser = new RatingUser();
        jest.spyOn(ratingUserService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ratingUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ratingUser }));
        saveSubject.complete();

        // THEN
        expect(ratingUserService.create).toHaveBeenCalledWith(ratingUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<RatingUser>>();
        const ratingUser = { id: 123 };
        jest.spyOn(ratingUserService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ratingUser });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ratingUserService.update).toHaveBeenCalledWith(ratingUser);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRatingById', () => {
        it('Should return tracked Rating primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRatingById(0, entity);
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
