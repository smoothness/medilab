jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedicalExamsService } from '../service/medical-exams.service';
import { IMedicalExams, MedicalExams } from '../medical-exams.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

import { MedicalExamsUpdateComponent } from './medical-exams-update.component';

describe('Component Tests', () => {
  describe('MedicalExams Management Update Component', () => {
    let comp: MedicalExamsUpdateComponent;
    let fixture: ComponentFixture<MedicalExamsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medicalExamsService: MedicalExamsService;
    let appointmentService: AppointmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedicalExamsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MedicalExamsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedicalExamsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      medicalExamsService = TestBed.inject(MedicalExamsService);
      appointmentService = TestBed.inject(AppointmentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Appointment query and add missing value', () => {
        const medicalExams: IMedicalExams = { id: 456 };
        const appointment: IAppointment = { id: 21093 };
        medicalExams.appointment = appointment;

        const appointmentCollection: IAppointment[] = [{ id: 87349 }];
        jest.spyOn(appointmentService, 'query').mockReturnValue(of(new HttpResponse({ body: appointmentCollection })));
        const additionalAppointments = [appointment];
        const expectedCollection: IAppointment[] = [...additionalAppointments, ...appointmentCollection];
        jest.spyOn(appointmentService, 'addAppointmentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ medicalExams });
        comp.ngOnInit();

        expect(appointmentService.query).toHaveBeenCalled();
        expect(appointmentService.addAppointmentToCollectionIfMissing).toHaveBeenCalledWith(
          appointmentCollection,
          ...additionalAppointments
        );
        expect(comp.appointmentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const medicalExams: IMedicalExams = { id: 456 };
        const appointment: IAppointment = { id: 9596 };
        medicalExams.appointment = appointment;

        activatedRoute.data = of({ medicalExams });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medicalExams));
        expect(comp.appointmentsSharedCollection).toContain(appointment);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<MedicalExams>>();
        const medicalExams = { id: 123 };
        jest.spyOn(medicalExamsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medicalExams });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medicalExams }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(medicalExamsService.update).toHaveBeenCalledWith(medicalExams);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<MedicalExams>>();
        const medicalExams = new MedicalExams();
        jest.spyOn(medicalExamsService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medicalExams });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medicalExams }));
        saveSubject.complete();

        // THEN
        expect(medicalExamsService.create).toHaveBeenCalledWith(medicalExams);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<MedicalExams>>();
        const medicalExams = { id: 123 };
        jest.spyOn(medicalExamsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medicalExams });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(medicalExamsService.update).toHaveBeenCalledWith(medicalExams);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAppointmentById', () => {
        it('Should return tracked Appointment primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAppointmentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
