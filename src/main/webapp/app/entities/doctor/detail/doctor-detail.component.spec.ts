import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DoctorDetailComponent } from './doctor-detail.component';

describe('Component Tests', () => {
  describe('Doctor Management Detail Component', () => {
    let comp: DoctorDetailComponent;
    let fixture: ComponentFixture<DoctorDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DoctorDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ doctor: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DoctorDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DoctorDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load doctor on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.doctor).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
