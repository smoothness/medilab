import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RatingUserService } from '../service/rating-user.service';

import { RatingUserComponent } from './rating-user.component';

describe('Component Tests', () => {
  describe('RatingUser Management Component', () => {
    let comp: RatingUserComponent;
    let fixture: ComponentFixture<RatingUserComponent>;
    let service: RatingUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RatingUserComponent],
      })
        .overrideTemplate(RatingUserComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RatingUserComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RatingUserService);

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
      expect(comp.ratingUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
