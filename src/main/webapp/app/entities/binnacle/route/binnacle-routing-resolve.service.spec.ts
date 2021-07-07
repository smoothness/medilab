jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBinnacle, Binnacle } from '../binnacle.model';
import { BinnacleService } from '../service/binnacle.service';

import { BinnacleRoutingResolveService } from './binnacle-routing-resolve.service';

describe('Service Tests', () => {
  describe('Binnacle routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BinnacleRoutingResolveService;
    let service: BinnacleService;
    let resultBinnacle: IBinnacle | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BinnacleRoutingResolveService);
      service = TestBed.inject(BinnacleService);
      resultBinnacle = undefined;
    });

    describe('resolve', () => {
      it('should return IBinnacle returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBinnacle = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBinnacle).toEqual({ id: 123 });
      });

      it('should return new IBinnacle if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBinnacle = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBinnacle).toEqual(new Binnacle());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Binnacle })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBinnacle = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBinnacle).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
