import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CommentUserService } from '../service/comment-user.service';

import { CommentUserComponent } from './comment-user.component';

describe('Component Tests', () => {
  describe('CommentUser Management Component', () => {
    let comp: CommentUserComponent;
    let fixture: ComponentFixture<CommentUserComponent>;
    let service: CommentUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentUserComponent],
      })
        .overrideTemplate(CommentUserComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentUserComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CommentUserService);

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
      expect(comp.commentUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
