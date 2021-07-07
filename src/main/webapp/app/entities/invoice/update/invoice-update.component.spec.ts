jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InvoiceService } from '../service/invoice.service';
import { IInvoice, Invoice } from '../invoice.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';
import { AppointmentService } from 'app/entities/appointment/service/appointment.service';

import { InvoiceUpdateComponent } from './invoice-update.component';

describe('Component Tests', () => {
  describe('Invoice Management Update Component', () => {
    let comp: InvoiceUpdateComponent;
    let fixture: ComponentFixture<InvoiceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let invoiceService: InvoiceService;
    let appointmentService: AppointmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InvoiceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InvoiceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InvoiceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      invoiceService = TestBed.inject(InvoiceService);
      appointmentService = TestBed.inject(AppointmentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call appointment query and add missing value', () => {
        const invoice: IInvoice = { id: 456 };
        const appointment: IAppointment = { id: 78357 };
        invoice.appointment = appointment;

        const appointmentCollection: IAppointment[] = [{ id: 55668 }];
        jest.spyOn(appointmentService, 'query').mockReturnValue(of(new HttpResponse({ body: appointmentCollection })));
        const expectedCollection: IAppointment[] = [appointment, ...appointmentCollection];
        jest.spyOn(appointmentService, 'addAppointmentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        expect(appointmentService.query).toHaveBeenCalled();
        expect(appointmentService.addAppointmentToCollectionIfMissing).toHaveBeenCalledWith(appointmentCollection, appointment);
        expect(comp.appointmentsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const invoice: IInvoice = { id: 456 };
        const appointment: IAppointment = { id: 71515 };
        invoice.appointment = appointment;

        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(invoice));
        expect(comp.appointmentsCollection).toContain(appointment);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Invoice>>();
        const invoice = { id: 123 };
        jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: invoice }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(invoiceService.update).toHaveBeenCalledWith(invoice);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Invoice>>();
        const invoice = new Invoice();
        jest.spyOn(invoiceService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: invoice }));
        saveSubject.complete();

        // THEN
        expect(invoiceService.create).toHaveBeenCalledWith(invoice);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Invoice>>();
        const invoice = { id: 123 };
        jest.spyOn(invoiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ invoice });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(invoiceService.update).toHaveBeenCalledWith(invoice);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAppointmentById', () => {
        it('Should return tracked Appointment primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAppointmentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
