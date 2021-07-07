import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITreatment, Treatment } from '../treatment.model';

import { TreatmentService } from './treatment.service';

describe('Service Tests', () => {
  describe('Treatment Service', () => {
    let service: TreatmentService;
    let httpMock: HttpTestingController;
    let elemDefault: ITreatment;
    let expectedResult: ITreatment | ITreatment[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TreatmentService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        specifications: 'AAAAAAA',
        medicines: 'AAAAAAA',
        duration: 'AAAAAAA',
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

      it('should create a Treatment', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Treatment()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Treatment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            specifications: 'BBBBBB',
            medicines: 'BBBBBB',
            duration: 'BBBBBB',
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

      it('should partial update a Treatment', () => {
        const patchObject = Object.assign(
          {
            specifications: 'BBBBBB',
            duration: 'BBBBBB',
            removed: true,
          },
          new Treatment()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Treatment', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            specifications: 'BBBBBB',
            medicines: 'BBBBBB',
            duration: 'BBBBBB',
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

      it('should delete a Treatment', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTreatmentToCollectionIfMissing', () => {
        it('should add a Treatment to an empty array', () => {
          const treatment: ITreatment = { id: 123 };
          expectedResult = service.addTreatmentToCollectionIfMissing([], treatment);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(treatment);
        });

        it('should not add a Treatment to an array that contains it', () => {
          const treatment: ITreatment = { id: 123 };
          const treatmentCollection: ITreatment[] = [
            {
              ...treatment,
            },
            { id: 456 },
          ];
          expectedResult = service.addTreatmentToCollectionIfMissing(treatmentCollection, treatment);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Treatment to an array that doesn't contain it", () => {
          const treatment: ITreatment = { id: 123 };
          const treatmentCollection: ITreatment[] = [{ id: 456 }];
          expectedResult = service.addTreatmentToCollectionIfMissing(treatmentCollection, treatment);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(treatment);
        });

        it('should add only unique Treatment to an array', () => {
          const treatmentArray: ITreatment[] = [{ id: 123 }, { id: 456 }, { id: 8442 }];
          const treatmentCollection: ITreatment[] = [{ id: 123 }];
          expectedResult = service.addTreatmentToCollectionIfMissing(treatmentCollection, ...treatmentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const treatment: ITreatment = { id: 123 };
          const treatment2: ITreatment = { id: 456 };
          expectedResult = service.addTreatmentToCollectionIfMissing([], treatment, treatment2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(treatment);
          expect(expectedResult).toContain(treatment2);
        });

        it('should accept null and undefined values', () => {
          const treatment: ITreatment = { id: 123 };
          expectedResult = service.addTreatmentToCollectionIfMissing([], null, treatment, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(treatment);
        });

        it('should return initial array if no Treatment is added', () => {
          const treatmentCollection: ITreatment[] = [{ id: 123 }];
          expectedResult = service.addTreatmentToCollectionIfMissing(treatmentCollection, undefined, null);
          expect(expectedResult).toEqual(treatmentCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
