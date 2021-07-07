jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AppointmentService } from '../service/appointment.service';
import { IAppointment, Appointment } from '../appointment.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { DoctorService } from 'app/entities/doctor/service/doctor.service';

import { AppointmentUpdateComponent } from './appointment-update.component';

describe('Component Tests', () => {
  describe('Appointment Management Update Component', () => {
    let comp: AppointmentUpdateComponent;
    let fixture: ComponentFixture<AppointmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let appointmentService: AppointmentService;
    let patientService: PatientService;
    let doctorService: DoctorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AppointmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AppointmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AppointmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      appointmentService = TestBed.inject(AppointmentService);
      patientService = TestBed.inject(PatientService);
      doctorService = TestBed.inject(DoctorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Patient query and add missing value', () => {
        const appointment: IAppointment = { id: 456 };
        const patient: IPatient = { id: 94040 };
        appointment.patient = patient;

        const patientCollection: IPatient[] = [{ id: 58826 }];
        jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patient];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Doctor query and add missing value', () => {
        const appointment: IAppointment = { id: 456 };
        const doctor: IDoctor = { id: 77836 };
        appointment.doctor = doctor;

        const doctorCollection: IDoctor[] = [{ id: 40528 }];
        jest.spyOn(doctorService, 'query').mockReturnValue(of(new HttpResponse({ body: doctorCollection })));
        const additionalDoctors = [doctor];
        const expectedCollection: IDoctor[] = [...additionalDoctors, ...doctorCollection];
        jest.spyOn(doctorService, 'addDoctorToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        expect(doctorService.query).toHaveBeenCalled();
        expect(doctorService.addDoctorToCollectionIfMissing).toHaveBeenCalledWith(doctorCollection, ...additionalDoctors);
        expect(comp.doctorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const appointment: IAppointment = { id: 456 };
        const patient: IPatient = { id: 40838 };
        appointment.patient = patient;
        const doctor: IDoctor = { id: 98197 };
        appointment.doctor = doctor;

        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(appointment));
        expect(comp.patientsSharedCollection).toContain(patient);
        expect(comp.doctorsSharedCollection).toContain(doctor);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Appointment>>();
        const appointment = { id: 123 };
        jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appointment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(appointmentService.update).toHaveBeenCalledWith(appointment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Appointment>>();
        const appointment = new Appointment();
        jest.spyOn(appointmentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appointment }));
        saveSubject.complete();

        // THEN
        expect(appointmentService.create).toHaveBeenCalledWith(appointment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Appointment>>();
        const appointment = { id: 123 };
        jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(appointmentService.update).toHaveBeenCalledWith(appointment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
