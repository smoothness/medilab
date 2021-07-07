import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MedicalExamsService } from '../service/medical-exams.service';

import { MedicalExamsComponent } from './medical-exams.component';

describe('Component Tests', () => {
  describe('MedicalExams Management Component', () => {
    let comp: MedicalExamsComponent;
    let fixture: ComponentFixture<MedicalExamsComponent>;
    let service: MedicalExamsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedicalExamsComponent],
      })
        .overrideTemplate(MedicalExamsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedicalExamsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MedicalExamsService);

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
      expect(comp.medicalExams?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
