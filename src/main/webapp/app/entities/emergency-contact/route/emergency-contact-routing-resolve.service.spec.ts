jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEmergencyContact, EmergencyContact } from '../emergency-contact.model';
import { EmergencyContactService } from '../service/emergency-contact.service';

import { EmergencyContactRoutingResolveService } from './emergency-contact-routing-resolve.service';

describe('Service Tests', () => {
  describe('EmergencyContact routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EmergencyContactRoutingResolveService;
    let service: EmergencyContactService;
    let resultEmergencyContact: IEmergencyContact | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EmergencyContactRoutingResolveService);
      service = TestBed.inject(EmergencyContactService);
      resultEmergencyContact = undefined;
    });

    describe('resolve', () => {
      it('should return IEmergencyContact returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmergencyContact = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEmergencyContact).toEqual({ id: 123 });
      });

      it('should return new IEmergencyContact if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmergencyContact = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEmergencyContact).toEqual(new EmergencyContact());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EmergencyContact })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmergencyContact = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultEmergencyContact).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
