import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmergencyContact, EmergencyContact } from '../emergency-contact.model';

import { EmergencyContactService } from './emergency-contact.service';

describe('Service Tests', () => {
  describe('EmergencyContact Service', () => {
    let service: EmergencyContactService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmergencyContact;
    let expectedResult: IEmergencyContact | IEmergencyContact[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EmergencyContactService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        phone: 'AAAAAAA',
        email: 'AAAAAAA',
        relationShip: 'AAAAAAA',
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

      it('should create a EmergencyContact', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new EmergencyContact()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a EmergencyContact', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            phone: 'BBBBBB',
            email: 'BBBBBB',
            relationShip: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a EmergencyContact', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            relationShip: 'BBBBBB',
          },
          new EmergencyContact()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of EmergencyContact', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            phone: 'BBBBBB',
            email: 'BBBBBB',
            relationShip: 'BBBBBB',
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

      it('should delete a EmergencyContact', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEmergencyContactToCollectionIfMissing', () => {
        it('should add a EmergencyContact to an empty array', () => {
          const emergencyContact: IEmergencyContact = { id: 123 };
          expectedResult = service.addEmergencyContactToCollectionIfMissing([], emergencyContact);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(emergencyContact);
        });

        it('should not add a EmergencyContact to an array that contains it', () => {
          const emergencyContact: IEmergencyContact = { id: 123 };
          const emergencyContactCollection: IEmergencyContact[] = [
            {
              ...emergencyContact,
            },
            { id: 456 },
          ];
          expectedResult = service.addEmergencyContactToCollectionIfMissing(emergencyContactCollection, emergencyContact);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a EmergencyContact to an array that doesn't contain it", () => {
          const emergencyContact: IEmergencyContact = { id: 123 };
          const emergencyContactCollection: IEmergencyContact[] = [{ id: 456 }];
          expectedResult = service.addEmergencyContactToCollectionIfMissing(emergencyContactCollection, emergencyContact);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(emergencyContact);
        });

        it('should add only unique EmergencyContact to an array', () => {
          const emergencyContactArray: IEmergencyContact[] = [{ id: 123 }, { id: 456 }, { id: 88058 }];
          const emergencyContactCollection: IEmergencyContact[] = [{ id: 123 }];
          expectedResult = service.addEmergencyContactToCollectionIfMissing(emergencyContactCollection, ...emergencyContactArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const emergencyContact: IEmergencyContact = { id: 123 };
          const emergencyContact2: IEmergencyContact = { id: 456 };
          expectedResult = service.addEmergencyContactToCollectionIfMissing([], emergencyContact, emergencyContact2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(emergencyContact);
          expect(expectedResult).toContain(emergencyContact2);
        });

        it('should accept null and undefined values', () => {
          const emergencyContact: IEmergencyContact = { id: 123 };
          expectedResult = service.addEmergencyContactToCollectionIfMissing([], null, emergencyContact, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(emergencyContact);
        });

        it('should return initial array if no EmergencyContact is added', () => {
          const emergencyContactCollection: IEmergencyContact[] = [{ id: 123 }];
          expectedResult = service.addEmergencyContactToCollectionIfMissing(emergencyContactCollection, undefined, null);
          expect(expectedResult).toEqual(emergencyContactCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
