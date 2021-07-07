import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDoctor, Doctor } from '../doctor.model';

import { DoctorService } from './doctor.service';

describe('Service Tests', () => {
  describe('Doctor Service', () => {
    let service: DoctorService;
    let httpMock: HttpTestingController;
    let elemDefault: IDoctor;
    let expectedResult: IDoctor | IDoctor[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DoctorService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        specialty: 'AAAAAAA',
        active: false,
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

      it('should create a Doctor', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Doctor()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Doctor', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            specialty: 'BBBBBB',
            active: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Doctor', () => {
        const patchObject = Object.assign(
          {
            active: true,
          },
          new Doctor()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Doctor', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            specialty: 'BBBBBB',
            active: true,
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

      it('should delete a Doctor', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDoctorToCollectionIfMissing', () => {
        it('should add a Doctor to an empty array', () => {
          const doctor: IDoctor = { id: 123 };
          expectedResult = service.addDoctorToCollectionIfMissing([], doctor);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(doctor);
        });

        it('should not add a Doctor to an array that contains it', () => {
          const doctor: IDoctor = { id: 123 };
          const doctorCollection: IDoctor[] = [
            {
              ...doctor,
            },
            { id: 456 },
          ];
          expectedResult = service.addDoctorToCollectionIfMissing(doctorCollection, doctor);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Doctor to an array that doesn't contain it", () => {
          const doctor: IDoctor = { id: 123 };
          const doctorCollection: IDoctor[] = [{ id: 456 }];
          expectedResult = service.addDoctorToCollectionIfMissing(doctorCollection, doctor);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(doctor);
        });

        it('should add only unique Doctor to an array', () => {
          const doctorArray: IDoctor[] = [{ id: 123 }, { id: 456 }, { id: 12282 }];
          const doctorCollection: IDoctor[] = [{ id: 123 }];
          expectedResult = service.addDoctorToCollectionIfMissing(doctorCollection, ...doctorArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const doctor: IDoctor = { id: 123 };
          const doctor2: IDoctor = { id: 456 };
          expectedResult = service.addDoctorToCollectionIfMissing([], doctor, doctor2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(doctor);
          expect(expectedResult).toContain(doctor2);
        });

        it('should accept null and undefined values', () => {
          const doctor: IDoctor = { id: 123 };
          expectedResult = service.addDoctorToCollectionIfMissing([], null, doctor, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(doctor);
        });

        it('should return initial array if no Doctor is added', () => {
          const doctorCollection: IDoctor[] = [{ id: 123 }];
          expectedResult = service.addDoctorToCollectionIfMissing(doctorCollection, undefined, null);
          expect(expectedResult).toEqual(doctorCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
