import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBinnacle, Binnacle } from '../binnacle.model';

import { BinnacleService } from './binnacle.service';

describe('Service Tests', () => {
  describe('Binnacle Service', () => {
    let service: BinnacleService;
    let httpMock: HttpTestingController;
    let elemDefault: IBinnacle;
    let expectedResult: IBinnacle | IBinnacle[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BinnacleService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        doctorCode: 'AAAAAAA',
        date: currentDate,
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

      it('should create a Binnacle', () => {
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

        service.create(new Binnacle()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Binnacle', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            doctorCode: 'BBBBBB',
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

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Binnacle', () => {
        const patchObject = Object.assign(
          {
            doctorCode: 'BBBBBB',
          },
          new Binnacle()
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

      it('should return a list of Binnacle', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            doctorCode: 'BBBBBB',
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

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Binnacle', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBinnacleToCollectionIfMissing', () => {
        it('should add a Binnacle to an empty array', () => {
          const binnacle: IBinnacle = { id: 123 };
          expectedResult = service.addBinnacleToCollectionIfMissing([], binnacle);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(binnacle);
        });

        it('should not add a Binnacle to an array that contains it', () => {
          const binnacle: IBinnacle = { id: 123 };
          const binnacleCollection: IBinnacle[] = [
            {
              ...binnacle,
            },
            { id: 456 },
          ];
          expectedResult = service.addBinnacleToCollectionIfMissing(binnacleCollection, binnacle);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Binnacle to an array that doesn't contain it", () => {
          const binnacle: IBinnacle = { id: 123 };
          const binnacleCollection: IBinnacle[] = [{ id: 456 }];
          expectedResult = service.addBinnacleToCollectionIfMissing(binnacleCollection, binnacle);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(binnacle);
        });

        it('should add only unique Binnacle to an array', () => {
          const binnacleArray: IBinnacle[] = [{ id: 123 }, { id: 456 }, { id: 81448 }];
          const binnacleCollection: IBinnacle[] = [{ id: 123 }];
          expectedResult = service.addBinnacleToCollectionIfMissing(binnacleCollection, ...binnacleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const binnacle: IBinnacle = { id: 123 };
          const binnacle2: IBinnacle = { id: 456 };
          expectedResult = service.addBinnacleToCollectionIfMissing([], binnacle, binnacle2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(binnacle);
          expect(expectedResult).toContain(binnacle2);
        });

        it('should accept null and undefined values', () => {
          const binnacle: IBinnacle = { id: 123 };
          expectedResult = service.addBinnacleToCollectionIfMissing([], null, binnacle, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(binnacle);
        });

        it('should return initial array if no Binnacle is added', () => {
          const binnacleCollection: IBinnacle[] = [{ id: 123 }];
          expectedResult = service.addBinnacleToCollectionIfMissing(binnacleCollection, undefined, null);
          expect(expectedResult).toEqual(binnacleCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
