import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DoctorService } from '../service/doctor.service';

import { DoctorComponent } from './doctor.component';

describe('Component Tests', () => {
  describe('Doctor Management Component', () => {
    let comp: DoctorComponent;
    let fixture: ComponentFixture<DoctorComponent>;
    let service: DoctorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DoctorComponent],
      })
        .overrideTemplate(DoctorComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DoctorComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(DoctorService);

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
      expect(comp.doctors?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
