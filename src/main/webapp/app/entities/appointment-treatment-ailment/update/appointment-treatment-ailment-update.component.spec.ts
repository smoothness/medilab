jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';
import { IAppointmentTreatmentAilment, AppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';
import { IAilment } from 'app/entities/ailment/ailment.model';
import { AilmentService } from 'app/entities/ailment/service/ailment.service';
import { ITreatment } from 'app/entities/treatment/treatment.model';
import { TreatmentService } from 'app/entities/treatment/service/treatment.service';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

import { AppointmentTreatmentAilmentUpdateComponent } from './appointment-treatment-ailment-update.component';

describe('Component Tests', () => {
  describe('AppointmentTreatmentAilment Management Update Component', () => {
    let comp: AppointmentTreatmentAilmentUpdateComponent;
    let fixture: ComponentFixture<AppointmentTreatmentAilmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService;
    let ailmentService: AilmentService;
    let treatmentService: TreatmentService;
    let appointmentService: AppointmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AppointmentTreatmentAilmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AppointmentTreatmentAilmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AppointmentTreatmentAilmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      appointmentTreatmentAilmentService = TestBed.inject(AppointmentTreatmentAilmentService);
      ailmentService = TestBed.inject(AilmentService);
      treatmentService = TestBed.inject(TreatmentService);
      appointmentService = TestBed.inject(AppointmentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Ailment query and add missing value', () => {
        const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 456 };
        const ailment: IAilment = { id: 77813 };
        appointmentTreatmentAilment.ailment = ailment;

        const ailmentCollection: IAilment[] = [{ id: 38907 }];
        jest.spyOn(ailmentService, 'query').mockReturnValue(of(new HttpResponse({ body: ailmentCollection })));
        const additionalAilments = [ailment];
        const expectedCollection: IAilment[] = [...additionalAilments, ...ailmentCollection];
        jest.spyOn(ailmentService, 'addAilmentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ appointmentTreatmentAilment });
        comp.ngOnInit();

        expect(ailmentService.query).toHaveBeenCalled();
        expect(ailmentService.addAilmentToCollectionIfMissing).toHaveBeenCalledWith(ailmentCollection, ...additionalAilments);
        expect(comp.ailmentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Treatment query and add missing value', () => {
        const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 456 };
        const treatment: ITreatment = { id: 4742 };
        appointmentTreatmentAilment.treatment = treatment;

        const treatmentCollection: ITreatment[] = [{ id: 67877 }];
        jest.spyOn(treatmentService, 'query').mockReturnValue(of(new HttpResponse({ body: treatmentCollection })));
        const additionalTreatments = [treatment];
        const expectedCollection: ITreatment[] = [...additionalTreatments, ...treatmentCollection];
        jest.spyOn(treatmentService, 'addTreatmentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ appointmentTreatmentAilment });
        comp.ngOnInit();

        expect(treatmentService.query).toHaveBeenCalled();
        expect(treatmentService.addTreatmentToCollectionIfMissing).toHaveBeenCalledWith(treatmentCollection, ...additionalTreatments);
        expect(comp.treatmentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Appointment query and add missing value', () => {
        const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 456 };
        const appointment: IAppointment = { id: 13612 };
        appointmentTreatmentAilment.appointment = appointment;

        const appointmentCollection: IAppointment[] = [{ id: 46809 }];
        jest.spyOn(appointmentService, 'query').mockReturnValue(of(new HttpResponse({ body: appointmentCollection })));
        const additionalAppointments = [appointment];
        const expectedCollection: IAppointment[] = [...additionalAppointments, ...appointmentCollection];
        jest.spyOn(appointmentService, 'addAppointmentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ appointmentTreatmentAilment });
        comp.ngOnInit();

        expect(appointmentService.query).toHaveBeenCalled();
        expect(appointmentService.addAppointmentToCollectionIfMissing).toHaveBeenCalledWith(
          appointmentCollection,
          ...additionalAppointments
        );
        expect(comp.appointmentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 456 };
        const ailment: IAilment = { id: 30482 };
        appointmentTreatmentAilment.ailment = ailment;
        const treatment: ITreatment = { id: 96761 };
        appointmentTreatmentAilment.treatment = treatment;
        const appointment: IAppointment = { id: 17939 };
        appointmentTreatmentAilment.appointment = appointment;

        activatedRoute.data = of({ appointmentTreatmentAilment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(appointmentTreatmentAilment));
        expect(comp.ailmentsSharedCollection).toContain(ailment);
        expect(comp.treatmentsSharedCollection).toContain(treatment);
        expect(comp.appointmentsSharedCollection).toContain(appointment);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AppointmentTreatmentAilment>>();
        const appointmentTreatmentAilment = { id: 123 };
        jest.spyOn(appointmentTreatmentAilmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointmentTreatmentAilment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appointmentTreatmentAilment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(appointmentTreatmentAilmentService.update).toHaveBeenCalledWith(appointmentTreatmentAilment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AppointmentTreatmentAilment>>();
        const appointmentTreatmentAilment = new AppointmentTreatmentAilment();
        jest.spyOn(appointmentTreatmentAilmentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointmentTreatmentAilment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appointmentTreatmentAilment }));
        saveSubject.complete();

        // THEN
        expect(appointmentTreatmentAilmentService.create).toHaveBeenCalledWith(appointmentTreatmentAilment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<AppointmentTreatmentAilment>>();
        const appointmentTreatmentAilment = { id: 123 };
        jest.spyOn(appointmentTreatmentAilmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointmentTreatmentAilment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(appointmentTreatmentAilmentService.update).toHaveBeenCalledWith(appointmentTreatmentAilment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAilmentById', () => {
        it('Should return tracked Ailment primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAilmentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackTreatmentById', () => {
        it('Should return tracked Treatment primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTreatmentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
