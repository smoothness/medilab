import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LineCommentDetailComponent } from './line-comment-detail.component';

describe('Component Tests', () => {
  describe('LineComment Management Detail Component', () => {
    let comp: LineCommentDetailComponent;
    let fixture: ComponentFixture<LineCommentDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LineCommentDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ lineComment: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LineCommentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LineCommentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load lineComment on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.lineComment).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
