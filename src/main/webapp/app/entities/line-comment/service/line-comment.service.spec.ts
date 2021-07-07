import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILineComment, LineComment } from '../line-comment.model';

import { LineCommentService } from './line-comment.service';

describe('Service Tests', () => {
  describe('LineComment Service', () => {
    let service: LineCommentService;
    let httpMock: HttpTestingController;
    let elemDefault: ILineComment;
    let expectedResult: ILineComment | ILineComment[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LineCommentService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        description: 'AAAAAAA',
        quantity: 0,
        unitPrice: 0,
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

      it('should create a LineComment', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new LineComment()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a LineComment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
            quantity: 1,
            unitPrice: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a LineComment', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
            quantity: 1,
          },
          new LineComment()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of LineComment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            description: 'BBBBBB',
            quantity: 1,
            unitPrice: 1,
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

      it('should delete a LineComment', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLineCommentToCollectionIfMissing', () => {
        it('should add a LineComment to an empty array', () => {
          const lineComment: ILineComment = { id: 123 };
          expectedResult = service.addLineCommentToCollectionIfMissing([], lineComment);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lineComment);
        });

        it('should not add a LineComment to an array that contains it', () => {
          const lineComment: ILineComment = { id: 123 };
          const lineCommentCollection: ILineComment[] = [
            {
              ...lineComment,
            },
            { id: 456 },
          ];
          expectedResult = service.addLineCommentToCollectionIfMissing(lineCommentCollection, lineComment);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a LineComment to an array that doesn't contain it", () => {
          const lineComment: ILineComment = { id: 123 };
          const lineCommentCollection: ILineComment[] = [{ id: 456 }];
          expectedResult = service.addLineCommentToCollectionIfMissing(lineCommentCollection, lineComment);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lineComment);
        });

        it('should add only unique LineComment to an array', () => {
          const lineCommentArray: ILineComment[] = [{ id: 123 }, { id: 456 }, { id: 64179 }];
          const lineCommentCollection: ILineComment[] = [{ id: 123 }];
          expectedResult = service.addLineCommentToCollectionIfMissing(lineCommentCollection, ...lineCommentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const lineComment: ILineComment = { id: 123 };
          const lineComment2: ILineComment = { id: 456 };
          expectedResult = service.addLineCommentToCollectionIfMissing([], lineComment, lineComment2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(lineComment);
          expect(expectedResult).toContain(lineComment2);
        });

        it('should accept null and undefined values', () => {
          const lineComment: ILineComment = { id: 123 };
          expectedResult = service.addLineCommentToCollectionIfMissing([], null, lineComment, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(lineComment);
        });

        it('should return initial array if no LineComment is added', () => {
          const lineCommentCollection: ILineComment[] = [{ id: 123 }];
          expectedResult = service.addLineCommentToCollectionIfMissing(lineCommentCollection, undefined, null);
          expect(expectedResult).toEqual(lineCommentCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
