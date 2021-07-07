import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AilmentDetailComponent } from './ailment-detail.component';

describe('Component Tests', () => {
  describe('Ailment Management Detail Component', () => {
    let comp: AilmentDetailComponent;
    let fixture: ComponentFixture<AilmentDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AilmentDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ ailment: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AilmentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AilmentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load ailment on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.ailment).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
