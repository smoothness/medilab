import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RatingDetailComponent } from './rating-detail.component';

describe('Component Tests', () => {
  describe('Rating Management Detail Component', () => {
    let comp: RatingDetailComponent;
    let fixture: ComponentFixture<RatingDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RatingDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ rating: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RatingDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RatingDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load rating on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.rating).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
