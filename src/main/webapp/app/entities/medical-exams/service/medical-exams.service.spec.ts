import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMedicalExams, MedicalExams } from '../medical-exams.model';

import { MedicalExamsService } from './medical-exams.service';

describe('Service Tests', () => {
  describe('MedicalExams Service', () => {
    let service: MedicalExamsService;
    let httpMock: HttpTestingController;
    let elemDefault: IMedicalExams;
    let expectedResult: IMedicalExams | IMedicalExams[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MedicalExamsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a MedicalExams', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new MedicalExams()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a MedicalExams', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should partial update a MedicalExams', () => {
        const patchObject = Object.assign({}, new MedicalExams());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of MedicalExams', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a MedicalExams', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMedicalExamsToCollectionIfMissing', () => {
        it('should add a MedicalExams to an empty array', () => {
          const medicalExams: IMedicalExams = { id: 123 };
          expectedResult = service.addMedicalExamsToCollectionIfMissing([], medicalExams);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medicalExams);
        });

        it('should not add a MedicalExams to an array that contains it', () => {
          const medicalExams: IMedicalExams = { id: 123 };
          const medicalExamsCollection: IMedicalExams[] = [
            {
              ...medicalExams,
            },
            { id: 456 },
          ];
          expectedResult = service.addMedicalExamsToCollectionIfMissing(medicalExamsCollection, medicalExams);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a MedicalExams to an array that doesn't contain it", () => {
          const medicalExams: IMedicalExams = { id: 123 };
          const medicalExamsCollection: IMedicalExams[] = [{ id: 456 }];
          expectedResult = service.addMedicalExamsToCollectionIfMissing(medicalExamsCollection, medicalExams);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medicalExams);
        });

        it('should add only unique MedicalExams to an array', () => {
          const medicalExamsArray: IMedicalExams[] = [{ id: 123 }, { id: 456 }, { id: 30163 }];
          const medicalExamsCollection: IMedicalExams[] = [{ id: 123 }];
          expectedResult = service.addMedicalExamsToCollectionIfMissing(medicalExamsCollection, ...medicalExamsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const medicalExams: IMedicalExams = { id: 123 };
          const medicalExams2: IMedicalExams = { id: 456 };
          expectedResult = service.addMedicalExamsToCollectionIfMissing([], medicalExams, medicalExams2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medicalExams);
          expect(expectedResult).toContain(medicalExams2);
        });

        it('should accept null and undefined values', () => {
          const medicalExams: IMedicalExams = { id: 123 };
          expectedResult = service.addMedicalExamsToCollectionIfMissing([], null, medicalExams, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medicalExams);
        });

        it('should return initial array if no MedicalExams is added', () => {
          const medicalExamsCollection: IMedicalExams[] = [{ id: 123 }];
          expectedResult = service.addMedicalExamsToCollectionIfMissing(medicalExamsCollection, undefined, null);
          expect(expectedResult).toEqual(medicalExamsCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
