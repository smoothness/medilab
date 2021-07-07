jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LineCommentService } from '../service/line-comment.service';
import { ILineComment, LineComment } from '../line-comment.model';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';

import { LineCommentUpdateComponent } from './line-comment-update.component';

describe('Component Tests', () => {
  describe('LineComment Management Update Component', () => {
    let comp: LineCommentUpdateComponent;
    let fixture: ComponentFixture<LineCommentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let lineCommentService: LineCommentService;
    let invoiceService: InvoiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LineCommentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LineCommentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LineCommentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      lineCommentService = TestBed.inject(LineCommentService);
      invoiceService = TestBed.inject(InvoiceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Invoice query and add missing value', () => {
        const lineComment: ILineComment = { id: 456 };
        const invoiceCode: IInvoice = { id: 96769 };
        lineComment.invoiceCode = invoiceCode;

        const invoiceCollection: IInvoice[] = [{ id: 26090 }];
        jest.spyOn(invoiceService, 'query').mockReturnValue(of(new HttpResponse({ body: invoiceCollection })));
        const additionalInvoices = [invoiceCode];
        const expectedCollection: IInvoice[] = [...additionalInvoices, ...invoiceCollection];
        jest.spyOn(invoiceService, 'addInvoiceToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ lineComment });
        comp.ngOnInit();

        expect(invoiceService.query).toHaveBeenCalled();
        expect(invoiceService.addInvoiceToCollectionIfMissing).toHaveBeenCalledWith(invoiceCollection, ...additionalInvoices);
        expect(comp.invoicesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const lineComment: ILineComment = { id: 456 };
        const invoiceCode: IInvoice = { id: 79457 };
        lineComment.invoiceCode = invoiceCode;

        activatedRoute.data = of({ lineComment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(lineComment));
        expect(comp.invoicesSharedCollection).toContain(invoiceCode);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LineComment>>();
        const lineComment = { id: 123 };
        jest.spyOn(lineCommentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ lineComment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: lineComment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(lineCommentService.update).toHaveBeenCalledWith(lineComment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LineComment>>();
        const lineComment = new LineComment();
        jest.spyOn(lineCommentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ lineComment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: lineComment }));
        saveSubject.complete();

        // THEN
        expect(lineCommentService.create).toHaveBeenCalledWith(lineComment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<LineComment>>();
        const lineComment = { id: 123 };
        jest.spyOn(lineCommentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ lineComment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(lineCommentService.update).toHaveBeenCalledWith(lineComment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackInvoiceById', () => {
        it('Should return tracked Invoice primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackInvoiceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
