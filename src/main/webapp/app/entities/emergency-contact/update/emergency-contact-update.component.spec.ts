jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmergencyContactService } from '../service/emergency-contact.service';
import { IEmergencyContact, EmergencyContact } from '../emergency-contact.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { PatientService } from 'app/entities/patient/service/patient.service';

import { EmergencyContactUpdateComponent } from './emergency-contact-update.component';

describe('Component Tests', () => {
  describe('EmergencyContact Management Update Component', () => {
    let comp: EmergencyContactUpdateComponent;
    let fixture: ComponentFixture<EmergencyContactUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let emergencyContactService: EmergencyContactService;
    let patientService: PatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmergencyContactUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmergencyContactUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmergencyContactUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      emergencyContactService = TestBed.inject(EmergencyContactService);
      patientService = TestBed.inject(PatientService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Patient query and add missing value', () => {
        const emergencyContact: IEmergencyContact = { id: 456 };
        const patient: IPatient = { id: 30493 };
        emergencyContact.patient = patient;

        const patientCollection: IPatient[] = [{ id: 55697 }];
        jest.spyOn(patientService, 'query').mockReturnValue(of(new HttpResponse({ body: patientCollection })));
        const additionalPatients = [patient];
        const expectedCollection: IPatient[] = [...additionalPatients, ...patientCollection];
        jest.spyOn(patientService, 'addPatientToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ emergencyContact });
        comp.ngOnInit();

        expect(patientService.query).toHaveBeenCalled();
        expect(patientService.addPatientToCollectionIfMissing).toHaveBeenCalledWith(patientCollection, ...additionalPatients);
        expect(comp.patientsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const emergencyContact: IEmergencyContact = { id: 456 };
        const patient: IPatient = { id: 39003 };
        emergencyContact.patient = patient;

        activatedRoute.data = of({ emergencyContact });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(emergencyContact));
        expect(comp.patientsSharedCollection).toContain(patient);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<EmergencyContact>>();
        const emergencyContact = { id: 123 };
        jest.spyOn(emergencyContactService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ emergencyContact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: emergencyContact }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(emergencyContactService.update).toHaveBeenCalledWith(emergencyContact);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<EmergencyContact>>();
        const emergencyContact = new EmergencyContact();
        jest.spyOn(emergencyContactService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ emergencyContact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: emergencyContact }));
        saveSubject.complete();

        // THEN
        expect(emergencyContactService.create).toHaveBeenCalledWith(emergencyContact);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<EmergencyContact>>();
        const emergencyContact = { id: 123 };
        jest.spyOn(emergencyContactService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ emergencyContact });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(emergencyContactService.update).toHaveBeenCalledWith(emergencyContact);
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
    });
  });
});
