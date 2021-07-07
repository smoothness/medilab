import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommentUserDetailComponent } from './comment-user-detail.component';

describe('Component Tests', () => {
  describe('CommentUser Management Detail Component', () => {
    let comp: CommentUserDetailComponent;
    let fixture: ComponentFixture<CommentUserDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CommentUserDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ commentUser: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CommentUserDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CommentUserDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load commentUser on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.commentUser).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
