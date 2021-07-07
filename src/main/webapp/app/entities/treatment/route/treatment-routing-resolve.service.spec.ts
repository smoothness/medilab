jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITreatment, Treatment } from '../treatment.model';
import { TreatmentService } from '../service/treatment.service';

import { TreatmentRoutingResolveService } from './treatment-routing-resolve.service';

describe('Service Tests', () => {
  describe('Treatment routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TreatmentRoutingResolveService;
    let service: TreatmentService;
    let resultTreatment: ITreatment | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TreatmentRoutingResolveService);
      service = TestBed.inject(TreatmentService);
      resultTreatment = undefined;
    });

    describe('resolve', () => {
      it('should return ITreatment returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTreatment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTreatment).toEqual({ id: 123 });
      });

      it('should return new ITreatment if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTreatment = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTreatment).toEqual(new Treatment());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Treatment })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTreatment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTreatment).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
