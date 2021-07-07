import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppointmentTreatmentAilment, AppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';

import { AppointmentTreatmentAilmentService } from './appointment-treatment-ailment.service';

describe('Service Tests', () => {
  describe('AppointmentTreatmentAilment Service', () => {
    let service: AppointmentTreatmentAilmentService;
    let httpMock: HttpTestingController;
    let elemDefault: IAppointmentTreatmentAilment;
    let expectedResult: IAppointmentTreatmentAilment | IAppointmentTreatmentAilment[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AppointmentTreatmentAilmentService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        description: 'AAAAAAA',
        removed: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a AppointmentTreatmentAilment', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new AppointmentTreatmentAilment()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AppointmentTreatmentAilment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
            removed: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a AppointmentTreatmentAilment', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
            removed: true,
          },
          new AppointmentTreatmentAilment()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AppointmentTreatmentAilment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
            removed: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a AppointmentTreatmentAilment', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAppointmentTreatmentAilmentToCollectionIfMissing', () => {
        it('should add a AppointmentTreatmentAilment to an empty array', () => {
          const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 123 };
          expectedResult = service.addAppointmentTreatmentAilmentToCollectionIfMissing([], appointmentTreatmentAilment);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(appointmentTreatmentAilment);
        });

        it('should not add a AppointmentTreatmentAilment to an array that contains it', () => {
          const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 123 };
          const appointmentTreatmentAilmentCollection: IAppointmentTreatmentAilment[] = [
            {
              ...appointmentTreatmentAilment,
            },
            { id: 456 },
          ];
          expectedResult = service.addAppointmentTreatmentAilmentToCollectionIfMissing(
            appointmentTreatmentAilmentCollection,
            appointmentTreatmentAilment
          );
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AppointmentTreatmentAilment to an array that doesn't contain it", () => {
          const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 123 };
          const appointmentTreatmentAilmentCollection: IAppointmentTreatmentAilment[] = [{ id: 456 }];
          expectedResult = service.addAppointmentTreatmentAilmentToCollectionIfMissing(
            appointmentTreatmentAilmentCollection,
            appointmentTreatmentAilment
          );
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(appointmentTreatmentAilment);
        });

        it('should add only unique AppointmentTreatmentAilment to an array', () => {
          const appointmentTreatmentAilmentArray: IAppointmentTreatmentAilment[] = [{ id: 123 }, { id: 456 }, { id: 33701 }];
          const appointmentTreatmentAilmentCollection: IAppointmentTreatmentAilment[] = [{ id: 123 }];
          expectedResult = service.addAppointmentTreatmentAilmentToCollectionIfMissing(
            appointmentTreatmentAilmentCollection,
            ...appointmentTreatmentAilmentArray
          );
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 123 };
          const appointmentTreatmentAilment2: IAppointmentTreatmentAilment = { id: 456 };
          expectedResult = service.addAppointmentTreatmentAilmentToCollectionIfMissing(
            [],
            appointmentTreatmentAilment,
            appointmentTreatmentAilment2
          );
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(appointmentTreatmentAilment);
          expect(expectedResult).toContain(appointmentTreatmentAilment2);
        });

        it('should accept null and undefined values', () => {
          const appointmentTreatmentAilment: IAppointmentTreatmentAilment = { id: 123 };
          expectedResult = service.addAppointmentTreatmentAilmentToCollectionIfMissing([], null, appointmentTreatmentAilment, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(appointmentTreatmentAilment);
        });

        it('should return initial array if no AppointmentTreatmentAilment is added', () => {
          const appointmentTreatmentAilmentCollection: IAppointmentTreatmentAilment[] = [{ id: 123 }];
          expectedResult = service.addAppointmentTreatmentAilmentToCollectionIfMissing(
            appointmentTreatmentAilmentCollection,
            undefined,
            null
          );
          expect(expectedResult).toEqual(appointmentTreatmentAilmentCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
