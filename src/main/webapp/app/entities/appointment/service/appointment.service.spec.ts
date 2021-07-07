import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Status } from 'app/entities/enumerations/status.model';
import { IAppointment, Appointment } from '../appointment.model';

import { AppointmentService } from './appointment.service';

describe('Service Tests', () => {
  describe('Appointment Service', () => {
    let service: AppointmentService;
    let httpMock: HttpTestingController;
    let elemDefault: IAppointment;
    let expectedResult: IAppointment | IAppointment[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AppointmentService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        status: Status.CANCELED,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Appointment', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Appointment()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Appointment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Appointment', () => {
        const patchObject = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          new Appointment()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Appointment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_FORMAT),
            status: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Appointment', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAppointmentToCollectionIfMissing', () => {
        it('should add a Appointment to an empty array', () => {
          const appointment: IAppointment = { id: 123 };
          expectedResult = service.addAppointmentToCollectionIfMissing([], appointment);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(appointment);
        });

        it('should not add a Appointment to an array that contains it', () => {
          const appointment: IAppointment = { id: 123 };
          const appointmentCollection: IAppointment[] = [
            {
              ...appointment,
            },
            { id: 456 },
          ];
          expectedResult = service.addAppointmentToCollectionIfMissing(appointmentCollection, appointment);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Appointment to an array that doesn't contain it", () => {
          const appointment: IAppointment = { id: 123 };
          const appointmentCollection: IAppointment[] = [{ id: 456 }];
          expectedResult = service.addAppointmentToCollectionIfMissing(appointmentCollection, appointment);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(appointment);
        });

        it('should add only unique Appointment to an array', () => {
          const appointmentArray: IAppointment[] = [{ id: 123 }, { id: 456 }, { id: 98905 }];
          const appointmentCollection: IAppointment[] = [{ id: 123 }];
          expectedResult = service.addAppointmentToCollectionIfMissing(appointmentCollection, ...appointmentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const appointment: IAppointment = { id: 123 };
          const appointment2: IAppointment = { id: 456 };
          expectedResult = service.addAppointmentToCollectionIfMissing([], appointment, appointment2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(appointment);
          expect(expectedResult).toContain(appointment2);
        });

        it('should accept null and undefined values', () => {
          const appointment: IAppointment = { id: 123 };
          expectedResult = service.addAppointmentToCollectionIfMissing([], null, appointment, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(appointment);
        });

        it('should return initial array if no Appointment is added', () => {
          const appointmentCollection: IAppointment[] = [{ id: 123 }];
          expectedResult = service.addAppointmentToCollectionIfMissing(appointmentCollection, undefined, null);
          expect(expectedResult).toEqual(appointmentCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
