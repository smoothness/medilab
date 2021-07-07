jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDoctor, Doctor } from '../doctor.model';
import { DoctorService } from '../service/doctor.service';

import { DoctorRoutingResolveService } from './doctor-routing-resolve.service';

describe('Service Tests', () => {
  describe('Doctor routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DoctorRoutingResolveService;
    let service: DoctorService;
    let resultDoctor: IDoctor | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DoctorRoutingResolveService);
      service = TestBed.inject(DoctorService);
      resultDoctor = undefined;
    });

    describe('resolve', () => {
      it('should return IDoctor returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDoctor = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDoctor).toEqual({ id: 123 });
      });

      it('should return new IDoctor if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDoctor = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDoctor).toEqual(new Doctor());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Doctor })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDoctor = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultDoctor).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
