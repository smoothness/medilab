import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';

import { AppointmentTreatmentAilmentComponent } from './appointment-treatment-ailment.component';

describe('Component Tests', () => {
  describe('AppointmentTreatmentAilment Management Component', () => {
    let comp: AppointmentTreatmentAilmentComponent;
    let fixture: ComponentFixture<AppointmentTreatmentAilmentComponent>;
    let service: AppointmentTreatmentAilmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AppointmentTreatmentAilmentComponent],
      })
        .overrideTemplate(AppointmentTreatmentAilmentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AppointmentTreatmentAilmentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AppointmentTreatmentAilmentService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.appointmentTreatmentAilments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
