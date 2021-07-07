import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppointmentTreatmentAilmentDetailComponent } from './appointment-treatment-ailment-detail.component';

describe('Component Tests', () => {
  describe('AppointmentTreatmentAilment Management Detail Component', () => {
    let comp: AppointmentTreatmentAilmentDetailComponent;
    let fixture: ComponentFixture<AppointmentTreatmentAilmentDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AppointmentTreatmentAilmentDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ appointmentTreatmentAilment: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AppointmentTreatmentAilmentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AppointmentTreatmentAilmentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load appointmentTreatmentAilment on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.appointmentTreatmentAilment).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
