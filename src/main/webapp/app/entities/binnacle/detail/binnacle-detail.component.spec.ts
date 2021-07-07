import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BinnacleDetailComponent } from './binnacle-detail.component';

describe('Component Tests', () => {
  describe('Binnacle Management Detail Component', () => {
    let comp: BinnacleDetailComponent;
    let fixture: ComponentFixture<BinnacleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BinnacleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ binnacle: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BinnacleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BinnacleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load binnacle on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.binnacle).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
