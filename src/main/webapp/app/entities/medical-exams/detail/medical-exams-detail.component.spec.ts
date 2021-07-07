import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MedicalExamsDetailComponent } from './medical-exams-detail.component';

describe('Component Tests', () => {
  describe('MedicalExams Management Detail Component', () => {
    let comp: MedicalExamsDetailComponent;
    let fixture: ComponentFixture<MedicalExamsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MedicalExamsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ medicalExams: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MedicalExamsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MedicalExamsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load medicalExams on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.medicalExams).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
