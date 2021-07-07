jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';

import { AppointmentTreatmentAilmentDeleteDialogComponent } from './appointment-treatment-ailment-delete-dialog.component';

describe('Component Tests', () => {
  describe('AppointmentTreatmentAilment Management Delete Component', () => {
    let comp: AppointmentTreatmentAilmentDeleteDialogComponent;
    let fixture: ComponentFixture<AppointmentTreatmentAilmentDeleteDialogComponent>;
    let service: AppointmentTreatmentAilmentService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AppointmentTreatmentAilmentDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(AppointmentTreatmentAilmentDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AppointmentTreatmentAilmentDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AppointmentTreatmentAilmentService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({})));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        jest.spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
