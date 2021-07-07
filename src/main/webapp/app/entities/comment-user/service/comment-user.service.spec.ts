import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICommentUser, CommentUser } from '../comment-user.model';

import { CommentUserService } from './comment-user.service';

describe('Service Tests', () => {
  describe('CommentUser Service', () => {
    let service: CommentUserService;
    let httpMock: HttpTestingController;
    let elemDefault: ICommentUser;
    let expectedResult: ICommentUser | ICommentUser[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CommentUserService);
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

      it('should create a CommentUser', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new CommentUser()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CommentUser', () => {
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

      it('should partial update a CommentUser', () => {
        const patchObject = Object.assign({}, new CommentUser());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CommentUser', () => {
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

      it('should delete a CommentUser', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCommentUserToCollectionIfMissing', () => {
        it('should add a CommentUser to an empty array', () => {
          const commentUser: ICommentUser = { id: 123 };
          expectedResult = service.addCommentUserToCollectionIfMissing([], commentUser);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commentUser);
        });

        it('should not add a CommentUser to an array that contains it', () => {
          const commentUser: ICommentUser = { id: 123 };
          const commentUserCollection: ICommentUser[] = [
            {
              ...commentUser,
            },
            { id: 456 },
          ];
          expectedResult = service.addCommentUserToCollectionIfMissing(commentUserCollection, commentUser);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a CommentUser to an array that doesn't contain it", () => {
          const commentUser: ICommentUser = { id: 123 };
          const commentUserCollection: ICommentUser[] = [{ id: 456 }];
          expectedResult = service.addCommentUserToCollectionIfMissing(commentUserCollection, commentUser);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commentUser);
        });

        it('should add only unique CommentUser to an array', () => {
          const commentUserArray: ICommentUser[] = [{ id: 123 }, { id: 456 }, { id: 73197 }];
          const commentUserCollection: ICommentUser[] = [{ id: 123 }];
          expectedResult = service.addCommentUserToCollectionIfMissing(commentUserCollection, ...commentUserArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const commentUser: ICommentUser = { id: 123 };
          const commentUser2: ICommentUser = { id: 456 };
          expectedResult = service.addCommentUserToCollectionIfMissing([], commentUser, commentUser2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commentUser);
          expect(expectedResult).toContain(commentUser2);
        });

        it('should accept null and undefined values', () => {
          const commentUser: ICommentUser = { id: 123 };
          expectedResult = service.addCommentUserToCollectionIfMissing([], null, commentUser, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commentUser);
        });

        it('should return initial array if no CommentUser is added', () => {
          const commentUserCollection: ICommentUser[] = [{ id: 123 }];
          expectedResult = service.addCommentUserToCollectionIfMissing(commentUserCollection, undefined, null);
          expect(expectedResult).toEqual(commentUserCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
