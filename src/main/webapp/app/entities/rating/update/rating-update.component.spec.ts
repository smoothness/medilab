jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RatingService } from '../service/rating.service';
import { IRating, Rating } from '../rating.model';

import { RatingUpdateComponent } from './rating-update.component';

describe('Component Tests', () => {
  describe('Rating Management Update Component', () => {
    let comp: RatingUpdateComponent;
    let fixture: ComponentFixture<RatingUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ratingService: RatingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RatingUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RatingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RatingUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ratingService = TestBed.inject(RatingService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const rating: IRating = { id: 456 };

        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(rating));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Rating>>();
        const rating = { id: 123 };
        jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rating }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ratingService.update).toHaveBeenCalledWith(rating);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Rating>>();
        const rating = new Rating();
        jest.spyOn(ratingService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: rating }));
        saveSubject.complete();

        // THEN
        expect(ratingService.create).toHaveBeenCalledWith(rating);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Rating>>();
        const rating = { id: 123 };
        jest.spyOn(ratingService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ rating });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ratingService.update).toHaveBeenCalledWith(rating);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
