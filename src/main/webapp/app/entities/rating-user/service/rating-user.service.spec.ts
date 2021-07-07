import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRatingUser, RatingUser } from '../rating-user.model';

import { RatingUserService } from './rating-user.service';

describe('Service Tests', () => {
  describe('RatingUser Service', () => {
    let service: RatingUserService;
    let httpMock: HttpTestingController;
    let elemDefault: IRatingUser;
    let expectedResult: IRatingUser | IRatingUser[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RatingUserService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
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

      it('should create a RatingUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new RatingUser()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a RatingUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a RatingUser', () => {
        const patchObject = Object.assign({}, new RatingUser());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of RatingUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
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

      it('should delete a RatingUser', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRatingUserToCollectionIfMissing', () => {
        it('should add a RatingUser to an empty array', () => {
          const ratingUser: IRatingUser = { id: 123 };
          expectedResult = service.addRatingUserToCollectionIfMissing([], ratingUser);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ratingUser);
        });

        it('should not add a RatingUser to an array that contains it', () => {
          const ratingUser: IRatingUser = { id: 123 };
          const ratingUserCollection: IRatingUser[] = [
            {
              ...ratingUser,
            },
            { id: 456 },
          ];
          expectedResult = service.addRatingUserToCollectionIfMissing(ratingUserCollection, ratingUser);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a RatingUser to an array that doesn't contain it", () => {
          const ratingUser: IRatingUser = { id: 123 };
          const ratingUserCollection: IRatingUser[] = [{ id: 456 }];
          expectedResult = service.addRatingUserToCollectionIfMissing(ratingUserCollection, ratingUser);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ratingUser);
        });

        it('should add only unique RatingUser to an array', () => {
          const ratingUserArray: IRatingUser[] = [{ id: 123 }, { id: 456 }, { id: 61874 }];
          const ratingUserCollection: IRatingUser[] = [{ id: 123 }];
          expectedResult = service.addRatingUserToCollectionIfMissing(ratingUserCollection, ...ratingUserArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ratingUser: IRatingUser = { id: 123 };
          const ratingUser2: IRatingUser = { id: 456 };
          expectedResult = service.addRatingUserToCollectionIfMissing([], ratingUser, ratingUser2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ratingUser);
          expect(expectedResult).toContain(ratingUser2);
        });

        it('should accept null and undefined values', () => {
          const ratingUser: IRatingUser = { id: 123 };
          expectedResult = service.addRatingUserToCollectionIfMissing([], null, ratingUser, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ratingUser);
        });

        it('should return initial array if no RatingUser is added', () => {
          const ratingUserCollection: IRatingUser[] = [{ id: 123 }];
          expectedResult = service.addRatingUserToCollectionIfMissing(ratingUserCollection, undefined, null);
          expect(expectedResult).toEqual(ratingUserCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
