import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BinnacleService } from '../service/binnacle.service';

import { BinnacleComponent } from './binnacle.component';

describe('Component Tests', () => {
  describe('Binnacle Management Component', () => {
    let comp: BinnacleComponent;
    let fixture: ComponentFixture<BinnacleComponent>;
    let service: BinnacleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BinnacleComponent],
      })
        .overrideTemplate(BinnacleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BinnacleComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BinnacleService);

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
      expect(comp.binnacles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
