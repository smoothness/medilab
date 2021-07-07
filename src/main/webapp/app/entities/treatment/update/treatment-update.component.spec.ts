jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TreatmentService } from '../service/treatment.service';
import { ITreatment, Treatment } from '../treatment.model';

import { TreatmentUpdateComponent } from './treatment-update.component';

describe('Component Tests', () => {
  describe('Treatment Management Update Component', () => {
    let comp: TreatmentUpdateComponent;
    let fixture: ComponentFixture<TreatmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let treatmentService: TreatmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TreatmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TreatmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TreatmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      treatmentService = TestBed.inject(TreatmentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const treatment: ITreatment = { id: 456 };

        activatedRoute.data = of({ treatment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(treatment));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Treatment>>();
        const treatment = { id: 123 };
        jest.spyOn(treatmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ treatment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: treatment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(treatmentService.update).toHaveBeenCalledWith(treatment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Treatment>>();
        const treatment = new Treatment();
        jest.spyOn(treatmentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ treatment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: treatment }));
        saveSubject.complete();

        // THEN
        expect(treatmentService.create).toHaveBeenCalledWith(treatment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Treatment>>();
        const treatment = { id: 123 };
        jest.spyOn(treatmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ treatment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(treatmentService.update).toHaveBeenCalledWith(treatment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
