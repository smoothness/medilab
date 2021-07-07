import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PatientService } from '../service/patient.service';

import { PatientComponent } from './patient.component';

describe('Component Tests', () => {
  describe('Patient Management Component', () => {
    let comp: PatientComponent;
    let fixture: ComponentFixture<PatientComponent>;
    let service: PatientService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PatientComponent],
      })
        .overrideTemplate(PatientComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PatientComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PatientService);

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
      expect(comp.patients?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
