import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LineCommentService } from '../service/line-comment.service';

import { LineCommentComponent } from './line-comment.component';

describe('Component Tests', () => {
  describe('LineComment Management Component', () => {
    let comp: LineCommentComponent;
    let fixture: ComponentFixture<LineCommentComponent>;
    let service: LineCommentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LineCommentComponent],
      })
        .overrideTemplate(LineCommentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LineCommentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LineCommentService);

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
      expect(comp.lineComments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
