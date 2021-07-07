jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAilment, Ailment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';

import { AilmentRoutingResolveService } from './ailment-routing-resolve.service';

describe('Service Tests', () => {
  describe('Ailment routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AilmentRoutingResolveService;
    let service: AilmentService;
    let resultAilment: IAilment | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AilmentRoutingResolveService);
      service = TestBed.inject(AilmentService);
      resultAilment = undefined;
    });

    describe('resolve', () => {
      it('should return IAilment returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAilment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAilment).toEqual({ id: 123 });
      });

      it('should return new IAilment if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAilment = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAilment).toEqual(new Ailment());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Ailment })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAilment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAilment).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
