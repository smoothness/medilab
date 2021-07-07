import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TreatmentService } from '../service/treatment.service';

import { TreatmentComponent } from './treatment.component';

describe('Component Tests', () => {
  describe('Treatment Management Component', () => {
    let comp: TreatmentComponent;
    let fixture: ComponentFixture<TreatmentComponent>;
    let service: TreatmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TreatmentComponent],
      })
        .overrideTemplate(TreatmentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TreatmentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TreatmentService);

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
      expect(comp.treatments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
