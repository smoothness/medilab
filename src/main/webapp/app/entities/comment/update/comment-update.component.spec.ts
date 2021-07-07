jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommentService } from '../service/comment.service';
import { IComment, Comment } from '../comment.model';

import { CommentUpdateComponent } from './comment-update.component';

describe('Component Tests', () => {
  describe('Comment Management Update Component', () => {
    let comp: CommentUpdateComponent;
    let fixture: ComponentFixture<CommentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commentService: CommentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commentService = TestBed.inject(CommentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const comment: IComment = { id: 456 };

        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(comment));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = { id: 123 };
        jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commentService.update).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = new Comment();
        jest.spyOn(commentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comment }));
        saveSubject.complete();

        // THEN
        expect(commentService.create).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Comment>>();
        const comment = { id: 123 };
        jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ comment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commentService.update).toHaveBeenCalledWith(comment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
