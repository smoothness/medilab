import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AilmentService } from '../service/ailment.service';

import { AilmentComponent } from './ailment.component';

describe('Component Tests', () => {
  describe('Ailment Management Component', () => {
    let comp: AilmentComponent;
    let fixture: ComponentFixture<AilmentComponent>;
    let service: AilmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AilmentComponent],
      })
        .overrideTemplate(AilmentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AilmentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AilmentService);

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
      expect(comp.ailments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
