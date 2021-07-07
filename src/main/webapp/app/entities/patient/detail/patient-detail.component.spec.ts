import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PatientDetailComponent } from './patient-detail.component';

describe('Component Tests', () => {
  describe('Patient Management Detail Component', () => {
    let comp: PatientDetailComponent;
    let fixture: ComponentFixture<PatientDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PatientDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ patient: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PatientDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PatientDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load patient on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.patient).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
