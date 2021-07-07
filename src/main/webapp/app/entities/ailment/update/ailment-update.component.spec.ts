jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AilmentService } from '../service/ailment.service';
import { IAilment, Ailment } from '../ailment.model';

import { AilmentUpdateComponent } from './ailment-update.component';

describe('Component Tests', () => {
  describe('Ailment Management Update Component', () => {
    let comp: AilmentUpdateComponent;
    let fixture: ComponentFixture<AilmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ailmentService: AilmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AilmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AilmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AilmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ailmentService = TestBed.inject(AilmentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const ailment: IAilment = { id: 456 };

        activatedRoute.data = of({ ailment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ailment));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ailment>>();
        const ailment = { id: 123 };
        jest.spyOn(ailmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ailment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ailment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ailmentService.update).toHaveBeenCalledWith(ailment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ailment>>();
        const ailment = new Ailment();
        jest.spyOn(ailmentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ailment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ailment }));
        saveSubject.complete();

        // THEN
        expect(ailmentService.create).toHaveBeenCalledWith(ailment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Ailment>>();
        const ailment = { id: 123 };
        jest.spyOn(ailmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ ailment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ailmentService.update).toHaveBeenCalledWith(ailment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
