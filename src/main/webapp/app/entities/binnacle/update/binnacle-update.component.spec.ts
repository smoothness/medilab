jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BinnacleService } from '../service/binnacle.service';
import { IBinnacle, Binnacle } from '../binnacle.model';

import { BinnacleUpdateComponent } from './binnacle-update.component';

describe('Component Tests', () => {
  describe('Binnacle Management Update Component', () => {
    let comp: BinnacleUpdateComponent;
    let fixture: ComponentFixture<BinnacleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let binnacleService: BinnacleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BinnacleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BinnacleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BinnacleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      binnacleService = TestBed.inject(BinnacleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const binnacle: IBinnacle = { id: 456 };

        activatedRoute.data = of({ binnacle });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(binnacle));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Binnacle>>();
        const binnacle = { id: 123 };
        jest.spyOn(binnacleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ binnacle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: binnacle }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(binnacleService.update).toHaveBeenCalledWith(binnacle);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Binnacle>>();
        const binnacle = new Binnacle();
        jest.spyOn(binnacleService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ binnacle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: binnacle }));
        saveSubject.complete();

        // THEN
        expect(binnacleService.create).toHaveBeenCalledWith(binnacle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Binnacle>>();
        const binnacle = { id: 123 };
        jest.spyOn(binnacleService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ binnacle });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(binnacleService.update).toHaveBeenCalledWith(binnacle);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
