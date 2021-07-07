import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAilment, Ailment } from '../ailment.model';

import { AilmentService } from './ailment.service';

describe('Service Tests', () => {
  describe('Ailment Service', () => {
    let service: AilmentService;
    let httpMock: HttpTestingController;
    let elemDefault: IAilment;
    let expectedResult: IAilment | IAilment[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AilmentService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a Ailment', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Ailment()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ailment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should partial update a Ailment', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            removed: true,
          },
          new Ailment()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ailment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a Ailment', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAilmentToCollectionIfMissing', () => {
        it('should add a Ailment to an empty array', () => {
          const ailment: IAilment = { id: 123 };
          expectedResult = service.addAilmentToCollectionIfMissing([], ailment);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ailment);
        });

        it('should not add a Ailment to an array that contains it', () => {
          const ailment: IAilment = { id: 123 };
          const ailmentCollection: IAilment[] = [
            {
              ...ailment,
            },
            { id: 456 },
          ];
          expectedResult = service.addAilmentToCollectionIfMissing(ailmentCollection, ailment);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Ailment to an array that doesn't contain it", () => {
          const ailment: IAilment = { id: 123 };
          const ailmentCollection: IAilment[] = [{ id: 456 }];
          expectedResult = service.addAilmentToCollectionIfMissing(ailmentCollection, ailment);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ailment);
        });

        it('should add only unique Ailment to an array', () => {
          const ailmentArray: IAilment[] = [{ id: 123 }, { id: 456 }, { id: 18412 }];
          const ailmentCollection: IAilment[] = [{ id: 123 }];
          expectedResult = service.addAilmentToCollectionIfMissing(ailmentCollection, ...ailmentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ailment: IAilment = { id: 123 };
          const ailment2: IAilment = { id: 456 };
          expectedResult = service.addAilmentToCollectionIfMissing([], ailment, ailment2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ailment);
          expect(expectedResult).toContain(ailment2);
        });

        it('should accept null and undefined values', () => {
          const ailment: IAilment = { id: 123 };
          expectedResult = service.addAilmentToCollectionIfMissing([], null, ailment, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ailment);
        });

        it('should return initial array if no Ailment is added', () => {
          const ailmentCollection: IAilment[] = [{ id: 123 }];
          expectedResult = service.addAilmentToCollectionIfMissing(ailmentCollection, undefined, null);
          expect(expectedResult).toEqual(ailmentCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
