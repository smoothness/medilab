import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RatingUserDetailComponent } from './rating-user-detail.component';

describe('Component Tests', () => {
  describe('RatingUser Management Detail Component', () => {
    let comp: RatingUserDetailComponent;
    let fixture: ComponentFixture<RatingUserDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RatingUserDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ ratingUser: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RatingUserDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RatingUserDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load ratingUser on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.ratingUser).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
