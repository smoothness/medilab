import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRating, Rating } from '../rating.model';

import { RatingService } from './rating.service';

describe('Service Tests', () => {
  describe('Rating Service', () => {
    let service: RatingService;
    let httpMock: HttpTestingController;
    let elemDefault: IRating;
    let expectedResult: IRating | IRating[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RatingService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        value: 0,
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

      it('should create a Rating', () => {
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

        service.create(new Rating()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Rating', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            value: 1,
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

      it('should partial update a Rating', () => {
        const patchObject = Object.assign(
          {
            date: currentDate.format(DATE_FORMAT),
          },
          new Rating()
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

      it('should return a list of Rating', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            value: 1,
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

      it('should delete a Rating', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRatingToCollectionIfMissing', () => {
        it('should add a Rating to an empty array', () => {
          const rating: IRating = { id: 123 };
          expectedResult = service.addRatingToCollectionIfMissing([], rating);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rating);
        });

        it('should not add a Rating to an array that contains it', () => {
          const rating: IRating = { id: 123 };
          const ratingCollection: IRating[] = [
            {
              ...rating,
            },
            { id: 456 },
          ];
          expectedResult = service.addRatingToCollectionIfMissing(ratingCollection, rating);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Rating to an array that doesn't contain it", () => {
          const rating: IRating = { id: 123 };
          const ratingCollection: IRating[] = [{ id: 456 }];
          expectedResult = service.addRatingToCollectionIfMissing(ratingCollection, rating);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rating);
        });

        it('should add only unique Rating to an array', () => {
          const ratingArray: IRating[] = [{ id: 123 }, { id: 456 }, { id: 3758 }];
          const ratingCollection: IRating[] = [{ id: 123 }];
          expectedResult = service.addRatingToCollectionIfMissing(ratingCollection, ...ratingArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const rating: IRating = { id: 123 };
          const rating2: IRating = { id: 456 };
          expectedResult = service.addRatingToCollectionIfMissing([], rating, rating2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(rating);
          expect(expectedResult).toContain(rating2);
        });

        it('should accept null and undefined values', () => {
          const rating: IRating = { id: 123 };
          expectedResult = service.addRatingToCollectionIfMissing([], null, rating, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(rating);
        });

        it('should return initial array if no Rating is added', () => {
          const ratingCollection: IRating[] = [{ id: 123 }];
          expectedResult = service.addRatingToCollectionIfMissing(ratingCollection, undefined, null);
          expect(expectedResult).toEqual(ratingCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
